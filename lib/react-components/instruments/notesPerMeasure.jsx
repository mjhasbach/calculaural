import React from 'react';
import common from '../../common';

export default class extends React.Component {
    render() {
        return <select value={this.props.cursor.get()} onChange={common.changeSetting.bind(this)} disabled={this.props.disabled}>
            <option value='1'>One</option>
            <option value='2'>Two</option>
            <option value='4'>Four</option>
            <option value='8'>Eight</option>
            <option value='16'>Sixteen</option>
        </select>
    }
}