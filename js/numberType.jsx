import React from 'react';

export default class extends React.Component {
    render() {
        return <select value={this.props.cursor.get()} onChange={this.props.onChange} disabled='disabled'>
            <option value='pi'>Pi</option>
        </select>
    }
}