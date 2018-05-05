// Mostly copied from https://github.com/mmckegg/ditty/

import Stream from 'stream';
import { now } from '../TimingContext';

const shouldSendImmediately = (message, loop) => message.event === 'stop' && (!loop);

const getAbsolutePosition = (position, start, length) => {
    const wrappedPosition = position % length;
    const micro = start % length;
    const targetPosition = (start + wrappedPosition) - micro;

    if (targetPosition < start) {
        return targetPosition + length;
    }

    return targetPosition;
};

export default class EventLooper extends Stream {
    constructor() {
        super();

        this.readable = true;
        this.writable = true;

        this._state = {
            loops: {},
            lengths: {},
            ids: [],
            queue: [],
        };
    }

    getLoop(id) {
        return this._state.loops[id];
    }

    setLoop(id, events, length = 8) {
        if (events) {
            this._state.loops[id] = events;
            this._state.lengths[id] = length;
        } else {
            this._state.loops[id] = null;
            this._state.lengths[id] = null;
        }

        if (this._state.loops[id]) {
            this.emit('change', {
                id,
                events,
                length,
            });
        } else {
            this.emit('change', {
                id,
            });
        }
    }

    getLength(id) {
        return this._state.lengths[id];
    }

    getIds() {
        return Object.keys(this._state.loops);
    }

    getLoops() {
        return Object.keys(this._state.loops).map(id => ({
            id,
            events: this._state.loops[id],
            length: this._state.lengths[id],
        }));
    }

    update(loop) {
        this.setLoop(loop.id, loop.events, loop.length);
    }

    push(data) {
        this.emit('data', data);
    }

    write(obj) {
        this._transform(obj);
    }

    _transform(obj) {
        const begin = now();
        const endAt = begin + (obj.duration * 900);

        const {
            from,
            to,
            time,
            beatDuration,
        } = obj;


        for (let i = this._state.queue.length - 1; i >= 0; i -= 1) {
            const item = this._state.queue[i];
            if (to > item.position || shouldSendImmediately(item, this._state.loops[item.id])) {
                if (to > item.position) {
                    const delta = (item.position - from) * beatDuration;
                    item.time = time + delta;
                } else {
                    item.time = time;
                    item.position = from;
                }

                this._state.queue.splice(i, 1);
                this.push(item);
            }
        }

        const localQueue = [];
        Object.keys(this._state.loops).forEach((id) => {
            const events = this._state.loops[id];
            const loopLength = this._state.lengths[id];

            events.forEach((event) => {
                const startPosition = getAbsolutePosition(event.position, from, loopLength);
                const endPosition = startPosition + event.length;

                if (startPosition >= from && startPosition < to) {
                    const delta = (startPosition - from) * beatDuration;
                    const duration = event.length * beatDuration;
                    const startTime = time + delta;
                    const endTime = startTime + duration;

                    localQueue.push({
                        id,
                        event: 'start',
                        position: startPosition,
                        args: event.args,
                        time: startTime,
                    });

                    localQueue.push({
                        id,
                        event: 'stop',
                        position: endPosition,
                        args: event.args,
                        time: endTime,
                    });
                }
            });
        });

        const nextTime = time + obj.duration;

        localQueue.sort((a, b) => a.time - b.time);
        localQueue.forEach((item) => {
            if (item.time < nextTime) {
                if (now() < endAt) {
                    this.push(item);
                }
            } else {
                this._state.queue.push(item);
            }
        });
    }
}
