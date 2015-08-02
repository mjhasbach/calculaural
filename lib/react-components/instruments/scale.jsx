import React from 'react';
import common from '../../common';

export default class extends React.Component {
    render() {
        return <select value={this.props.cursor.get()} onChange={common.changeSetting.bind(this)} disabled={this.props.disabled}>
            <option value='major'>Major</option>
            <option value='minor'>Minor</option>
            <option value='dorian'>Dorian</option>
            <option value='phrygian'>Phrygian</option>
            <option value='lydian'>Lydian</option>
            <option value='mixolydian'>Mixolydian</option>
            <option value='locrian'>Locrian</option>
            <option value='majorpentatonic'>Major Pentatonic</option>
            <option value='minorpentatonic'>Minor Pentatonic</option>
            <option value='chromatic'>Chromatic</option>
            <option value='blues'>Blues</option>
            <option value='doubleharmonic'>Double Harmonic</option>
            <option value='flamenco'>Flamenco</option>
            <option value='harmonicminor'>Harmonic Minor</option>
            <option value='melodicminor'>Melodic Minor</option>
        </select>
    }
}