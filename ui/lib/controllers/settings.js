class SettingsController {
    constructor($scope, $mdDialog, setting, audio) {
        Object.assign(
            $scope,
            {
                setting,
                close: function() {
                    $mdDialog.cancel();
                }
            }
        );

        $scope.$watch('setting.values.volume', function(volume) {
            audio.Tone.Master.volume.value = volume;
        });

        $scope.$watch('setting.values.beatsPerMinute', function(bpm) {
            audio.Tone.Transport.bpm.value = bpm;
        });

        $scope.$watch('setting.values.transpose', function(transpose, oldTranspose) {
            if (transpose !== oldTranspose) {
                for (let instrument of audio.instrument.list) {
                    audio.instrument.notes.generate(instrument);
                }
            }
        });
    }
}

SettingsController.$inject = ['$scope', '$mdDialog', 'setting', 'audio'];

export default SettingsController;