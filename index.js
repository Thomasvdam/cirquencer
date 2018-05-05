import MidiStream from 'midi-stream';
import nodeCleanUp from 'node-cleanup';

import Sequencer from './lib/Sequencer';
import LaunchPadMini from './lib/LaunchPadMini';
import TempoView from './modes/tempo';
import MainControls from './MainControls';

MidiStream.getPortNames((err, names) => {
    console.log('names ::: ', names);

    const [lpName] = names;
    const lpStream = MidiStream(lpName);

    const lpController = new LaunchPadMini(lpStream);

    const activeView = new TempoView(lpController);
    const controls = new MainControls(lpController);
    activeView.load();
    controls.drawButtons();

    Sequencer.eventStream.on('data', (data) => {
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
