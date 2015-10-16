import debounce from 'debounce';

class InstrumentController {
    constructor($scope) {
        $scope.$watch('iterInstrument.volume', function(volume, oldVolume) {
            if (volume !== oldVolume) {
                $scope.iterInstrument.tone.set({volume: volume});
            }
        });
    }
}

InstrumentController.$inject = ['$scope'];

export default InstrumentController;