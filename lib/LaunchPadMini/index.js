import { Transform } from 'stream';
import assert from 'assert';

import { mapDataToPad, mapPadToData } from './pad';
import { RESET_MIDI_COMMAND } from './constants';
import LaunchPadState from './LaunchPadState';

export default class LaunchPadMini {
    constructor(midiStream) {
        assert(midiStream, 'midiStream required');

        this.state = new LaunchPadState();

        this.input = new Transform({
            readableObjectMode: true,
            writableObjectMode: true,
            transform: mapDataToPad,
        });

        this.output = new Transform({
            readableObjectMode: true,
            writableObjectMode: true,
            transform: this.shouldPadUpdate.bind(this),
        });

        this._midiStream = midiStream;

        this._midiStream.pipe(this.input);
        this.output.pipe(this._midiStream);
    }

    shouldPadUpdate(chunk, encoding, callback) {
        if (this.state.shouldUpdate(chunk)) {
            mapPadToData(chunk, encoding, callback);
        } else {
            callback(null, null);
        }
    }

    /**
     * Turn all lights on the LP off.
     */
    reset() {
        this.state.reset();
        this._midiStream.write(RESET_MIDI_COMMAND);
    }
}
