import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  curtirPublicacao,
  descurtirPublicacao,
  deletarPublicacao,
  atualizarPublicacao,
} from '../../services/api'
import { useAuth } from '../../context/AuthContext'
import styles from './PostCard.module.css'

export default function PostCard({ post, onDelete, onUpdate }) {
  const { usuarioId } = useAuth()
  const [curtidas, setCurtidas] = useState(post.curtidas)
  const [curtido, setCurtido] = useState(false)
  const [deletando, setDeletando] = useState(false)

  const [editando, setEditando] = useState(false)
  const [salvando, setSalvando] = useState(false)
  const [tituloEditado, setTituloEditado] = useState(post.titulo)
  const [conteudoEditado, setConteudoEditado] = useState(post.conteudo)

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
      // silencioso
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

  function handleCancelarEdicao() {
    setTituloEditado(post.titulo)
    setConteudoEditado(post.conteudo)
    setEditando(false)
  }

  async function handleSalvarEdicao() {
    if (!tituloEditado.trim() || !conteudoEditado.trim()) {
      alert('Título e conteúdo são obrigatórios.')
      return
    }

    setSalvando(true)
    try {
      const { data } = await atualizarPublicacao(post.id, {
        titulo: tituloEditado,
        conteudo: conteudoEditado,
      })

      onUpdate?.(post.id, {
        ...post,
        ...data,
        titulo: data?.titulo ?? tituloEditado,
        conteudo: data?.conteudo ?? conteudoEditado,
      })

      setEditando(false)
    } catch (e) {
      alert(e.response?.data?.erro || 'Erro ao atualizar publicação.')
    } finally {
      setSalvando(false)
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
            @{post.autorNick || 'semnick'}
          </Link>
        </div>

        <time className={styles.data}>
          {new Date(post.criadaEm).toLocaleDateString('pt-BR')}
        </time>
      </header>

      {editando ? (
        <>
          <input
            className={styles.inputEdit}
            value={tituloEditado}
            onChange={(e) => setTituloEditado(e.target.value)}
            placeholder="Título"
          />
          <textarea
            className={styles.textareaEdit}
            value={conteudoEditado}
            onChange={(e) => setConteudoEditado(e.target.value)}
            placeholder="Conteúdo"
          />

          <footer className={styles.footer}>
            <button
              className={styles.salvar}
              onClick={handleSalvarEdicao}
              disabled={salvando}
            >
              {salvando ? 'Salvando...' : 'Salvar'}
            </button>

            <button
              className={styles.cancelar}
              onClick={handleCancelarEdicao}
              disabled={salvando}
            >
              Cancelar
            </button>
          </footer>
        </>
      ) : (
        <>
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
              <>
                <button
                  className={styles.editar}
                  onClick={() => setEditando(true)}
                >
                  Editar
                </button>

                <button
                  className={styles.deletar}
                  onClick={handleDeletar}
                  disabled={deletando}
                >
                  {deletando ? '...' : 'Excluir'}
                </button>
              </>
            )}
          </footer>
        </>
      )}
    </article>
  )
}