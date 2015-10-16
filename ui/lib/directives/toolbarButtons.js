import toolbarButtonsTemplate from '../templates/toolbarButtons'

export default function() {
    return {
        restrict: 'E',
        template: toolbarButtonsTemplate,
        scope: {
            buttons: '='
        }
    }
}