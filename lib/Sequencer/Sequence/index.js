import { Array as MutantArray, Value } from 'mutant';

import { MAX_PATTERN_LENGTH, STEP_LENGTH, DEFAULT_PATTERN_LENGTH, MIN_PATTERN_LENGTH } from '../constants';
import sequencerState from '../state';
import Step from '../Step/Step';
import MidiNote from '../Step/MidiNote';

const createSteps = () => {
    const steps = [];

    for (let i = 0; i < MAX_PATTERN_LENGTH; i += STEP_LENGTH) {
        steps.push(new Step(i));
    }

    return steps;
};

export default class Sequence {
    constructor(id, channel) {
        this._id = id;
        this._channel = Value(channel);

        this.length = Value(DEFAULT_PATTERN_LENGTH);
        this.steps = createSteps(this._channel);
        this.muted = Value(false);
        this.midiNotes = MutantArray();

        this.updateSequence = this.updateSequence.bind(this);

        this.length(this.updateSequence);
        this.midiNotes(this.updateSequence);

        this.updateSequence();
    }

    setLength(newLength) {
        if ((MIN_PATTERN_LENGTH <= newLength) && (newLength <= MAX_PATTERN_LENGTH)) {
            this.length.set(newLength);
        }
    }

    getCurrentPosition() {
        return sequencerState.masterClock.getCurrentPosition() % this.length();
    }

    getNotesForPosition(position) {
        const notes = this.midiNotes().filter(midiNote =>
            position <= midiNote.position && midiNote.position < position + STEP_LENGTH);

        return notes;
    }

    addNote(position, note, velocity, length = STEP_LENGTH) {
        const newNote = new MidiNote(this._channel, this.muted, Math.round(position), length, note, velocity);
        this.midiNotes.push(newNote);
    }

    clearNote(targetNote) {
        this.midiNotes.deleteAt(this.midiNotes.indexOf(targetNote));
    }

    updateSequence() {
        const stepsToLoop = this.steps.filter(step => step.position < this.length());
        const notesToLoop = this.midiNotes().filter(midiNote => midiNote.position < this.length());

        const eventsToLoop = stepsToLoop.concat(notesToLoop);

        sequencerState.scheduler.setLoop(this._id, eventsToLoop, this.length());
    }
}
