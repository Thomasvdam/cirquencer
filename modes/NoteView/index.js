import SequencerInterface from '../../lib/Sequencer';


export default class NoteView {
    constructor(lpController) {
        assert(lpController, 'lpController required');

        this._lpController = lpController;
        this._observables = [];

        this._state = {};

        this.onInput = this.onInput.bind(this);
    }

    load(index) {
        this._lpController.input.on('data', this.onInput);

        this._lpController.reset();
    }

    unLoad() {
        while (this._observables.length) {
            const removeWatcher = this._observables.shift();
            removeWatcher();
        }

        this._lpController.input.removeListener('data', this.onInput);
    }
}
