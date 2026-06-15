import styles from './LoadingSkeleton.module.css'

export function LoadingSkeleton() {
  return (
    <div className={styles.wrap} aria-busy="true" aria-label="Loading">
      <div className={`skeleton ${styles.nav}`} />
      <div className={`skeleton ${styles.map}`} />
      <div className={`skeleton ${styles.card}`} />
      <div className={`skeleton ${styles.card}`} />
      <div className={`skeleton ${styles.card}`} />
    </div>
  )
}
