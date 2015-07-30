import React from 'react';
import common from './common';

export default class extends React.Component {
    render() {
        return <select value={this.props.cursor.get()} onChange={common.changeSetting.bind(this)} disabled='disabled'>
            <option value='MonoSynth'>MonoSynth</option>
            <option value='PolySynth'>PolySynth</option>
            <option value='PluckSynth'>PluckSynth</option>
            <option value='NoiseSynth'>NoiseSynth</option>
            <option value='DrumSynth'>DrumSynth</option>
            <option value='SimpleSynth'>SimpleSynth</option>
            <option value='DuoSynth'>DuoSynth</option>
            <option value='AMSynth'>AMSynth</option>
            <option value='SimpleAM'>SimpleAM</option>
            <option value='FMSynth'>FMSynth</option>
            <option value='SimpleFM'>SimpleFM</option>
        </select>
    }
}