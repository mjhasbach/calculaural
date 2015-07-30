import Tone from 'tone';
import teoria from 'teoria';
import teoriaScaleChords from 'teoria-scale-chords';
import uuid from 'node-uuid';
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
                    let instrumentCursor = audio.context.tree.select.apply(this, path).up(),
                        instrumentOpts = instrumentCursor.get();

                    audio.instrument.notes.generate(instrumentOpts);

                    if (path[2] === 'chordLength') {
                        instrumentOpts.tone.dispose();
                        instrumentCursor.set('tone', new Tone.PolySynth(+instrumentOpts.chordLength).toMaster());
                    }
                }
            }
        });
    },
    instrument: {
        score: {},
        defaults: {
            numberType: 'pi',
            duration: 1,
            notesPerMeasure: 1,
            tonic: 'none',
            scale: 'major',
            scaleType: 'skip',
            scaleDirection: 'up',
            chordLength: 'none',
            numberQuantity: 30,
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
                    tone: new Tone.PolySynth(1).toMaster(),
                    routeFn(time, note) {
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
                'notesPerMeasure',
                'tonic',
                'scale',
                'scaleType',
                'scaleDirection',
                'chordLength',
                'numberQuantity',
                'transpose'
            ]),
            generate(instrumentOpts) {
                let notes = [],
                    bar = 0,
                    quarter = 0,
                    sixteenth = 0,
                    notesPerMeasure = +instrumentOpts.notesPerMeasure,
                    digits = math.getDigits[instrumentOpts.numberType](+instrumentOpts.numberQuantity),
                    transpose = +instrumentOpts.transpose,
                    chordLength = +instrumentOpts.chordLength,
                    scale = instrumentOpts.tonic === 'none' ? null :
                        teoria.scale(instrumentOpts.tonic, instrumentOpts.scale);

                for (let digit of digits) {
                    let transportTime = bar + ':' + quarter + ':' + sixteenth,
                        note = teoria.note.fromMIDI(+digit + transpose);

                    if (scale && note.scaleDegree(scale) === 0) {
                        if (instrumentOpts.scaleType === 'skip') {
                            continue;
                        }

                        while (note.scaleDegree(scale) === 0) {
                            instrumentOpts.scaleDirection === 'up' ? digit++ : digit--;
                            note = teoria.note.fromMIDI(digit + transpose);
                        }
                    }

                    if (chordLength > 1 && scale) {
                        teoriaScaleChords(scale, note, chordLength, function(err, chordNotes){
                            if (err) { throw err; }

                            chordNotes.forEach(function(note) {
                                notes.push([transportTime, teoria.note(note).fq()]);
                            });
                        })
                    }
                    else {
                        notes.push([transportTime, note.fq()]);
                    }

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