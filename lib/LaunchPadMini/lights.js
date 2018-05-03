// Taken from https://github.com/mmckegg with minor modifications
/* eslint-disable no-param-reassign */

const lightCode = (r, g, flag) => {
    if (!r || r < 0) {
        r = 0;
    }

    if (r > 3) {
        r = 3;
    }

    if (!g || g < 0) {
        g = 0;
    }

    if (g > 3) {
        g = 3;
    }

    if (flag === 'flash') {
        flag = 8;
    } else if (flag === 'buffer') {
        flag = 0;
    } else {
        flag = 12;
    }

    return ((16 * g) + r) + flag;
};


export default {
    off: 0,
    greenLow: lightCode(0, 1),
    greenMed: lightCode(0, 2),
    green: lightCode(0, 3),
    redLow: lightCode(1, 0),
    redMed: lightCode(2, 0),
    red: lightCode(3, 0),
    amberLow: lightCode(1, 1),
    amber: lightCode(3, 3),
    yellow: lightCode(1, 3),
};
