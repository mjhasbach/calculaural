export default function() {
    return {
        restrict: 'E',
        compile: function() {
            return {
                post: function($scope, container) {
                    $scope.iterInstrument.pianoRollContainer = container;
                    $scope.initPianoRoll();
                }
            };
        }
    }
}