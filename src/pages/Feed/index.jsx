import { useState, useEffect } from 'react'
import { buscarPublicacoes, buscarUsuarios, seguirUsuario } from '../../services/api'
import { useAuth } from '../../context/AuthContext'
import Navbar from '../../components/Navbar'
import PostCard from '../../components/PostCard'
import CreatePost from '../../components/CreatePost'
import Loading from '../../components/Loading'
import styles from './Feed.module.css'

export default function Feed() {
  const { usuarioId } = useAuth()

  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [erro, setErro] = useState('')

  const [buscaUsuario, setBuscaUsuario] = useState('')
  const [usuarios, setUsuarios] = useState([])
  const [usuariosFiltrados, setUsuariosFiltrados] = useState([])
  const [loadingUsuarios, setLoadingUsuarios] = useState(false)
  const [seguindoIds, setSeguindoIds] = useState([])

  async function carregar() {
    setErro('')
    try {
      const { data } = await buscarPublicacoes()
      setPosts(data ?? [])
    } catch {
      setErro('Não foi possível carregar o feed.')
    } finally {
      setLoading(false)
    }
  }

  async function carregarUsuarios() {
    setLoadingUsuarios(true)
    try {
      const { data } = await buscarUsuarios()
      const lista = (data ?? []).filter((u) => u.id !== usuarioId)
      setUsuarios(lista)
    } catch {
      // opcionalmente você pode mostrar um erro específico da busca
    } finally {
      setLoadingUsuarios(false)
    }
  }

  useEffect(() => {
    carregar()
    carregarUsuarios()
  }, [])

  useEffect(() => {
    const termo = buscaUsuario.trim().toLowerCase()

    if (!termo) {
      setUsuariosFiltrados([])
      return
    }

    const filtrados = usuarios.filter((usuario) => {
      const nome = usuario.nome?.toLowerCase() || ''
      const nick = usuario.nick?.toLowerCase() || ''
      const email = usuario.email?.toLowerCase() || ''

      return (
        nome.includes(termo) ||
        nick.includes(termo) ||
        email.includes(termo)
      )
    })

    setUsuariosFiltrados(filtrados)
  }, [buscaUsuario, usuarios])

  function handlePostCriado(novoPost) {
    setPosts((prev) => [novoPost, ...prev])
  }

  function handlePostDeletado(id) {
    setPosts((prev) => prev.filter((p) => p.id !== id))
  }

  function handlePostAtualizado(id, postAtualizado) {
    setPosts((prev) =>
      prev.map((post) => (post.id === id ? postAtualizado : post))
    )
  }

  async function handleSeguir(id) {
    try {
      await seguirUsuario(id)
      setSeguindoIds((prev) => [...new Set([...prev, id])])
    } catch {
      alert('Não foi possível seguir este usuário.')
    }
  }

  return (
    <>
      <Navbar />
      <main className={styles.main}>
        <div className={styles.content}>
          <section className={styles.userSearchCard}>
            <h2 className={styles.sectionTitle}>Buscar usuários</h2>

            <input
              className={styles.input}
              type="text"
              placeholder="Buscar por nome, nick ou email"
              value={buscaUsuario}
              onChange={(e) => setBuscaUsuario(e.target.value)}
            />

            {loadingUsuarios && (
              <p className={styles.helperText}>Carregando usuários...</p>
            )}

            {!loadingUsuarios && buscaUsuario && usuariosFiltrados.length === 0 && (
              <p className={styles.helperText}>Nenhum usuário encontrado.</p>
            )}

            {usuariosFiltrados.length > 0 && (
              <div className={styles.searchResults}>
                {usuariosFiltrados.map((usuario) => {
                  const jaSeguindo = seguindoIds.includes(usuario.id)

                  return (
                    <div key={usuario.id} className={styles.userRow}>
                      <div className={styles.userInfo}>
                        <strong>{usuario.nome}</strong>
                        <span>@{usuario.nick}</span>
                        <small>{usuario.email}</small>
                      </div>

                      <button
                        className={jaSeguindo ? styles.followingBtn : styles.followBtn}
                        onClick={() => handleSeguir(usuario.id)}
                        disabled={jaSeguindo}
                      >
                        {jaSeguindo ? 'Seguindo' : 'Seguir'}
                      </button>
                    </div>
                  )
                })}
              </div>
            )}
          </section>

          <CreatePost onCreated={handlePostCriado} />

          {loading && <Loading />}
          {erro && <p className={styles.erro}>{erro}</p>}

          {!loading && !erro && posts.length === 0 && (
            <p className={styles.vazio}>Nenhuma publicação ainda. Seja o primeiro!</p>
          )}

          {posts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              onDelete={handlePostDeletado}
              onUpdate={handlePostAtualizado}
            />
          ))}
        </div>
      </main>
    </>
  )
}