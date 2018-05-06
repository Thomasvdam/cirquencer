import MidiStream from 'midi-stream';
import nodeCleanUp from 'node-cleanup';

import Sequencer from './lib/Sequencer';
import LaunchPadMini from './lib/LaunchPadMini';
import TempoView from './modes/TempoView';
import SideControls from './SideControls';

const lpStream = MidiStream('Cirquencer:controls', { virtual: true });

console.log('MIDI plumbing in place? [y/n]');

process.stdin.resume();
process.stdin.setEncoding('utf8');
process.stdin.on('data', (input) => {
    if (input === 'y\n') {
        const lpController = new LaunchPadMini(lpStream);

        const activeView = new TempoView(lpController);
        const controls = new SideControls(lpController);
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
    }
});
