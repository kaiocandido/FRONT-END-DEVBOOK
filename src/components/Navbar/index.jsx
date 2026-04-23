import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import styles from './Navbar.module.css'

export default function Navbar() {
  const { usuarioId, logout } = useAuth()
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    navigate('/login')
  }

  return (
    <nav className={styles.nav}>
      <Link to="/feed" className={styles.logo}>DevBook</Link>
      <div className={styles.links}>
        <Link to="/feed">Feed</Link>
        <Link to={`/perfil/${usuarioId}`}>Meu Perfil</Link>
        <button onClick={handleLogout} className={styles.logout}>Sair</button>
      </div>
    </nav>
  )
}
