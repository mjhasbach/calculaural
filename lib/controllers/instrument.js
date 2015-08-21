import debounce from 'debounce';
import pixiPianoRoll from 'pixi-piano-roll';

class InstrumentController {
    constructor($scope) {
        $scope.initPianoRoll = debounce(function() {
            let container = $scope.iterInstrument.pianoRollContainer;

            if ($scope.iterInstrument.pianoRoll && $scope.state.playing) {
                $scope.iterInstrument.pianoRoll.playback.pause();
            }

            container.empty();

            $scope.iterInstrument.pianoRoll = pixiPianoRoll({
                renderer: 'CanvasRenderer',
                time: $scope.audio.playback.position,
                bpm: $scope.globalSetting.values.beatsPerMinute,
                width: container.width(),
                height: container.height(),
                noteFormat: 'Frequency',
                noteData: $scope.audio.instrument.notes.generate($scope.iterInstrument)
            });

            container.append($scope.iterInstrument.pianoRoll.view);

            if ($scope.state.playing) {
                $scope.iterInstrument.pianoRoll.playback.play();
            }
        }, 200);

        $scope.$on('$destroy', function() {
            window.removeEventListener('resize', $scope.initPianoRoll);
        });

        $scope.$watch('iterInstrument.volume', function(volume, prevVolume) {
            if (volume !== prevVolume) {
                $scope.iterInstrument.tone.set({volume: volume});
            }
        });

        $scope.$watch('globalSetting.values.beatsPerMinute', function(bpm, prevBPM) {
            if (bpm !== prevBPM) {
                $scope.iterInstrument.pianoRoll.bpm = bpm;
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
        ], $scope.initPianoRoll);

        window.addEventListener('resize', $scope.initPianoRoll);
    }
}

InstrumentController.$inject = ['$scope'];

export default InstrumentController;