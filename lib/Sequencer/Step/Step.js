import { STEP_LENGTH } from '../constants';

/**
 * Abstraction around sequencer steps.
 */
export default class Step {
    /**
     * @param {Number} position
     */
    constructor(position) {
        this.position = position;
        this.length = STEP_LENGTH;

        // Pass this instance to the handler attached to the scheduler.
        this.args = this;
    }
}
