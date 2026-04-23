import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import styles from './Login.module.css'

export default function Login() {
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [loading, setLoading] = useState(false)
  const [erro, setErro] = useState('')
  const { login } = useAuth()
  const navigate = useNavigate()

  async function handleSubmit(e) {
    e.preventDefault()
    setErro('')
    setLoading(true)
    try {
      await login(email, senha)
      navigate('/feed')
    } catch (e) {
      const status = e.response?.status
      if (status === 401) setErro('Email ou senha inválidos.')
      else setErro('Erro ao conectar com o servidor.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <h1 className={styles.logo}>DevBook</h1>
        <p className={styles.sub}>A rede social dos devs</p>
        <form onSubmit={handleSubmit} className={styles.form}>
          {erro && <p className={styles.erro}>{erro}</p>}
          <input
            className={styles.input}
            type="email"
            placeholder="E-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoFocus
          />
          <input
            className={styles.input}
            type="password"
            placeholder="Senha"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            required
          />
          <button className={styles.btn} type="submit" disabled={loading}>
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>
        <p className={styles.footer}>
          Não tem conta? <Link to="/cadastro">Cadastre-se</Link>
        </p>
      </div>
    </div>
  )
}
