import React from 'react';
import Remove from './removeInstrument';
import NumberType from './numberType';
import Duration from './duration';
import NotesPerMeasure from './notesPerMeasure';
import Tonic from './tonic';
import Scale from './scale';
import ScaleType from './scaleType';
import ScaleDirection from './scaleDirection';
import ChordLength from './chordLength';
import ArpeggiateChord from './arpeggiateChord';
import ArpeggioDirection from './arpeggioDirection';
import ArpeggioPeakValley from './arpeggioPeakValley';
import NumberQuantity from './numberQuantity';
import Volume from './volumeInstrument.jsx';
import Transpose from './transposeInstrument';

export default class extends React.Component {
    render() {
        let props = this.props;

        return <div className='instruments'>{
            props.ui.props.instruments.map(function(opt, i) {
                let instrumentCursor = props.ui.context.cursors.instruments.select(i),
                    tonicCursor = instrumentCursor.select('tonic'),
                    chordLengthCursor = instrumentCursor.select('chordLength'),
                    arpeggiateChordCursor = instrumentCursor.select('arpeggiateChord'),
                    arpeggioDirectionCursor = instrumentCursor.select('arpeggioDirection'),
                    arpeggiateChord = arpeggiateChordCursor.get(),
                    noTonic = tonicCursor.get() === 'none';

                return <div className='instrument' key={i}>
                    <Remove onClick={function() { props.audio.instrument.remove(i); }}/>
                    <NumberType cursor={instrumentCursor.select('numberType')}/>
                    <Duration cursor={instrumentCursor.select('duration')}/>
                    <NotesPerMeasure cursor={instrumentCursor.select('notesPerMeasure')}/>
                    <Tonic cursor={tonicCursor}/>
                    <Scale cursor={instrumentCursor.select('scale')} disabled={noTonic}/>
                    <ScaleType cursor={instrumentCursor.select('scaleType')} disabled={noTonic}/>
                    <ScaleDirection cursor={instrumentCursor.select('scaleDirection')} disabled={noTonic || instrumentCursor.select('scaleType').get() === 'skip'}/>
                    <ChordLength cursor={chordLengthCursor} disabled={noTonic}/>
                    <ArpeggiateChord cursor={arpeggiateChordCursor} disabled={noTonic || +chordLengthCursor.get() < 2}/>
                    <ArpeggioDirection cursor={arpeggioDirectionCursor} disabled={noTonic || arpeggiateChord === 'no'}/>
                    <ArpeggioPeakValley cursor={instrumentCursor.select('arpeggioPeakValley')} disabled={noTonic || arpeggiateChord === 'no' || new Set(['up', 'down']).has(arpeggioDirectionCursor.get())}/>
                    <Volume cursor={instrumentCursor.select('volume')}/>
                    <NumberQuantity cursor={instrumentCursor.select('numberQuantity')}/>
                    <Transpose cursor={instrumentCursor.select('transpose')}/>
                </div>
            })
        }</div>
    }
}