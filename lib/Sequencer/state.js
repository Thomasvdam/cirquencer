import {
    Array as MutantArray,
    Struct as MutantStruct,
} from 'mutant';

import { C_MAJOR } from './constants/scales';

import MasterClock from '../MasterClock';
import EventLooper from '../EventLooper';

const clock = new MasterClock();
const eventLooper = new EventLooper();

const testEvents = [
    { position: 0, length: 1, args: ['0:T'] },
    { position: 1, length: 1, args: ['1:T'] },
    { position: 2, length: 1, args: ['2:T'] },
    { position: 3, length: 1, args: ['3:T'] },
];

eventLooper.setLoop('test', testEvents, 4);

const sequencerState = MutantStruct({
    tempo: 120,
    playing: false,
    recording: false,
    scale: C_MAJOR,
    notes: MutantArray(),
    sequences: MutantArray(),
});

// Make clock and scheduler easily accessible. There are probably better ways to do this.
sequencerState.scheduler = eventLooper;
sequencerState.masterClock = clock;
sequencerState.eventStream = clock.pipe(eventLooper);

// Connect state observables to the underlying mechanisms.
sequencerState.tempo((newTempo) => {
    clock.setTempo(newTempo);
});

sequencerState.playing((newState) => {
    if (newState) {
        clock.start();
    } else {
        clock.stop();
    }
});

export default sequencerState;
