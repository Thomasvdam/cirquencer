import {
    Array as MutantArray,
    Struct as MutantStruct,
} from 'mutant';

import { NOTE_MODE } from './constants/modes';
import { C_MAJOR } from './constants/scales';

import MasterClock from '../MasterClock';
import EventLooper from '../EventLooper';

const clock = new MasterClock();
const eventLooper = new EventLooper();

eventLooper.setLoop('test', [
    { position: 0, length: 0.25, args: ['0:0'] },
    { position: 0.25, length: 0.25, args: ['1:0'] },
    { position: 0.5, length: 0.25, args: ['2:0'] },
    { position: 0.75, length: 0.25, args: ['3:0'] },
], 1);

clock.start();

const cirquencerState = MutantStruct({
    tempo: 120,
    playing: false,
    recording: false,
    mode: NOTE_MODE,
    scale: C_MAJOR,
    notes: MutantArray(),
    sequences: MutantArray(),
});

// Make clock and scheduler easily accessible. There are probably better ways to do this.
cirquencerState.scheduler = eventLooper;
cirquencerState.masterClock = clock.pipe(eventLooper);

// Connect state observables to the underlying mechanisms.
cirquencerState.tempo((newTempo) => {
    cirquencerState.masterClock.setTempo(newTempo);
});

cirquencerState.playing((newState) => {
    if (newState) {
        cirquencerState.masterClock.start();
    } else {
        cirquencerState.masterClock.stop();
    }
});

export default cirquencerState;
