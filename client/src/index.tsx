import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import '@radix-ui/themes/styles.css';
import { Theme } from '@radix-ui/themes';
import './index.css';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  // <React.StrictMode>
    <Theme appearance='dark'>
      <App />
    </Theme>
  // </React.StrictMode>
);
