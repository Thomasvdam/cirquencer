import { Struct as MutantStruct } from 'mutant';

import modes from './modes/modes';

const cirquencerState = MutantStruct({
    shiftPressed: false,
    mode: modes.TEMPO,
});

export default cirquencerState;
