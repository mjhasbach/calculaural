import React from 'react';
import {branch} from '../../node_modules/baobab-react/higher-order';
import PropTypes from '../../node_modules/baobab-react/prop-types';
import Controls from './controls/controls';
import Instruments from './instruments/instruments';
import audio from '../audio';

class App extends React.Component {
    static get contextTypes() {
        return {
            tree: PropTypes.baobab,
            cursors: PropTypes.cursors
        }
    }

    componentWillMount() {
        audio.init(this.context, this.props);
    }

    render() {
        return <div className='ui'>
            <Controls ui={this} audio={audio}/>
            <Instruments ui={this} audio={audio}/>
        </div>;
    }
}

export default branch(App, {
    cursors: {
        state: ['state'],
        controls: ['controls'],
        instruments: ['instruments']
    }
});