import { Pad, lights } from './pad';
import { GRID_SIZE } from './constants';

const createGrid = () => {
    const grid = {};

    for (let x = 0; x < GRID_SIZE; x += 1) {
        const topKey = `${x}:T`;
        grid[topKey] = lights.off;

        const sideKey = `R:${x}`;
        grid[sideKey] = lights.off;

        for (let y = 0; y < GRID_SIZE; y += 1) {
            const key = `${x}:${y}`;
            grid[key] = lights.off;
        }
    }

    return grid;
};

export default class LaunchPadState {
    constructor() {
        this.reset();
    }

    reset() {
        this.grid = createGrid();
    }

    /**
     * @param {Pad} pad
     * @returns {Boolean}
     */
    shouldUpdate(pad) {
        if (this.grid[pad.key] === pad.value) {
            return false;
        }

        this.grid[pad.key] = pad.value;
        return true;
    }
}
