import React from 'react';
import common from './common'

export default class extends React.Component {
    render() {
        return <select value={this.props.cursor.get()} onChange={common.changeSetting.bind(this)} disabled={this.props.disabled}>
            <option value='1'>Monad</option>
            <option value='2'>Dyad</option>
            <option value='3'>Triad</option>
            <option value='4'>Tetrad</option>
            <option value='5'>Pentad</option>
            <option value='6'>Hexad</option>
            <option value='7'>Heptad</option>
            <option value='8'>Octad</option>
            <option value='9'>Ennead</option>
            <option value='10'>Decad</option>
        </select>
    }
}