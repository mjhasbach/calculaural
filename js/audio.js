import Tone from 'tone';
import teoria from 'teoria';
import uuid from 'node-uuid';
import math from './math';

let audio = {
    init: function(context) {
        let controls = context.cursors.controls.get();

        audio.context = context;
        audio.bindChangeSetting();

        Tone.Master.volume.value = controls.volume;
        Tone.Transport.bpm.value = controls.bpm;
    },
    bindChangeSetting() {
        audio.context.tree.on('update', function(e) {
            for (let path of e.data.log) {
                if (path[0] === 'controls') {
                    let controls = audio.context.cursors.controls.get();

                    if (path[1] === 'volume') {
                        Tone.Master.volume.value = controls.volume;
                    }
                    else if (path[1] === 'bpm') {
                        Tone.Transport.bpm.value = controls.bpm;
                    }
                }
                else if (path[0] === 'instruments' && audio.instrument.notes.updateOptions.has(path[2])) {
                    let instrumentOpts = audio.context.tree.select.apply(this, path).up().get();

                    audio.instrument.notes.generate(instrumentOpts);
                }
            }
        });
    },
    instrument: {
        score: {},
        defaults: {
            instrumentType: 'MonoSynth',
            numberType: 'pi',
            numberQuantity: 30,
            duration: 1,
            notesPerMeasure: 1,
            tonic: 'none',
            scale: 'major',
            scaleDisabled: 'disabled',
            scaleType: 'skip',
            scaleDirection: 'up',
            transpose: 50
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
                        tone: new Tone[audio.instrument.defaults.instrumentType]().toMaster(),
                        routeFn: function routeFn(time, note) {
                            let instrument = audio.instrument.getByID(instrumentOpts.id);

                            instrument.tone.triggerAttackRelease(note, instrument.duration + 'n', time);
                        }
                    },
                    audio.instrument.defaults
                );

            Tone.Note.route(instrumentOpts.id, instrumentOpts.routeFn);

            audio.instrument.notes.generate(instrumentOpts);
            audio.context.cursors.instruments.push(instrumentOpts);
        },
        remove(i) {
            let instrument = audio.context.cursors.instruments.get(i);

            instrument.tone.dispose();
            Tone.Note.unroute(instrument.id, instrument.routeFn);
            audio.context.cursors.instruments.splice([i, 1]);
            delete audio.instrument.score[instrument.id];
        },
        notes: {
            updateOptions: new Set([
                'numberType',
                'numberQuantity',
                'notesPerMeasure',
                'tonic',
                'scale',
                'scaleType',
                'scaleDirection',
                'transpose'
            ]),
            generate(instrumentOpts) {
                let notes = [],
                    bar = 0,
                    quarter = 0,
                    sixteenth = 0,
                    notesPerMeasure = +instrumentOpts.notesPerMeasure,
                    numberQuantity = +instrumentOpts.numberQuantity,
                    digits = math.getDigits[instrumentOpts.numberType](numberQuantity),
                    tonic = instrumentOpts.tonic,
                    transpose = +instrumentOpts.transpose,
                    scale = tonic === 'none' ? null : teoria.scale(instrumentOpts.tonic, instrumentOpts.scale);

                for (let digit of digits) {
                    let note = teoria.note.fromMIDI(+digit + transpose);

                    if (scale && note.scaleDegree(scale) === 0) {
                        if (instrumentOpts.scaleType === 'skip') {
                            continue;
                        }

                        while (note.scaleDegree(scale) === 0) {
                            instrumentOpts.scaleDirection === 'up' ? digit++ : digit--;
                            note = teoria.note.fromMIDI(digit + transpose);
                        }
                    }

                    notes.push([bar + ':' + quarter + ':' + sixteenth, note.scientific()]);

                    if (notesPerMeasure === 1) {
                        bar++;
                    }
                    if ((notesPerMeasure === 2 && quarter === 2) || (notesPerMeasure === 4 && quarter === 3)) {
                        quarter = 0;
                        bar++;
                    }
                    else if ((notesPerMeasure === 8 && sixteenth === 2) || (notesPerMeasure === 16 && sixteenth === 3)) {
                        if (quarter === 3) {
                            quarter = 0;
                            bar++;
                        }
                        else {
                            quarter++;
                        }

                        sixteenth = 0;
                    }
                    else if (notesPerMeasure === 2) {
                        quarter += 2;
                    }
                    else if (notesPerMeasure === 4) {
                        quarter++;
                    }
                    else if (notesPerMeasure === 8) {
                        sixteenth += 2;
                    }
                    else {
                        sixteenth++;
                    }
                }

                audio.instrument.score[instrumentOpts.id] = notes;
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

            Tone.Transport.clearTimelines();
            Tone.Note.parseScore(audio.instrument.score);
            Tone.Transport.start();
        }
    }
};

export default audio;