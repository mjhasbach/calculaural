import capitalize from 'to-capital-case';

export default function() {
    return {
        restrict: 'E',
        templateUrl: 'lib/templates/settings.html',
        link: function(scope) {
            scope.capitalize = capitalize;
            scope.getSettingType = function(setting) {
                return typeof setting.step === 'number' ? 'slider' : 'select';
            };
        },
        scope: {
            model: '=',
            params: '='
        }
    }
}