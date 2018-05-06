import { lights } from '../lib/LaunchPadMini/pad';

import modes from '../modes/modes';
import buttonCodes from './buttonCodes';

const shift = {
    colour: lights.redLow,
    modeSwitch: false,
    value: buttonCodes.SHIFT,
};

const shiftPressed = {
    colour: lights.amber,
    modeSwitch: false,
    value: buttonCodes.SHIFT,
};

const note = {
    colour: lights.amberLow,
    modeSwitch: true,
    value: modes.NOTE,
};

const fullNote = {
    colour: lights.amberLow,
    modeSwitch: true,
    value: modes.FULL_NOTE,
};

const gate = {
    colour: lights.amberLow,
    modeSwitch: true,
    value: modes.GATE,
};

const velocity = {
    colour: lights.amberLow,
    modeSwitch: true,
    value: modes.VELOCITY,
};

const tempo = {
    colour: lights.amberLow,
    modeSwitch: true,
    value: modes.TEMPO,
};

const swing = {
    colour: lights.amberLow,
    modeSwitch: true,
    value: modes.SWING,
};

const scale = {
    colour: lights.amberLow,
    modeSwitch: true,
    value: modes.SCALE,
};

const settings = {
    colour: lights.amberLow,
    modeSwitch: true,
    value: modes.SETTINGS,
};

const record = {
    colour: lights.redLow,
    modeSwitch: false,
    value: buttonCodes.RECORD,
};

const stopRecording = {
    colour: lights.red,
    modeSwitch: false,
    value: buttonCodes.STOP_RECORDING,
};

const play = {
    colour: lights.greenLow,
    modeSwitch: false,
    value: buttonCodes.PLAY,
};

const pause = {
    colour: lights.green,
    modeSwitch: false,
    value: buttonCodes.PAUSE,
};

const resume = {
    colour: lights.yellow,
    modeSwitch: false,
    value: buttonCodes.RESUME,
};

export default {
    shift,
    shiftPressed,
    note,
    fullNote,
    gate,
    velocity,
    tempo,
    swing,
    scale,
    settings,
    record,
    stopRecording,
    play,
    pause,
    resume,
};
