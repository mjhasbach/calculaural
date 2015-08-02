import React from 'react';
import common from '../../common'

export default class extends React.Component {
    render() {
        return <select value={this.props.cursor.get()} onChange={common.changeSetting.bind(this)} disabled={this.props.disabled}>
            <option value='none'>None</option>
            <option value='5'>5th</option>
            <option value='M'>Major Triad</option>
            <option value='m'>Minor Triad</option>
            <option value='+'>Augmented Triad</option>
            <option value='o'>Diminished Triad</option>
            <option value='7'>Dominant 7th</option>
            <option value='M7'>Major 7th</option>
            <option value='m7'>Minor 7th</option>
            <option value='mM7'>Minor Major 7th</option>
            <option value='7#9'>7th Sharp 9th</option>
            <option value='7b5'>7th Flat Five</option>
            <option value='7b9'>7th Flat 9th</option>
            <option value='7b13'>7th Flat 13th</option>
            <option value='+7'>Augmented 7th</option>
            <option value='+M7'>Augmented Major 7th</option>
            <option value='7#5'>7th Augmented Fifth</option>
            <option value='7#11'>7th Augmented 11th</option>
            <option value='m7b5'>Half-Diminished 7th</option>
            <option value='o7'>Diminished 7th</option>
            <option value='9'>Dominant 9th</option>
            <option value='M9'>Major 9th</option>
            <option value='m9'>Minor 9th</option>
            <option value='mM9'>Minor Major 9th</option>
            <option value='+9'>Augmented 9th</option>
            <option value='+M9'>Augmented Major 9th</option>
            <option value='m9b5'>Half-Diminished 9th</option>
            <option value='mb9b5'>Half-Diminished Minor 9th</option>
            <option value='o9'>Diminished 9th</option>
            <option value='o9b9'>Diminished Minor 9th</option>
            <option value='M11'>Major 11th</option>
            <option value='11'>Dominant 11th</option>
            <option value='mM11'>Minor Major 11th</option>
            <option value='m11'>Minor 11th</option>
            <option value='+11'>Augmented 11th</option>
            <option value='+M11'>Augmented-Major 11th</option>
            <option value='m11b5'>Half-Diminished 11th</option>
            <option value='o11'>Diminished 11th</option>
            <option value='13'>Dominant 13th</option>
            <option value='M13'>Major 13th</option>
            <option value='m13'>Minor 13th</option>
            <option value='mM13'>Minor Major 13th</option>
            <option value='+13'>Augmented 13th</option>
            <option value='+M13'>Augmented Major 13th</option>
            <option value='m13b5'>Half-Diminished 13th</option>
            <option value='add9'>Added 9th</option>
            <option value='add11'>Added 4th</option>
            <option value='6'>Added 6th</option>
            <option value='6/9'>6/9</option>
            <option value='sus2'>Suspended 2</option>
            <option value='sus4'>Suspended 4</option>
            <option value='9sus4'>Jazz Suspended</option>
        </select>
    }
}