import debounce from 'debounce';

export default class {
    constructor($scope) {
        'ngInject';

        $scope.$watch('iterInstrument.volume', function(volume, oldVolume) {
            if (volume !== oldVolume) {
                $scope.iterInstrument.tone.set({volume: volume});
            }
        });
    }
}