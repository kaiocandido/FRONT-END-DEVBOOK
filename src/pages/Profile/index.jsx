import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import {
  buscarUsuarioPorId,
  buscarPublicacoesDoUsuario,
  seguirUsuario,
  deixarDeSeguir,
} from '../../services/api'
import { useAuth } from '../../context/AuthContext'
import Navbar from '../../components/Navbar'
import PostCard from '../../components/PostCard'
import Loading from '../../components/Loading'
import styles from './Profile.module.css'

export default function Profile() {
  const { id } = useParams()
  const { usuarioId } = useAuth()
  const [usuario, setUsuario] = useState(null)
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [erro, setErro] = useState('')
  const [seguindo, setSeguindo] = useState(false)
  const [loadingSeguir, setLoadingSeguir] = useState(false)

  const ehProprioPerfil = Number(usuarioId) === Number(id)

  useEffect(() => {
    async function carregar() {
      setLoading(true)
      setErro('')
      try {
        const [{ data: user }, { data: publicacoes }] = await Promise.all([
          buscarUsuarioPorId(id),
          buscarPublicacoesDoUsuario(id),
        ])
        setUsuario(user)
        setPosts(publicacoes ?? [])
      } catch {
        setErro('Perfil não encontrado.')
      } finally {
        setLoading(false)
      }
    }
    carregar()
  }, [id])

  async function handleSeguir() {
    setLoadingSeguir(true)
    try {
      if (seguindo) {
        await deixarDeSeguir(id)
        setSeguindo(false)
      } else {
        await seguirUsuario(id)
        setSeguindo(true)
      }
    } catch {
      // silencioso
    } finally {
      setLoadingSeguir(false)
    }
  }

  function handlePostDeletado(postId) {
    setPosts((prev) => prev.filter((p) => p.id !== postId))
  }

  return (
    <>
      <Navbar />
      <main className={styles.main}>
        {loading && <Loading />}
        {erro && <p className={styles.erro}>{erro}</p>}
        {usuario && (
          <div className={styles.content}>
            <section className={styles.perfil}>
              <div className={styles.avatar}>
                {usuario.nick?.[0]?.toUpperCase() ?? '?'}
              </div>
              <div className={styles.info}>
                <h1 className={styles.nome}>{usuario.nome}</h1>
                <p className={styles.nick}>@{usuario.nick}</p>
                <p className={styles.email}>{usuario.email}</p>
                <p className={styles.desde}>
                  Membro desde {new Date(usuario.criado).toLocaleDateString('pt-BR')}
                </p>
              </div>
              {!ehProprioPerfil && (
                <button
                  className={`${styles.btnSeguir} ${seguindo ? styles.seguindo : ''}`}
                  onClick={handleSeguir}
                  disabled={loadingSeguir}
                >
                  {loadingSeguir ? '...' : seguindo ? 'Seguindo' : 'Seguir'}
                </button>
              )}
            </section>

            <section className={styles.posts}>
              <h2 className={styles.postsTitle}>
                Publicações ({posts.length})
              </h2>
              {posts.length === 0 && (
                <p className={styles.vazio}>Nenhuma publicação ainda.</p>
              )}
              {posts.map((post) => (
                <PostCard key={post.id} post={post} onDelete={handlePostDeletado} />
              ))}
            </section>
          </div>
        )}
      </main>
    </>
  )
}
