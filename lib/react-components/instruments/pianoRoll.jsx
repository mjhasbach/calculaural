import React from 'react';
import pixiPianoRoll from 'pixi-piano-roll';

export default class extends React.Component {
    getContainer() {
        return React.findDOMNode(this.refs.pianoRoll);
    }

    renderPianoRoll() {
        let container = this.getContainer(),
            pianoRoll = this.props.instrumentCursor.get('pianoRoll');

        if (!pianoRoll) {
            pianoRoll = pixiPianoRoll({
                renderer: 'CanvasRenderer',
                time: this.props.audio.playback.position,
                bpm: this.props.audio.playback.bpm,
                width: window.innerWidth * 0.95,
                height: window.innerHeight * 0.3,
                noteFormat: 'Frequency',
                noteData: this.props.instrumentCursor.get('notes')
            });

            this.props.instrumentCursor.set('pianoRoll', pianoRoll);
        }

        this.pianoRoll = pianoRoll;
        container.appendChild(pianoRoll.view);

        if (this.props.tree.get('state', 'playing')) {
            pianoRoll.playback.play();
        }
    }

    onBPMChange(e) {
        this.pianoRoll.bpm = e.data.data;
    }

    onPlayingStateChange() {
        this.pianoRoll.playback.toggle(this.props.audio.playback.position);
    }

    onNoteChange(e) {
        if (e.data.data !== e.data.previousData) {
            this.reRenderPianoRoll();
        }
    }

    reRenderPianoRoll() {
        let container = this.getContainer();

        container.removeChild(container.firstChild);
        this.props.instrumentCursor.unset('pianoRoll');
        this.props.tree.commit();
        this.renderPianoRoll();
    }

    componentDidMount() {
        this.renderPianoRoll();
        this._onBPMChange = this.onBPMChange.bind(this);
        this._onPlayingStateChange = this.onPlayingStateChange.bind(this);
        this._onNoteChange = this.onNoteChange.bind(this);
        this._reRenderPianoRoll = this.reRenderPianoRoll.bind(this);
        this.props.tree.select('controls', 'bpm').on('update', this._onBPMChange);
        this.props.tree.select('state', 'playing').on('update', this._onPlayingStateChange);
        this.props.instrumentCursor.select('notes').on('update', this._onNoteChange);
        window.addEventListener('resize', this._reRenderPianoRoll);
    }

    componentWillUnmount() {
        this.props.tree.select('controls', 'bpm').off('update', this._onBPMChange);
        this.props.tree.select('state', 'playing').off('update', this._onPlayingStateChange);
        this.props.instrumentCursor.select('notes').off('update', this._onNoteChange);
        window.removeEventListener('resize', this._reRenderPianoRoll);
    }

    render() {
        return <div ref='pianoRoll'></div>
    }
}