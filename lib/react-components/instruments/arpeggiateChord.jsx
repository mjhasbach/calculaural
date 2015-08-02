import React from 'react';
import common from '../../common';

export default class extends React.Component {
    render() {
        return <select value={this.props.cursor.get()} onChange={common.changeSetting.bind(this)} disabled={this.props.disabled}>
            <option value='no'>No</option>
            <option value='yes'>Yes</option>
        </select>
    }
}