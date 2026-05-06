import styles from './PortalFooter.module.css'

/**
 * Workspace-wide footer; legal and secondary links stay out of individual feature screens.
 */
export function PortalFooter() {
  return (
    <footer className={styles.root}>
      <p className={styles.meta}>Análisis al Instante · Portal de trabajo</p>
      <nav className={styles.links} aria-label="Enlaces del pie">
        <a className={styles.link} href="#help">
          Ayuda
        </a>
        <a className={styles.link} href="#privacy">
          Privacidad
        </a>
        <a className={styles.link} href="#terms">
          Términos
        </a>
      </nav>
    </footer>
  )
}
