import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './serviceWorkerRegistration.js'
import { AblyProvider, useChannel, usePresence } from 'ably/react';


const client = {
    key: 'sSQ9Ow.SOCOdQ:qGtnr0lwx-mF_WXG1uBpyoJK5c0XPZkZva_FfYpcfYE',
  }
  


ReactDOM.createRoot(document.getElementById('root')).render(
    <App />
)
