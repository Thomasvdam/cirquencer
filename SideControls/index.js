import assert from 'assert';

import SequencerInterface from '../lib/Sequencer';
import CirquencerState from '../state';

import getButtons from './buttons';
import { Pad, lights } from '../lib/LaunchPadMini/pad';
import buttonCodes from './buttonCodes';

export default class SideControls {
    constructor(lpController) {
        assert(lpController, 'lpController required');

        this._lpController = lpController;

        this._state = {};

        this.onInput = this.onInput.bind(this);
        this.drawButtons = this.drawButtons.bind(this);

        this._lpController.input.on('data', this.onInput);

        CirquencerState.shiftPressed(this.drawButtons);
        CirquencerState.mode(this.drawButtons);
        SequencerInterface.recording(this.drawButtons);
        SequencerInterface.playing(this.drawButtons);
    }

    drawButtons() {
        const buttons = getButtons();

        Object.keys(buttons).forEach((buttonKey) => {
            const button = buttons[buttonKey];
            let padColour = button ? buttons[buttonKey].colour : lights.off;

            if (button && button.modeSwitch && button.value === CirquencerState.mode()) {
                padColour = lights.amber;
            }

            this._lpController.output.write(new Pad(buttonKey, padColour));
        });

        // Cache the current button state.
        this._state.buttons = buttons;
    }

    onInput(pad) {
        const button = this._state.buttons[pad.key];

        if (!button) {
            return;
        }

        if (button.modeSwitch && pad.value !== 0) {
            this.handleModeSwitch(button);
            return;
        }

        if (button.value === buttonCodes.SHIFT) {
            this.handleShift(pad);
            return;
        }

        if (pad.value !== 0) {
            this.handleStateSwitch(button);
        }
    }

    handleShift(pad) {
        if (pad.value === 0) {
            CirquencerState.shiftPressed.set(false);
        } else {
            CirquencerState.shiftPressed.set(true);
        }
    }

    handleModeSwitch(button) {
        CirquencerState.mode.set(button.value);
    }

    handleStateSwitch(button) {
        switch (button.value) {
        case buttonCodes.PLAY:
            SequencerInterface.restart();
            break;
        case buttonCodes.RESUME:
            SequencerInterface.playing.set(true);
            break;
        case buttonCodes.PAUSE:
            SequencerInterface.playing.set(false);
            break;
        case buttonCodes.RECORD:
            SequencerInterface.recording.set(true);
            break;
        case buttonCodes.STOP_RECORDING:
            SequencerInterface.recording.set(false);
            break;
        default:
            break;
        }
    }
}
