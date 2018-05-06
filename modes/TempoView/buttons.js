import { lights } from '../../lib/LaunchPadMini/pad';

const BUTTONS = {
    '7:7': {
        modifier: 10,
        value: lights.green,
    },
    '6:7': {
        modifier: 5,
        value: lights.greenMed,
    },
    '5:7': {
        modifier: 1,
        value: lights.greenLow,
    },
    '2:7': {
        modifier: -1,
        value: lights.redLow,
    },
    '1:7': {
        modifier: -5,
        value: lights.redMed,
    },
    '0:7': {
        modifier: -10,
        value: lights.red,
    },
};

export default BUTTONS;
