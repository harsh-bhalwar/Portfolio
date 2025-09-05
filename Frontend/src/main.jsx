import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import Health from './components/Health.jsx'
import './index.css'


const pathname = window.location.pathname

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {pathname === '/health' ? <Health /> : <App />}
  </React.StrictMode>,
)