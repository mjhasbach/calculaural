import pixiPianoRoll from 'pixi-piano-roll';

export default function($timeout) {
    'ngInject';

    return {
        restrict: 'E',
        compile: function() {
            return {
                post: function($scope, container) {
                    $timeout(function() {
                        let pianoRoll = pixiPianoRoll({
                                renderer: 'CanvasRenderer',
                                time: $scope.audio.playback.position,
                                bpm: $scope.globalSetting.values.beatsPerMinute,
                                pianoKeyWidth: container.width() / 8,
                                width: container.width(),
                                height: container.height(),
                                noteFormat: 'Frequency',
                                noteData: $scope.audio.instrument.notes.generate($scope.iterInstrument)
                            }),
                            $pianoRoll = $(pianoRoll.view);

                        container.append($pianoRoll);

                        $scope.iterInstrument.pianoRoll = pianoRoll;

                        $scope.$watch(
                            function() {
                                return [container[0].clientWidth, container[0].clientHeight].join('x');
                            },
                            function(size, oldSize) {
                                if (size !== oldSize) {
                                    $pianoRoll.width(container.width());
                                    $pianoRoll.height(container.height());
                                }
                            }
                        );

                        $scope.$watch('globalSetting.values.pianoRollZoom', function(zoom, oldZoom) {
                            if (zoom !== oldZoom) {
                                pianoRoll.zoom = zoom;
                            }
                        });

                        $scope.$watch('globalSetting.values.pianoRollResolution', function(resolution, oldResolution) {
                            if (resolution !== oldResolution) {
                                pianoRoll.resolution = resolution;
                            }
                        });

                        $scope.$watch('globalSetting.values.beatsPerMinute', function(bpm, oldBPM) {
                            if (bpm !== oldBPM) {
                                pianoRoll.bpm = bpm;
                            }
                        });

                        $scope.$watchGroup([
                            'globalSetting.values.transpose',
                            'iterInstrument.transpose',
                            'iterInstrument.numberQuantity',
                            'iterInstrument.numberType',
                            'iterInstrument.noteDuration',
                            'iterInstrument.notesPerMeasure',
                            'iterInstrument.tonic',
                            'iterInstrument.scale',
                            'iterInstrument.scaleBehavior',
                            'iterInstrument.scaleDirection',
                            'iterInstrument.chordType',
                            'iterInstrument.arpeggiateChord',
                            'iterInstrument.arpeggioDirection',
                            'iterInstrument.arpeggioPeakAndValleyBehavior'
                        ], function(oldData, newData) {
                            if (oldData !== newData) {
                                pianoRoll.noteData = $scope.audio.instrument.notes.generate($scope.iterInstrument);
                            }
                        });

                        if ($scope.state.playing) {
                            pianoRoll.playback.play();
                        }
                    }, 0);
                }
            };
        }
    }
}