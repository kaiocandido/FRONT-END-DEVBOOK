import { useState } from 'react'
import { Link } from 'react-router-dom'
import { curtirPublicacao, descurtirPublicacao, deletarPublicacao } from '../../services/api'
import { useAuth } from '../../context/AuthContext'
import styles from './PostCard.module.css'

export default function PostCard({ post, onDelete }) {
  const { usuarioId } = useAuth()
  const [curtidas, setCurtidas] = useState(post.curtidas)
  const [curtido, setCurtido] = useState(false)
  const [deletando, setDeletando] = useState(false)

  async function handleCurtir() {
    try {
      if (curtido) {
        await descurtirPublicacao(post.id)
        setCurtidas((c) => c - 1)
      } else {
        await curtirPublicacao(post.id)
        setCurtidas((c) => c + 1)
      }
      setCurtido(!curtido)
    } catch {
      // silencioso — API retorna 403 se já curtiu
    }
  }

  async function handleDeletar() {
    if (!confirm('Excluir esta publicação?')) return
    setDeletando(true)
    try {
      await deletarPublicacao(post.id)
      onDelete?.(post.id)
    } catch (e) {
      alert(e.response?.data?.erro || 'Erro ao excluir.')
      setDeletando(false)
    }
  }

  const ehAutor = Number(usuarioId) === Number(post.autorId)

  return (
    <article className={styles.card}>
      <header className={styles.header}>
        <div className={styles.autorBloco}>
          <Link to={`/perfil/${post.autorId}`} className={styles.autorNome}>
            {post.autorNome || 'Usuário'}
          </Link>
          <Link to={`/perfil/${post.autorId}`} className={styles.autor}>
            @{post.autorNick}
          </Link>
        </div>

        <time className={styles.data}>
          {new Date(post.criadaEm).toLocaleDateString('pt-BR')}
        </time>
      </header>

      <h3 className={styles.titulo}>{post.titulo}</h3>
      <p className={styles.conteudo}>{post.conteudo}</p>

      <footer className={styles.footer}>
        <button
          className={`${styles.curtir} ${curtido ? styles.curtido : ''}`}
          onClick={handleCurtir}
        >
          {curtido ? '♥' : '♡'} {curtidas}
        </button>

        {ehAutor && (
          <button
            className={styles.deletar}
            onClick={handleDeletar}
            disabled={deletando}
          >
            {deletando ? '...' : 'Excluir'}
          </button>
        )}
      </footer>
    </article>
  )
}