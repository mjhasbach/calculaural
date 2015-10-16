import Tone from 'tone';
import teoria from 'teoria';
import math from './math';

let audio = {
    Tone: Tone,
    init(state, globalSettings, instruments) {
        audio.state = state;
        audio.controls = globalSettings;
        audio.instrument.list = instruments;

        Tone.Master.volume.value = globalSettings.volume;
        Tone.Transport.bpm.value = globalSettings.beatsPerMinute;
    },
    instrument: {
        releaseAll() {
            for (let instrument of audio.instrument.list) {
                instrument.tone.triggerRelease();
            }
        },
        route(instrument) {
            instrument.routeFn = function(time, note, duration) {
                instrument.tone.triggerAttackRelease(note, duration, time);
            };

            Tone.Note.route(instrument.id, instrument.routeFn);
        },
        remove(i) {
            let instrument = audio.instrument.list[i];

            instrument.tone.dispose();
            Tone.Note.unroute(instrument.id, instrument.routeFn);
            audio.instrument.list.splice(i, 1);
            audio.instrument.notes.makeTimeline();
        },
        notes: {
            makeTimeline() {
                Tone.Transport.clearTimelines();
                Tone.Note.parseScore(audio.instrument.notes.makeScore());
            },
            makeScore() {
                let score = {};

                for (let instrument of audio.instrument.list) {
                    score[instrument.id] = instrument.notes;
                }

                return score;
            },
            generate(instrument) {
                // @formatter:off
                let {
                        tone,
                        noteDuration,
                        notesPerMeasure,
                        tonic,
                        chordType,
                        arpeggiateChord,
                        arpeggioDirection,
                        arpeggioPeakAndValleyBehavior
                    } = instrument,
                // @formatter:on
                    time = '0:0:0',
                    digits = math.getDigits[instrument.numberType](+instrument.numberQuantity),
                    polyphony = Math.ceil(notesPerMeasure / parseInt(noteDuration)),
                    voices = polyphony,
                    scale = tonic === 'None' ? null : teoria.scale(tonic, instrument.scale),
                    transpose = {
                        instrument: +instrument.transpose,
                        global: +audio.controls.transpose
                    };

                instrument.notes = [];

                for (let digit of digits) {
                    let midiNote = +digit + transpose.global + transpose.instrument,
                        note = teoria.note.fromMIDI(midiNote);

                    if (scale && note.scaleDegree(scale) === 0) {
                        if (instrument.scaleBehavior === 'Skip Notes') {
                            continue;
                        }

                        while (note.scaleDegree(scale) === 0) {
                            instrument.scaleDirection === 'Up' ? midiNote++ : midiNote--;
                            note = teoria.note.fromMIDI(midiNote);
                        }
                    }

                    if (chordType !== 'none' && scale) {
                        let chordNotes = [];

                        for (let chordNote of note.chord(chordType).notes()) {
                            chordNotes.push(chordNote.fq());
                        }

                        if (arpeggiateChord === 'No') {
                            let chordVoices = chordNotes.length * polyphony;

                            if (chordVoices > voices) {
                                voices = chordVoices;
                            }
                        }
                        else if (arpeggioDirection !== 'Up') {
                            let reverseNotes = chordNotes.slice(0).reverse();

                            if (arpeggioDirection === 'Down') {
                                chordNotes = reverseNotes;
                            }
                            else if (arpeggioDirection === 'Down, Up') {
                                let upNotes = arpeggioPeakAndValleyBehavior === 'Play Note Once' ?
                                    chordNotes.slice(1) : chordNotes;

                                chordNotes = reverseNotes.concat(upNotes);
                            }
                            else if (arpeggioDirection === 'Up, Down') {
                                let downNotes = arpeggioPeakAndValleyBehavior === 'Play Note Once' ?
                                    reverseNotes.slice(1) : reverseNotes;

                                chordNotes = chordNotes.concat(downNotes);
                            }
                        }

                        chordNotes.forEach(function(note, i) {
                            instrument.notes.push([time, note, noteDuration]);

                            if (arpeggiateChord === 'Yes' && i < chordNotes.length - 1) {
                                time = audio.playback.moveTime(time, 'forward', notesPerMeasure);
                            }
                        });
                    }
                    else {
                        instrument.notes.push([time, note.fq(), noteDuration]);
                    }

                    time = audio.playback.moveTime(time, 'forward', notesPerMeasure);
                }

                if (!tone || voices !== tone.voices.length) {
                    if (tone) { tone.dispose(); }

                    instrument.tone = new Tone.PolySynth(voices).toMaster().set(instrument);
                }

                audio.instrument.notes.makeTimeline();

                return instrument.notes;
            }
        }
    },
    playback: {
        _position: '0:0:0',
        get position() {
            return audio.state.playing ? Tone.Transport.position : audio.playback._position;
        },
        pause() {
            Tone.Transport.pause();

            audio.instrument.releaseAll();
            audio.state.playing = false;
            audio.playback._position = Tone.Transport.position;

            for (let instrument of audio.instrument.list) {
                instrument.pianoRoll.playback.pause();
            }
        },
        play() {
            Tone.Transport.start(0, audio.playback.position);

            audio.state.playing = true;

            for (let instrument of audio.instrument.list) {
                instrument.pianoRoll.playback.play();
            }
        },
        moveTime(time, direction, duration) {
            let diff = 16 / duration,
                [bar, quarter, sixteenth] = time.split(':'),
                totalSixteenths = +sixteenth + (quarter * 4) + (bar * 16);

            direction === 'backward' ? totalSixteenths -= diff : totalSixteenths += diff;
            sixteenth = totalSixteenths % 4;
            quarter = parseInt(totalSixteenths / 4) % 4;
            bar = parseInt(totalSixteenths / 16);

            return [bar, quarter, sixteenth].join(':');
        },
        seek(direction) {
            let i = 1,
                wasPlaying = audio.state.playing;

            audio.playback.seeking = true;

            if (wasPlaying) {
                audio.playback.pause();
            }

            (function seek() {
                if (direction === 'backward' && audio.playback.position === '0:0:0') {
                    audio.playback.seeking = false;
                }

                if (audio.playback.seeking) {
                    audio.playback._position = audio.playback.moveTime(audio.playback._position, direction, 16);

                    for (let instrument of audio.instrument.list) {
                        instrument.pianoRoll.playback.seek(audio.playback.position);
                    }

                    setTimeout(seek, 500 / i);

                    i++;
                }
                else {
                    $(document).trigger('mouseup');

                    if (wasPlaying) {
                        audio.playback.play();
                    }
                }
            })();
        }
    }
};

export default audio;