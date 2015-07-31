import React from 'react';
import common from './common';

export default class extends React.Component {
    render() {
        return <select value={this.props.cursor.get()} onChange={common.changeSetting.bind(this)} disabled={this.props.disabled}>
            <option value='once'>Play Once</option>
            <option value='twice'>Play Twice</option>
        </select>
    }
}