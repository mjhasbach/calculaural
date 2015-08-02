import React from 'react';
import common from '../../common';

export default class extends React.Component {
    render() {
        return <input
            type='range'
            value={this.props.cursor.get()}
            onChange={common.changeSetting.bind(this)}
            min='1'
            max='300'
            step='1'/>;
    }
}