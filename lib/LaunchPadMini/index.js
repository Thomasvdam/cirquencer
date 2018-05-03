import { Transform } from 'stream';
import assert from 'assert';

import { mapDataToPad, mapPadToData } from './pad';

export default class LaunchPadMini {
    constructor(midiStream) {
        assert(midiStream, 'midiStream required');

        this.input = new Transform({
            readableObjectMode: true,
            writableObjectMode: true,
            transform: mapDataToPad,
        });

        this.output = new Transform({
            readableObjectMode: true,
            writableObjectMode: true,
            transform: mapPadToData,
        });

        this._midiStream = midiStream;

        this._midiStream.pipe(this.input);
        this.output.pipe(this._midiStream);
    }

    /**
     * Turn all lights on the LP off.
     */
    reset() {
        this._midiStream.write([176, 0, 0]);
    }
}
