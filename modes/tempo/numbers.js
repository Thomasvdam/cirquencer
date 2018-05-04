import { Pad, lights } from '../../lib/LaunchPadMini/pad';
import zip from '../../lib/utils/zip';

const COLOURS = [
    lights.green,
    lights.amber,
    lights.green,
];

const blank = [
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0],
];

const zero = [
    [1, 1, 1],
    [1, 0, 1],
    [1, 0, 1],
    [1, 1, 1],
];

const one = [
    [0, 1, 0],
    [0, 1, 0],
    [0, 1, 0],
    [0, 1, 0],
];

const two = [
    [0, 1, 1],
    [0, 0, 1],
    [0, 1, 0],
    [0, 1, 1],
];

const three = [
    [1, 1, 1],
    [0, 1, 1],
    [0, 0, 1],
    [1, 1, 1],
];

const four = [
    [1, 0, 0],
    [1, 0, 1],
    [1, 1, 1],
    [0, 0, 1],
];

const five = [
    [0, 1, 1],
    [0, 1, 0],
    [0, 0, 1],
    [0, 1, 1],
];

const six = [
    [0, 1, 0],
    [0, 1, 0],
    [0, 1, 1],
    [0, 1, 1],
];

const seven = [
    [0, 1, 1],
    [0, 0, 1],
    [0, 0, 1],
    [0, 0, 1],
];

const eight = [
    [1, 1, 1],
    [1, 1, 1],
    [1, 0, 1],
    [1, 1, 1],
];

const nine = [
    [0, 1, 1],
    [0, 1, 1],
    [0, 0, 1],
    [0, 0, 1],
];

const NUMBERS = {
    0: zero,
    1: one,
    2: two,
    3: three,
    4: four,
    5: five,
    6: six,
    7: seven,
    8: eight,
    9: nine,
    blank,
};

const diff = (from, to) => {
    const fromNumber = from ? NUMBERS[from] : NUMBERS.blank;
    const toNumber = to ? NUMBERS[to] : NUMBERS.blank;

    const delta = fromNumber.map((row, columnIndex) => {
        const rowDelta = row.map((fromValue, rowIndex) => {
            const toValue = toNumber[columnIndex][rowIndex];

            const result = fromValue === toValue ? null : toValue;
            return result;
        });

        return rowDelta;
    });

    return delta;
};

/**
 * Calculate how much to move the number over, taking into account that the first digit only takes
 * up 2 spaces instead of 3.
 * @param {Number} position
 */
const calcDisplacement = (position) => {
    if (position === 0) {
        return -1;
    }

    return 2 + ((position - 1) * 3);
};

/**
 * Convert a number delta into the pads that need to be updated.
 * @param {Number[][]} delta
 * @param {Number} position The digit position. Either 0, 1 or 2.
 * @param {Number} colour
 * @returns {Pad}
 */
const deltaToPads = (delta, position, colour) => {
    const pads = delta.reduce((result, row, columnIndex) => {
        row.forEach((on, rowIndex) => {
            if (on !== null) {
                const x = rowIndex + calcDisplacement(position);
                const key = `${x}:${columnIndex}`;

                const value = on ? colour : lights.off;
                result.push(new Pad(key, value));
            }
        });

        return result;
    }, []);

    return pads;
};

/**
 * @param {Number} number
 */
const formatNumber = (number) => {
    if (!number) {
        return [null, null, null];
    }

    const numberDigits = number.toString().split('');

    while (numberDigits.length < 3) {
        numberDigits.unshift(null);
    }

    return numberDigits;
};

/**
 * @param {Number} from
 * @param {Number} to
 */
export const numberToPadUpdates = (from, to) => {
    const fromDigits = formatNumber(from);
    const toDigits = formatNumber(to);

    const digitPairs = zip(fromDigits, toDigits);

    const result = digitPairs.map((pair, index) => {
        const delta = diff(pair[0], pair[1]);
        return deltaToPads(delta, index, COLOURS[index]);
    });

    return result;
};

export default numberToPadUpdates;
