import { useState, useEffect } from 'react'
import { buscarPublicacoes } from '../../services/api'
import Navbar from '../../components/Navbar'
import PostCard from '../../components/PostCard'
import CreatePost from '../../components/CreatePost'
import Loading from '../../components/Loading'
import styles from './Feed.module.css'

export default function Feed() {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [erro, setErro] = useState('')

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

  useEffect(() => { carregar() }, [])

  function handlePostCriado(novoPost) {
    setPosts((prev) => [novoPost, ...prev])
  }

  function handlePostDeletado(id) {
    setPosts((prev) => prev.filter((p) => p.id !== id))
  }

  return (
    <>
      <Navbar />
      <main className={styles.main}>
        <div className={styles.content}>
          <CreatePost onCreated={handlePostCriado} />
          {loading && <Loading />}
          {erro && <p className={styles.erro}>{erro}</p>}
          {!loading && !erro && posts.length === 0 && (
            <p className={styles.vazio}>Nenhuma publicação ainda. Seja o primeiro!</p>
          )}
          {posts.map((post) => (
            <PostCard key={post.id} post={post} onDelete={handlePostDeletado} />
          ))}
        </div>
      </main>
    </>
  )
}
