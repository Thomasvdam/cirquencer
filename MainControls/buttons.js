import SequencerInterface from '../lib/Sequencer';
import CirquencerState from '../state';

import buttonFunctions from './buttonFunctions';

const BUTTONS_DEFAULT = {
    'R:0': buttonFunctions.shift,
    'R:1': buttonFunctions.note,
    'R:2': buttonFunctions.gate,
    'R:3': buttonFunctions.velocity,
    'R:4': buttonFunctions.tempo,
    'R:5': buttonFunctions.scale,
    'R:6': buttonFunctions.record,
    'R:7': buttonFunctions.play,
};

const BUTTONS_SHIFT = {
    'R:0': buttonFunctions.shiftPressed,
    'R:1': buttonFunctions.fullNote,
    'R:2': null,
    'R:3': buttonFunctions.swing,
    'R:4': buttonFunctions.settings,
    'R:5': null,
    'R:6': buttonFunctions.record,
    'R:7': buttonFunctions.resume,
};

/**
 * Get the button mapping for the current state.
 * @returns {Object}
 */
const getButtons = () => {
    const shiftPressed = CirquencerState.shiftPressed();
    const playing = SequencerInterface.playing();
    const recording = SequencerInterface.recording();

    const base = shiftPressed ? BUTTONS_SHIFT : BUTTONS_DEFAULT;

    const result = Object.assign({}, base);

    if (playing) {
        result['R:7'] = buttonFunctions.pause;
    }

    if (recording) {
        result['R:6'] = buttonFunctions.stopRecording;
    }

    return result;
};

export default getButtons;
