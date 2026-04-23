import styles from './Loading.module.css'

export default function Loading({ texto = 'Carregando...' }) {
  return (
    <div className={styles.wrapper}>
      <div className={styles.spinner} />
      <p>{texto}</p>
    </div>
  )
}
