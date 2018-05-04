import assert from 'assert';

import SequencerInterface from '../../lib/Sequencer';
import { Pad, lights } from '../../lib/LaunchPadMini/pad';

import BUTTONS from './buttons';
import { numberToPadUpdates } from './numbers';

export default class TempoView {
    constructor(lpController) {
        assert(lpController, 'lpController required');

        this._lpController = lpController;
        this._observables = [];

        this._state = {};

        this.onInput = this.onInput.bind(this);
        this.onTempoChanged = this.onTempoChanged.bind(this);
    }

    load() {
        this._observables.push(SequencerInterface.tempo(this.onTempoChanged));
        this._lpController.input.on('data', this.onInput);

        this._state.heldButton = null;
        this._state.previousTempo = null;

        // Reset LP and redraw
        this._lpController.reset();
        this.drawButtons();
        this.onTempoChanged(SequencerInterface.tempo());
    }

    unLoad() {
        while (this._observables.length) {
            const removeWatcher = this._observables.shift();
            removeWatcher();
        }

        this._lpController.input.removeListener('data', this.onInput);
    }

    drawButtons() {
        Object.keys(BUTTONS).forEach((buttonKey) => {
            this._lpController.output.write(new Pad(buttonKey, BUTTONS[buttonKey].value));
        });
    }

    /**
     * @param {Pad} pad
     */
    onInput(pad) {
        if (pad.value === 0) {
            if (this._state.heldButton && pad.key === this._state.heldButton) {
                this.resetHeldButton();
            }

            return;
        }

        if (BUTTONS[pad.key]) {
            if (this._state.heldButton) {
                this.resetHeldButton(pad.key);
            }

            SequencerInterface.setTempo(SequencerInterface.tempo() + BUTTONS[pad.key].modifier);

            this.setHeldButton(pad.key);
        }
    }

    /**
     * @param {Number} newTempo
     */
    onTempoChanged(newTempo) {
        const updates = numberToPadUpdates(this._state.previousTempo, newTempo);

        updates.forEach((pads) => {
            pads.forEach((padUpdate) => {
                this._lpController.output.write(padUpdate);
            });
        });

        this._state.previousTempo = newTempo;
    }

    /**
     * @param {String} buttonKey
     */
    setHeldButton(buttonKey) {
        this._state.heldButton = buttonKey;
        this._lpController.output.write(new Pad(this._state.heldButton, lights.yellow));
    }

    resetHeldButton() {
        const buttonKey = this._state.heldButton;
        this._lpController.output.write(new Pad(buttonKey, BUTTONS[buttonKey].value));

        this._state.heldButton = null;
    }
}
