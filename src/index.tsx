import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserHistory } from 'history';
import './index.css';
import App from './App';
import { disableReactDevTools } from '@fvilers/disable-react-devtools';

disableReactDevTools();

const history = createBrowserHistory({ window });
const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <React.StrictMode>
    <App history={history} />
  </React.StrictMode>,
);
