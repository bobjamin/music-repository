import * as React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';

import RouterComponent from '../../router';
import store from '../../state/store/store';
import '../stylesheets/bootstrap.min.css';
import '../stylesheets/index.scss';


render(
    <Provider store={store}>
      <RouterComponent/>
    </Provider>,
    document.getElementById('app')
  );
