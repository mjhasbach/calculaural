import React from 'react';
import common from './common';

export default class extends React.Component {
    render() {
        return <select value={this.props.cursor.get()} onChange={common.changeSetting.bind(this)}>
            <option value='1'>Whole Note</option>
            <option value='2'>Half Note</option>
            <option value='4'>Quarter Note</option>
            <option value='8'>Eighth Note</option>
            <option value='16'>Sixteenth Note</option>
            <option value='32'>Thirty-Second Note</option>
            <option value='64'>Sixty-Fourth Note</option>
            <option value='128'>Hundred Twenty-Eighth Note</option>
        </select>
    }
};