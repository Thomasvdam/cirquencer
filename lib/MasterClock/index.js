// Mostly copied from https://github.com/mmckegg/bopper

import Stream from 'stream';
import { now } from '../TimingContext';

const DEFAULT_TEMPO = 120;
const STEPS_PER_BEAT = 4;
const CYCLE_LENGTH = (1 / 44100) * 1024;
const PRE_CYCLE = 2;

export default class MasterClock extends Stream {
    constructor() {
        super();

        this.readable = true;
        this.writable = false;

        this._state = {
            lastTo: 0,
            lastEndTime: 0,
            playing: false,
            bpm: DEFAULT_TEMPO,
            beatDuration: 60 / DEFAULT_TEMPO,
            stepDuration: (60 / DEFAULT_TEMPO) / STEPS_PER_BEAT,
            increment: (DEFAULT_TEMPO / 60) * CYCLE_LENGTH,
        };

        global.setInterval(this._onTick.bind(this), CYCLE_LENGTH * 1000);
    }

    isPlaying() {
        return this._state.playing;
    }

    start() {
        this._state.playing = true;
        this.emit('start');
    }

    stop() {
        this._state.playing = false;
        this.emit('stop');
    }

    getTempo() {
        return this._state.tempo;
    }

    setTempo(newTempo) {
        const bps = newTempo / 60;
        this._state.beatDuration = 60 / newTempo;
        this._state.stepDuration = this._state.beatDuration / STEPS_PER_BEAT;
        this._state.increment = bps * CYCLE_LENGTH;
        this._state.bpm = newTempo;

        this.emit('tempo', newTempo);
    }

    getCurrentPosition() {
        const { lastEndTime, lastTo, beatDuration } = this._state;
        const delta = lastEndTime - now();
        return lastTo - (delta / beatDuration);
    }

    schedule(duration) {
        const newEndTime = now() + duration;
        const { lastEndTime } = this._state;

        if (newEndTime < lastEndTime) {
            return;
        }

        this._state.lastEndTime = newEndTime;

        if (!this._state.playing) {
            return;
        }

        const actualDuration = newEndTime - lastEndTime;
        const length = actualDuration / this._state.stepDuration;

        const { lastTo } = this._state;
        const newTo = lastTo + length;
        this._state.lastTo = newTo;

        this._schedule(lastEndTime, lastTo, newTo);
    }

    _schedule(time, from, to) {
        const { beatDuration, stepDuration } = this._state;
        const duration = (to - from) * stepDuration;

        this.emit('data', {
            from,
            to,
            time,
            duration,
            beatDuration,
            stepDuration,
        });
    }

    _onTick() {
        this.schedule(CYCLE_LENGTH * PRE_CYCLE);
    }
}
