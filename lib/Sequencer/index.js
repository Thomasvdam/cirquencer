import sequencerState from './state';


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

export default SequencerInterface;
