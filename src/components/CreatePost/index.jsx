import { useState } from 'react'
import { criarPublicacao } from '../../services/api'
import styles from './CreatePost.module.css'

export default function CreatePost({ onCreated }) {
  const [titulo, setTitulo] = useState('')
  const [conteudo, setConteudo] = useState('')
  const [loading, setLoading] = useState(false)
  const [erro, setErro] = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    if (!titulo.trim() || !conteudo.trim()) {
      setErro('Preencha título e conteúdo.')
      return
    }
    setLoading(true)
    setErro('')
    try {
      const { data } = await criarPublicacao({ titulo, conteudo })
      setTitulo('')
      setConteudo('')
      onCreated?.(data)
    } catch (e) {
      setErro(e.response?.data?.erro || 'Erro ao publicar.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <h2 className={styles.heading}>Nova publicação</h2>
      {erro && <p className={styles.erro}>{erro}</p>}
      <input
        className={styles.input}
        placeholder="Título"
        value={titulo}
        onChange={(e) => setTitulo(e.target.value)}
        maxLength={120}
      />
      <textarea
        className={styles.textarea}
        placeholder="O que você está pensando?"
        value={conteudo}
        onChange={(e) => setConteudo(e.target.value)}
        rows={3}
      />
      <button className={styles.btn} type="submit" disabled={loading}>
        {loading ? 'Publicando...' : 'Publicar'}
      </button>
    </form>
  )
}
