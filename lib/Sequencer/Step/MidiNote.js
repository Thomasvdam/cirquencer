import SequencerInterface from '..';
import { now } from '../../TimingContext';

/**
 * Abstraction around sequencer steps.
 */
export default class MidiNote {
    /**
     * @param {NumberObsv} channel
     * @param {BooleanObsv} muted
     * @param {Number} position
     * @param {Number} length
     * @param {Number} note 0-127
     * @param {Number} velocity 1-127
     */
    constructor(channel, muted, position, length, note, velocity) {
        this._channel = channel;
        this._muted = muted;

        this.position = position;
        this.length = length;

        this.note = note;
        this.velocity = velocity;

        // Pass this instance to the handler attached to the scheduler.
        this.args = this;
    }

    start() {
        if (this._muted()) {
            return;
        }

        const midiCommand = [144 + (this.channel() - 1), this.note, this.velocity];
        SequencerInterface.output.write(midiCommand, now());

        this.playing = true;
    }

    stop() {
        const midiCommand = [128 + (this.channel() - 1), this.note, 0];
        SequencerInterface.output.write(midiCommand, now());

        this.playing = false;
    }
}
