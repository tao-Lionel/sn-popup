import React from 'react';
import ReactDOM from 'react-dom';
import EmailPopup from './components/EmailPopup';

const popupContainer = document.createElement('div');
document.body.appendChild(popupContainer);

ReactDOM.render(<EmailPopup />, popupContainer);
