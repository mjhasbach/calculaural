import React from 'react';
import common from './common';

export default class extends React.Component {
    render() {
        return <select value={this.props.cursor.get()} onChange={common.changeSetting.bind(this)}>
            <option value='none'>None</option>
            <option value='C'>C</option>
            <option value='C#'>C#</option>
            <option value='D'>D</option>
            <option value='D#'>D#</option>
            <option value='E'>E</option>
            <option value='F'>F</option>
            <option value='F#'>F#</option>
            <option value='G'>G</option>
            <option value='G#'>G#</option>
            <option value='A'>A</option>
            <option value='A#'>A#</option>
            <option value='B'>B</option>
        </select>
    }
};