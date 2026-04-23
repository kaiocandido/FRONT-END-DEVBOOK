import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import PrivateRoute from './components/PrivateRoute'
import Login from './pages/Login'
import Register from './pages/Register'
import Feed from './pages/Feed'
import Profile from './pages/Profile'

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/cadastro" element={<Register />} />
          <Route
            path="/feed"
            element={<PrivateRoute><Feed /></PrivateRoute>}
          />
          <Route
            path="/perfil/:id"
            element={<PrivateRoute><Profile /></PrivateRoute>}
          />
          <Route path="*" element={<Navigate to="/feed" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
