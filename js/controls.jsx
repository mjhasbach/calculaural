import React from 'react';
import BPM from './bpm';
import Volume from './volumeGlobal';
import AddInstrument from './addInstrument';
import Play from './play';
import Pause from './pause';
import Export from './export';

export default class extends React.Component {
    render() {
        let ui = this.props.ui,
            audio = this.props.audio,
            cursors = ui.context.cursors,
            noInstruments = ui.props.instruments.length < 1;

        return <div className='controls'>
            <BPM cursor={cursors.controls.select('bpm')}/>
            <Volume cursor={cursors.controls.select('volume')}/>
            <AddInstrument onClick={audio.instrument.add}/>
            {
                cursors.state.get(['playing']) ?
                    <Pause onClick={audio.playback.pause}/> :
                    <Play onClick={audio.playback.play} disabled={noInstruments}/>
            }
            <Export disabled={noInstruments}/>
        </div>
    }
}