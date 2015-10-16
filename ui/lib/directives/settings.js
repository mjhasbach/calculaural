import capitalize from 'to-capital-case';
import settingsTemplate from '../templates/settings'

export default function() {
    return {
        restrict: 'E',
        template: settingsTemplate,
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