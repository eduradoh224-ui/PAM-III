import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { StackNavigator } from './navigation/StackNavigator.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <StackNavigator initialRouteName="compor">
      <App />
    </StackNavigator>
  </StrictMode>,
)
