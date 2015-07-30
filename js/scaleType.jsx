import React from 'react';
import common from './common'

export default class extends React.Component {
    render() {
        return <select value={this.props.cursor.get()} onChange={common.changeSetting.bind(this)} disabled={this.props.disabled}>
            <option value='skip'>Skip Notes</option>
            <option value='transpose'>Transpose Notes</option>
        </select>
    }
}