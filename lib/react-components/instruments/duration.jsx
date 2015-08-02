import React from 'react';
import common from '../../common';

export default class extends React.Component {
    render() {
        return <select value={this.props.cursor.get()} onChange={common.changeSetting.bind(this)}>
            <option value='1n'>Whole Note</option>
            <option value='2n'>Half Note</option>
            <option value='4n'>Quarter Note</option>
            <option value='8n'>Eighth Note</option>
            <option value='16n'>Sixteenth Note</option>
            <option value='32n'>Thirty-Second Note</option>
            <option value='64n'>Sixty-Fourth Note</option>
            <option value='128n'>Hundred Twenty-Eighth Note</option>
        </select>
    }
};