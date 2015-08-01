import Baobab from 'baobab';

export default new Baobab({
    instruments: [],
    state: {
        playing: false
    },
    controls: {
        bpm: 120,
        volume: 0,
        transpose: 25
    }
});