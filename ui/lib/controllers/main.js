import uuid from 'node-uuid';
import pixiPianoRoll from 'pixi-piano-roll';
import audio from '../audio.js';
import globalSettingsTemplate from '../templates/globalSettings'

class MainController {
    constructor($scope, $mdDialog) {
        Object.assign(
            $scope,
            {
                audio: audio,
                state: {
                    playing: false
                },
                toolbarButtons: {
                    left: [
                        {
                            name: 'Seek Backward',
                            icon: 'fast_rewind',
                            get disabled() {
                                return $scope.audio.playback.position === '0:0:0';
                            },
                            onMouseDown: function() {
                                audio.playback.seek('backward');

                                $(document).one('mouseup', function() {
                                    audio.playback.seeking = false;
                                });
                            }
                        },
                        {
                            name: 'Play',
                            icon: 'play_arrow',
                            get disabled() {
                                return $scope.instrument.list.length < 1;
                            },
                            get hidden() {
                                return $scope.state.playing;
                            },
                            onClick: function() {
                                audio.playback.play();
                            }
                        },
                        {
                            name: 'Pause',
                            icon: 'pause',
                            get hidden() {
                                return !$scope.state.playing;
                            },
                            onClick: function() {
                                audio.playback.pause();
                            }
                        },
                        {
                            name: 'Seek Forward',
                            icon: 'fast_forward',
                            onMouseDown: function() {
                                audio.playback.seek('forward');

                                $(document).one('mouseup', function() {
                                    audio.playback.seeking = false;
                                });
                            }
                        }
                    ],
                    right: [
                        {
                            name: 'Remove Instrument',
                            icon: 'remove_circle',
                            get hidden() {
                                return $scope.instrument.list.length < 1;
                            },
                            onClick: function() {
                                let i = parseInt($('.md-tab.md-active').children('span').text().split(' ')[1]) - 1;

                                audio.instrument.remove(i);
                            }
                        },
                        {
                            name: 'Add Instrument',
                            icon: 'add_circle',
                            onClick: function() {
                                $scope.instrument.add();
                            }
                        },
                        {
                            name: 'Global Settings',
                            icon: 'settings',
                            onClick: function(e) {
                                $mdDialog.show({
                                    controller: 'settingsController',
                                    template: globalSettingsTemplate,
                                    targetEvent: e,
                                    clickOutsideToClose: true,
                                    locals: {
                                        setting: $scope.globalSetting,
                                        audio: audio
                                    }
                                });
                            }
                        }
                    ]
                },
                globalSetting: {
                    values: {
                        volume: -12,
                        transpose: 25,
                        beatsPerMinute: 120,
                        pianoRollZoom: 4,
                        pianoRollResolution: 1
                    },
                    params: [
                        {name: 'volume', step: 1, min: -50, max: 0},
                        {name: 'transpose', step: 1, min: 0, max: 117},
                        {name: 'beatsPerMinute', step: 1, min: 1, max: 500},
                        {name: 'pianoRollZoom', step: 1, min: 1, max: 50},
                        {
                            name: 'pianoRollResolution',
                            options: [1, 2, 4, 8, 16]
                        }
                    ]
                },
                instrument: {
                    list: [],
                    setting: {
                        defaults: {
                            numberType: 'pi',
                            noteDuration: '1n',
                            notesPerMeasure: 1,
                            tonic: 'None',
                            scale: 'major',
                            scaleBehavior: 'Skip Notes',
                            scaleDirection: 'Up',
                            chordType: 'none',
                            arpeggiateChord: 'No',
                            arpeggioDirection: 'Up',
                            arpeggioPeakAndValleyBehavior: 'Play Note Once',
                            volume: -12,
                            numberQuantity: 30,
                            transpose: 25
                        },
                        list: [
                            {name: 'volume', step: 1, min: -50, max: 0},
                            {name: 'transpose', step: 1, min: 0, max: 117},
                            {name: 'numberQuantity', step: 1, min: 1, max: 300},
                            {
                                name: 'numberType',
                                options: [
                                    {name: 'Pi', value: 'pi'}
                                ],
                                isDisabled: function() {
                                    return true;
                                }
                            },
                            {
                                name: 'noteDuration',
                                options: [
                                    {name: 'Whole Note', value: '1n'},
                                    {name: 'Half Note', value: '2n'},
                                    {name: 'Quarter Note', value: '4n'},
                                    {name: 'Eighth Note', value: '8n'},
                                    {name: 'Sixteenth Note', value: '16n'},
                                    {name: 'Thirty-Second Note', value: '32n'},
                                    {name: 'Sixty-Fourth Note', value: '64n'},
                                    {name: 'Hundred Twenty-Eighth Note', value: '128n'}
                                ]
                            },
                            {
                                name: 'notesPerMeasure',
                                options: [1, 2, 4, 8, 16]
                            },
                            {
                                name: 'tonic',
                                options: ['None', 'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B']
                            },
                            {
                                name: 'scale',
                                options: [
                                    {value: 'major', name: 'Major'},
                                    {value: 'minor', name: 'Minor'},
                                    {value: 'dorian', name: 'Dorian'},
                                    {value: 'phrygian', name: 'Phrygian'},
                                    {value: 'lydian', name: 'Lydian'},
                                    {value: 'mixolydian', name: 'Mixolydian'},
                                    {value: 'locrian', name: 'Locrian'},
                                    {value: 'majorpentatonic', name: 'Major Pentatonic'},
                                    {value: 'minorpentatonic', name: 'Minor Pentatonic'},
                                    {value: 'chromatic', name: 'Chromatic'},
                                    {value: 'blues', name: 'Blues'},
                                    {value: 'doubleharmonic', name: 'Double Harmonic'},
                                    {value: 'flamenco', name: 'Flamenco'},
                                    {value: 'harmonicminor', name: 'Harmonic Minor'},
                                    {value: 'melodicminor', name: 'Melodic Minor'}
                                ],
                                isDisabled: function(instrument) {
                                    return instrument.tonic === 'None';
                                }
                            },
                            {
                                name: 'scaleBehavior',
                                options: ['Skip Notes', 'Transpose Notes'],
                                isDisabled: function(instrument) {
                                    return instrument.tonic === 'None';
                                }
                            },
                            {
                                name: 'scaleDirection',
                                options: ['Up', 'Down'],
                                isDisabled: function(instrument) {
                                    return instrument.tonic === 'None' || instrument.scaleBehavior === 'Skip Notes';
                                }
                            },
                            {
                                name: 'chordType',
                                options: [
                                    {value: 'none', name: 'None'},
                                    {value: '5', name: '5th'},
                                    {value: 'M', name: 'Major Triad'},
                                    {value: 'm', name: 'Minor Triad'},
                                    {value: '+', name: 'Augmented Triad'},
                                    {value: 'o', name: 'Diminished Triad'},
                                    {value: '7', name: 'Dominant 7th'},
                                    {value: 'M7', name: 'Major 7th'},
                                    {value: 'm7', name: 'Minor 7th'},
                                    {value: 'mM7', name: 'Minor Major 7th'},
                                    {value: '7#9', name: '7th Sharp 9th'},
                                    {value: '7b5', name: '7th Flat Five'},
                                    {value: '7b9', name: '7th Flat 9th'},
                                    {value: '7b13', name: '7th Flat 13th'},
                                    {value: '+7', name: 'Augmented 7th'},
                                    {value: '+M7', name: 'Augmented Major 7th'},
                                    {value: '7#5', name: '7th Augmented Fifth'},
                                    {value: '7#11', name: '7th Augmented 11th'},
                                    {value: 'm7b5', name: 'Half-Diminished 7th'},
                                    {value: 'o7', name: 'Diminished 7th'},
                                    {value: '9', name: 'Dominant 9th'},
                                    {value: 'M9', name: 'Major 9th'},
                                    {value: 'm9', name: 'Minor 9th'},
                                    {value: 'mM9', name: 'Minor Major 9th'},
                                    {value: '+9', name: 'Augmented 9th'},
                                    {value: '+M9', name: 'Augmented Major 9th'},
                                    {value: 'm9b5', name: 'Half-Diminished 9th'},
                                    {value: 'mb9b5', name: 'Half-Diminished Minor 9th'},
                                    {value: 'o9', name: 'Diminished 9th'},
                                    {value: 'o9b9', name: 'Diminished Minor 9th'},
                                    {value: 'M11', name: 'Major 11th'},
                                    {value: '11', name: 'Dominant 11th'},
                                    {value: 'mM11', name: 'Minor Major 11th'},
                                    {value: 'm11', name: 'Minor 11th'},
                                    {value: '+11', name: 'Augmented 11th'},
                                    {value: '+M11', name: 'Augmented-Major 11th'},
                                    {value: 'm11b5', name: 'Half-Diminished 11th'},
                                    {value: 'o11', name: 'Diminished 11th'},
                                    {value: '13', name: 'Dominant 13th'},
                                    {value: 'M13', name: 'Major 13th'},
                                    {value: 'm13', name: 'Minor 13th'},
                                    {value: 'mM13', name: 'Minor Major 13th'},
                                    {value: '+13', name: 'Augmented 13th'},
                                    {value: '+M13', name: 'Augmented Major 13th'},
                                    {value: 'm13b5', name: 'Half-Diminished 13th'},
                                    {value: 'add9', name: 'Added 9th'},
                                    {value: 'add11', name: 'Added 4th'},
                                    {value: '6', name: 'Added 6th'},
                                    {value: '6/9', name: '6/9'},
                                    {value: 'sus2', name: 'Suspended 2'},
                                    {value: 'sus4', name: 'Suspended 4'},
                                    {value: '9sus4', name: 'Jazz Suspended'}
                                ],
                                isDisabled: function(instrument) {
                                    return instrument.tonic === 'None';
                                }
                            },
                            {
                                name: 'arpeggiateChord',
                                options: ['Yes', 'No'],
                                isDisabled: function(instrument) {
                                    return instrument.tonic === 'None' || instrument.chordType === 'none';
                                }
                            },
                            {
                                name: 'arpeggioDirection',
                                options: ['Up', 'Down', 'Up, Down', 'Down, Up'],
                                isDisabled: function(instrument) {
                                    return instrument.tonic === 'None' ||
                                        instrument.chordType === 'none' ||
                                        instrument.arpeggiateChord === 'No';
                                }
                            },
                            {
                                name: 'arpeggioPeakAndValleyBehavior',
                                options: ['Play Note Once', 'Play Note Twice'],
                                isDisabled: function(instrument) {
                                    return instrument.tonic === 'None' ||
                                        instrument.chordType === 'none' ||
                                        instrument.arpeggiateChord === 'No' ||
                                        new Set(['Up', 'Down']).has(instrument.arpeggioDirection);
                                }
                            }
                        ]
                    },
                    add() {
                        let instrument = Object.assign({id: uuid.v1()}, $scope.instrument.setting.defaults);

                        audio.instrument.route(instrument);
                        audio.instrument.notes.generate(instrument);

                        $scope.instrument.list.push(instrument);
                    }
                }
            }
        );

        audio.init($scope.state, $scope.globalSetting.values, $scope.instrument.list);
    }
}

MainController.$inject = ['$scope', '$mdDialog'];

export default MainController;