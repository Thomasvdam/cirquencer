import MidiStream from 'midi-stream';
import nodeCleanUp from 'node-cleanup';

import cirquencerState from './lib/Cirquencer/state';
import LaunchPadMini from './lib/LaunchPadMini';

MidiStream.getPortNames((err, names) => {
    console.log('names ::: ', names);

    const [lpName] = names;
    const lpStream = MidiStream(lpName);

    const lpController = new LaunchPadMini(lpStream);
    lpController.input.on('data', (pad) => {
        lpController.output.write(pad);

        if (pad.value === 0) {
            return;
        }

        if (pad.key === '7:7') {
            cirquencerState.tempo.set(cirquencerState.tempo() + 5);
        } else if (pad.key === '0:7') {
            cirquencerState.tempo.set(cirquencerState.tempo() - 5);
        }
    });


    cirquencerState.masterClock.on('data', (data) => {
        if (data.id === 'test') {
            const [key] = data.args;

            if (data.event === 'start') {
                lpController.output.write({
                    key,
                    value: 127,
                });
            } else {
                lpController.output.write({
                    key,
                    value: 0,
                });
            }
        }
    });

    nodeCleanUp(() => {
        lpController.reset();
        return true;
    });
});
