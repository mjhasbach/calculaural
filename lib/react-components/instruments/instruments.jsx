import React from 'react';
import Remove from './remove';
import NumberType from './numberType';
import Duration from './duration';
import NotesPerMeasure from './notesPerMeasure';
import Tonic from './tonic';
import Scale from './scale';
import ScaleType from './scaleType';
import ScaleDirection from './scaleDirection';
import ChordType from './chordType';
import ArpeggiateChord from './arpeggiateChord';
import ArpeggioDirection from './arpeggioDirection';
import ArpeggioPeakValley from './arpeggioPeakValley';
import NumberQuantity from './numberQuantity';
import Volume from './volume';
import Transpose from './transpose';
import PianoRoll from './pianoRoll';

export default class extends React.Component {
    render() {
        let props = this.props;

        return <div className='instruments'>{
            props.ui.props.instruments.map(function(opt, i) {
                let instrumentCursor = props.ui.context.cursors.instruments.select(i),
                    tonicCursor = instrumentCursor.select('tonic'),
                    chordType = instrumentCursor.select('chordType'),
                    arpeggiateChordCursor = instrumentCursor.select('arpeggiateChord'),
                    arpeggioDirectionCursor = instrumentCursor.select('arpeggioDirection'),
                    noTonic = tonicCursor.get() === 'none',
                    noChord = noTonic || chordType.get() === 'none',
                    noChordArpeggiation = noChord || arpeggiateChordCursor.get() === 'no';

                return <div className='instrument' key={i}>
                    <Remove onClick={function() { props.audio.instrument.remove(i); }}/>
                    <NumberType cursor={instrumentCursor.select('numberType')}/>
                    <Duration cursor={instrumentCursor.select('duration')}/>
                    <NotesPerMeasure cursor={instrumentCursor.select('notesPerMeasure')}/>
                    <Tonic cursor={tonicCursor}/>
                    <Scale cursor={instrumentCursor.select('scale')} disabled={noTonic}/>
                    <ScaleType cursor={instrumentCursor.select('scaleType')} disabled={noTonic}/>
                    <ScaleDirection cursor={instrumentCursor.select('scaleDirection')} disabled={noTonic || instrumentCursor.select('scaleType').get() === 'skip'}/>
                    <ChordType cursor={chordType} disabled={noTonic}/>
                    <ArpeggiateChord cursor={arpeggiateChordCursor} disabled={noChord}/>
                    <ArpeggioDirection cursor={arpeggioDirectionCursor} disabled={noChordArpeggiation}/>
                    <ArpeggioPeakValley cursor={instrumentCursor.select('arpeggioPeakValley')} disabled={noChordArpeggiation || new Set(['up', 'down']).has(arpeggioDirectionCursor.get())}/>
                    <Volume cursor={instrumentCursor.select('volume')}/>
                    <NumberQuantity cursor={instrumentCursor.select('numberQuantity')}/>
                    <Transpose cursor={instrumentCursor.select('transpose')}/>
                    <PianoRoll instrumentCursor={instrumentCursor} tree={props.ui.context.tree} audio={props.audio}/>
                </div>
            })
        }</div>
    }
}