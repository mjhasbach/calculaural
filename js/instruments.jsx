import React from 'react';
import RemoveInstrument from './removeInstrument';
import NumberType from './numberType';
import Duration from './duration';
import NotesPerMeasure from './notesPerMeasure';
import Tonic from './tonic';
import Scale from './scale';
import ScaleType from './scaleType';
import ScaleDirection from './scaleDirection';
import ChordLength from './chordLength';
import NumberQuantity from './numberQuantity';
import TransposeInstrument from './transposeInstrument';

export default class extends React.Component {
    render() {
        let props = this.props;

        return <div className='instruments'>{
            props.ui.props.instruments.map(function(opt, i) {
                let instrumentCursor = props.ui.context.cursors.instruments.select(i),
                    tonicCursor = instrumentCursor.select('tonic'),
                    tonic = tonicCursor.get();

                return <div className='instrument' key={i}>
                    <RemoveInstrument onClick={function() { props.audio.instrument.remove(i); }}/>
                    <NumberType cursor={instrumentCursor.select('numberType')}/>
                    <Duration cursor={instrumentCursor.select('duration')}/>
                    <NotesPerMeasure cursor={instrumentCursor.select('notesPerMeasure')}/>
                    <Tonic cursor={tonicCursor}/>
                    <Scale cursor={instrumentCursor.select('scale')} disabled={tonic === 'none'}/>
                    <ScaleType cursor={instrumentCursor.select('scaleType')} disabled={tonic === 'none'}/>
                    <ScaleDirection cursor={instrumentCursor.select('scaleDirection')} disabled={tonic === 'none' || instrumentCursor.select('scaleType').get() === 'skip'}/>
                    <ChordLength cursor={instrumentCursor.select('chordLength')} disabled={tonic === 'none'}/>
                    <NumberQuantity cursor={instrumentCursor.select('numberQuantity')}/>
                    <TransposeInstrument cursor={instrumentCursor.select('transpose')}/>
                </div>
            })
        }</div>
    }
}