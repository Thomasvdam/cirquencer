import { PAD_PRESSED_VALUE, TOP_ROW_CODE, GRID_SIDE_CODE } from './constants';

export { lights } from './lights';

/**
 * Abstraction around LaunchPad pads
 */
export class Pad {
    /**
     * @param {String} key
     * @param {Number} value
     */
    constructor(key, value) {
        this.key = key;
        this.value = value;
    }

    get pressed() {
        return this.value === PAD_PRESSED_VALUE;
    }
}

/**
 * Function to be used as transform for a stream. Maps raw midi data to a pad
 * abstraction.
 * @param {Array} chunk
 * @param {String} encoding
 * @param {Function} callback
 */
export const mapDataToPad = (chunk, encoding, callback) => {
    const [x, y, value] = chunk;
    const keyParts = [];

    if (x === TOP_ROW_CODE) {
        keyParts.push(y - 104);
        keyParts.push('T');
    } else if ((y & 8) === 8) { // eslint-disable-line no-bitwise
        keyParts.push('R');
        keyParts.push(Math.floor(y / 16));
    } else {
        keyParts.push(y % 16);
        keyParts.push(Math.floor(y / 16));
    }

    const key = keyParts.join(':');

    callback(null, new Pad(key, value));
};

/**
 * Function to be used as transform for a stream. Maps a pad abstraction back to
 * midi data.
 * @param {Pad} chunk
 * @param {String} encoding
 * @param {Function} callback
 */
export const mapPadToData = (chunk, encoding, callback) => {
    const { value } = chunk;
    const keyParts = chunk.key.split(':');

    const data = [];

    if (keyParts[1] === 'T') {
        data.push(TOP_ROW_CODE);
        data.push(parseInt(keyParts[0], 10) + 104);
    } else if (keyParts[0] === 'R') {
        data.push(GRID_SIDE_CODE);

        const y = parseInt(keyParts[1], 10);
        data.push((y * 16) + 8);
    } else {
        data.push(GRID_SIDE_CODE);

        const x = parseInt(keyParts[0], 10);
        const y = parseInt(keyParts[1], 10);
        data.push((y * 16) + x);
    }

    data.push(value);

    callback(null, data);
};
