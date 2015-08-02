import React from 'react';
import {root} from 'baobab-react/higher-order';
import UI from './react-components/ui';
import model from './model';

let ComposedUI = root(UI, model);

React.render(<ComposedUI />, document.getElementById('wrap'));