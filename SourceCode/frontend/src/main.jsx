import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import Navbar from './components/Navbar.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <div class="bg-light text-dark">
      <Navbar />
      <div className="w-100">
        <img className="w-100" src="https://i.imgur.com/mUbqbyy.png" />
      </div>
      <App />
    </div>
  </React.StrictMode>,
)
