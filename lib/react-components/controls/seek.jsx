import React from 'react';

export default class extends React.Component {
    render() {
        let props = this.props,
            startSeek = function() {
                props.audio.playback.seek(props.direction);
            },
            stopSeek = function() {
                props.audio.playback.seeking = false;
            };

        return <button type='button' onMouseDown={startSeek} onMouseUp={stopSeek} onMouseLeave={stopSeek}>
            {this.props.icon}
        </button>
    }
}