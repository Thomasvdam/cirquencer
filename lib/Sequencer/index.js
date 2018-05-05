import sequencerState from './state';

import { NUMBER_OF_SEQUENCES, MIN_TEMPO, MAX_TEMPO } from './constants';
import Sequence from './Sequence';

const SequencerInterface = {
    setTempo: (newTempo) => {
        if ((MIN_TEMPO <= newTempo) && (newTempo <= MAX_TEMPO)) {
            sequencerState.tempo.set(newTempo);
        }
    },
    restart: () => {
        // Dummy
        console.log('Should restart but for now just resume');
        sequencerState.playing.set(true);
    },
};

Object.assign(SequencerInterface, sequencerState);

// Create sequences
for (let i = 0; i < NUMBER_OF_SEQUENCES; i += 1) {
    sequencerState.sequences.push(new Sequence(i, i + 1));
}

export default SequencerInterface;
