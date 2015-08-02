import React from 'react';
import common from '../../common';

export default class extends React.Component {
    render() {
        return <select value={this.props.cursor.get()} onChange={common.changeSetting.bind(this)} disabled={this.props.disabled}>
            <option value='up'>Up</option>
            <option value='down'>Down</option>
            <option value='upDown'>Up, Down</option>
            <option value='downUp'>Down, Up</option>
        </select>
    }
}