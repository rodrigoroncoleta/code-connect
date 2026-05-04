import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { LoginPage } from './components/pages/LoginPage'
import { RegisterPage } from './components/pages/RegisterPage'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
