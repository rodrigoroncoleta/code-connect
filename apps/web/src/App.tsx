import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import { FeedPage } from './components/pages/FeedPage'
import { LoginPage } from './components/pages/LoginPage'
import { PostDetailPage } from './components/pages/PostDetailPage'
import { RegisterPage } from './components/pages/RegisterPage'

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/feed" element={<FeedPage />} />
          <Route path="/posts/:id" element={<PostDetailPage />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
