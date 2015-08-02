import React from 'react';

export default class extends React.Component {
    render() {
        return <button type='button' onClick={this.props.onClick}>Add Instrument</button>
    }
}