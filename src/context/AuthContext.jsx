import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { login as loginApi } from '../services/api'

const AuthContext = createContext(null)

function parseJwtPayload(token) {
  try {
    return JSON.parse(atob(token.split('.')[1]))
  } catch {
    return null
  }
}

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('@devbook:token'))
  const [usuarioId, setUsuarioId] = useState(() => {
    const t = localStorage.getItem('@devbook:token')
    return t ? parseJwtPayload(t)?.usuarioId : null
  })

  const login = useCallback(async (email, senha) => {
    const { data } = await loginApi({ email, senha })
    const novoToken = data.token 
    localStorage.setItem('@devbook:token', novoToken)
    setToken(novoToken)
    setUsuarioId(parseJwtPayload(novoToken)?.usuarioId)
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem('@devbook:token')
    setToken(null)
    setUsuarioId(null)
  }, [])

  const autenticado = !!token

  return (
    <AuthContext.Provider value={{ autenticado, token, usuarioId, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
