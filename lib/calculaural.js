import angular from 'angular';
import angularMaterial from 'angular-material';
import MainController from './controllers/main';
import SettingsController from './controllers/settings';
import InstrumentController from './controllers/instrument';
import ToolbarButtons from './directives/toolbarButtons';
import PianoRollDirective from './directives/pianoRoll';
import SettingsDirective from './directives/settings';

angular
    .module('calculaural', [angularMaterial])
    .controller('mainController', MainController)
    .controller('settingsController', SettingsController)
    .controller('instrumentController', InstrumentController)
    .directive('toolbarButtons', ToolbarButtons)
    .directive('pianoRoll', PianoRollDirective)
    .directive('settings', SettingsDirective);