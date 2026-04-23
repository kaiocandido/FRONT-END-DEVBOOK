import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { criarUsuario } from '../../services/api'
import styles from './Register.module.css'

export default function Register() {
  const [form, setForm] = useState({ nome: '', nick: '', email: '', senha: '' })
  const [loading, setLoading] = useState(false)
  const [erro, setErro] = useState('')
  const navigate = useNavigate()

  function handleChange(e) {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setErro('')
    setLoading(true)
    try {
      await criarUsuario(form)
      navigate('/login', { state: { sucesso: 'Conta criada! Faça login.' } })
    } catch (e) {
      setErro(e.response?.data?.erro || 'Erro ao criar conta.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <h1 className={styles.logo}>DevBook</h1>
        <p className={styles.sub}>Crie sua conta</p>
        <form onSubmit={handleSubmit} className={styles.form}>
          {erro && <p className={styles.erro}>{erro}</p>}
          <input
            className={styles.input}
            name="nome"
            placeholder="Nome completo"
            value={form.nome}
            onChange={handleChange}
            required
            autoFocus
          />
          <input
            className={styles.input}
            name="nick"
            placeholder="Nome de usuário (@nick)"
            value={form.nick}
            onChange={handleChange}
            required
          />
          <input
            className={styles.input}
            type="email"
            name="email"
            placeholder="E-mail"
            value={form.email}
            onChange={handleChange}
            required
          />
          <input
            className={styles.input}
            type="password"
            name="senha"
            placeholder="Senha"
            value={form.senha}
            onChange={handleChange}
            required
            minLength={6}
          />
          <button className={styles.btn} type="submit" disabled={loading}>
            {loading ? 'Criando conta...' : 'Cadastrar'}
          </button>
        </form>
        <p className={styles.footer}>
          Já tem conta? <Link to="/login">Entrar</Link>
        </p>
      </div>
    </div>
  )
}
