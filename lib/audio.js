import Tone from 'tone';
import teoria from 'teoria';
import uuid from 'node-uuid';
import debounce from 'debounce';
import math from './math';

let audio = {
    init(context) {
        let controls = context.cursors.controls.get();

        audio.context = context;
        audio.bindChangeSetting();

        Tone.Master.volume.value = controls.volume;
        Tone.Transport.bpm.value = controls.bpm;
    },
    bindChangeSetting() {
        let update = debounce(function(e) {
            for (let path of e.data.log) {
                if (path[0] === 'controls') {
                    let controls = audio.context.cursors.controls.get();

                    if (path[1] === 'volume') {
                        Tone.Master.volume.value = controls.volume;
                    }
                    else if (path[1] === 'bpm') {
                        Tone.Transport.bpm.value = controls.bpm;
                    }
                    else if (path[1] === 'transpose') {
                        for (let i = 0; i < audio.context.cursors.instruments.get().length; i++) {
                            audio.instrument.notes.generate(audio.context.cursors.instruments.select(i));
                        }
                    }
                }
                else if (path[0] === 'instruments' &&
                    (path[2] === 'volume' || audio.instrument.notes.updateOptions.has(path[2]))) {

                    let instrumentCursor = audio.context.tree.select.apply(this, path).up();

                    if (path[2] === 'volume') {
                        let instrumentOpts = instrumentCursor.get();

                        audio.instrument.changeSetting(instrumentOpts.tone, path[2], instrumentOpts[path[2]]);
                    }
                    else {
                        audio.instrument.notes.generate(instrumentCursor);
                    }
                }
            }
        }, 200);

        audio.context.tree.on('update', update);
    },
    instrument: {
        score: {},
        defaults: {
            numberType: 'pi',
            duration: '1n',
            notesPerMeasure: 1,
            tonic: 'none',
            scale: 'major',
            scaleType: 'skip',
            scaleDirection: 'up',
            chordType: 'none',
            arpeggiateChord: 'no',
            arpeggioDirection: 'up',
            arpeggioPeakValley: 'once',
            volume: -12,
            numberQuantity: 30,
            transpose: 25
        },
        changeSetting(tone, setting, value) {
            tone.set({[setting]: value});
        },
        releaseAll() {
            audio.context.cursors.instruments.get().forEach(function(instrument) {
                instrument.tone.triggerRelease();
            });
        },
        getByID(id) {
            for (let instrument of audio.context.cursors.instruments.get()) {
                if (instrument.id === id) {
                    return instrument;
                }
            }

            throw new Error('instrument not found');
        },
        add() {
            let instrumentOpts = Object.assign(
                {
                    id: uuid.v1(),
                    routeFn(time, note, duration) {
                        audio.instrument.getByID(instrumentOpts.id).tone.triggerAttackRelease(note, duration, time);
                    }
                },
                audio.instrument.defaults
            );

            Tone.Note.route(instrumentOpts.id, instrumentOpts.routeFn);
            audio.context.cursors.instruments.push(instrumentOpts);
            audio.context.tree.commit();
            audio.instrument.notes.generate(
                audio.context.cursors.instruments.select(audio.context.cursors.instruments.get().length - 1)
            );
        },
        remove(i) {
            let instrument = audio.context.cursors.instruments.get(i);

            instrument.tone.dispose();
            Tone.Note.unroute(instrument.id, instrument.routeFn);
            audio.context.cursors.instruments.splice([i, 1]);
            delete audio.instrument.score[instrument.id];
            audio.instrument.notes.makeTimeline(true);
        },
        notes: {
            updateOptions: new Set([
                'numberType',
                'duration',
                'notesPerMeasure',
                'tonic',
                'scale',
                'scaleType',
                'scaleDirection',
                'chordType',
                'arpeggiateChord',
                'arpeggioDirection',
                'arpeggioPeakValley',
                'numberQuantity',
                'transpose'
            ]),
            makeTimeline(onlyIfPlaying) {
                if (!onlyIfPlaying || (onlyIfPlaying && Tone.Transport.state === 'started')) {
                    Tone.Transport.clearTimelines();
                    Tone.Note.parseScore(audio.instrument.score);
                }
            },
            generate: function(instrumentCursor) {
                let notes = [],
                    bar = 0,
                    quarter = 0,
                    sixteenth = 0,
                    voices = 1,
                    opt = instrumentCursor.get(),
                    npm = +opt.notesPerMeasure,
                    digits = math.getDigits[opt.numberType](+opt.numberQuantity),
                    {tone, duration, tonic, chordType, arpeggiateChord, arpeggioDirection, arpeggioPeakValley} = opt,
                    scale = tonic === 'none' ? null : teoria.scale(tonic, opt.scale),
                    transpose = {
                        instrument: +opt.transpose,
                        global: +audio.context.cursors.controls.get().transpose
                    },
                    getTime = function() {
                        return bar + ':' + quarter + ':' + sixteenth;
                    },
                    advanceTime = function() {
                        if (npm === 1) {
                            bar++;
                        }
                        else if ((npm === 2 && quarter === 2) || (npm === 4 && quarter === 3)) {
                            quarter = 0;
                            bar++;
                        }
                        else if ((npm === 8 && sixteenth === 2) || (npm === 16 && sixteenth === 3)) {
                            if (quarter === 3) {
                                quarter = 0;
                                bar++;
                            }
                            else {
                                quarter++;
                            }

                            sixteenth = 0;
                        }
                        else if (npm === 2) {
                            quarter += 2;
                        }
                        else if (npm === 4) {
                            quarter++;
                        }
                        else if (npm === 8) {
                            sixteenth += 2;
                        }
                        else {
                            sixteenth++;
                        }
                    };

                for (let digit of digits) {
                    let note = teoria.note.fromMIDI(+digit + transpose.global + transpose.instrument);

                    if (scale && note.scaleDegree(scale) === 0) {
                        if (opt.scaleType === 'skip') {
                            continue;
                        }

                        while (note.scaleDegree(scale) === 0) {
                            opt.scaleDirection === 'up' ? digit++ : digit--;
                            note = teoria.note.fromMIDI(digit + transpose);
                        }
                    }

                    if (chordType !== 'none' && scale) {
                        let chordNotes = [];

                        for (let chordNote of note.chord(chordType).notes()) {
                            chordNotes.push(chordNote.fq());
                        }

                        if (arpeggiateChord === 'no') {
                            if (chordNotes.length > voices) {
                                voices = chordNotes.length;
                            }
                        }
                        else if (arpeggioDirection !== 'up') {
                            let reverseNotes = chordNotes.slice(0).reverse();

                            if (arpeggioDirection === 'down') {
                                chordNotes = reverseNotes;
                            }
                            else if (arpeggioDirection === 'downUp') {
                                let upNotes = arpeggioPeakValley === 'once' ? chordNotes.slice(1) : chordNotes;

                                chordNotes = reverseNotes.concat(upNotes);
                            }
                            else if (arpeggioDirection === 'upDown') {
                                let downNotes = arpeggioPeakValley === 'once' ? reverseNotes.slice(1) : reverseNotes;

                                chordNotes = chordNotes.concat(downNotes);
                            }
                        }

                        chordNotes.forEach(function(note, i) {
                            notes.push([getTime(), note, duration]);

                            if (arpeggiateChord === 'yes' && i < chordNotes.length - 1) {
                                advanceTime();
                            }
                        });
                    }
                    else {
                        notes.push([getTime(), note.fq(), duration]);
                    }

                    advanceTime();
                }


                if (!tone || voices !== tone.voices.length) {
                    if (tone) { tone.dispose(); }

                    instrumentCursor.set('tone', new Tone.PolySynth(voices).toMaster().set(opt));
                }

                audio.instrument.score[opt.id] = notes;
                audio.instrument.notes.makeTimeline(true);
            }
        }
    },
    playback: {
        pause() {
            audio.context.cursors.state.set(['playing'], false);
            audio.instrument.releaseAll();

            Tone.Transport.pause();
        },
        play() {
            audio.context.cursors.state.set(['playing'], true);
            audio.instrument.notes.makeTimeline();

            Tone.Transport.start();
        }
    }
};

export default audio;