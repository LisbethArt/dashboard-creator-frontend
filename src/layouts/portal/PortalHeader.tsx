import { MaterialIcon } from '../../components/MaterialIcon'
import styles from './PortalHeader.module.css'

/**
 * Global workspace chrome: section tabs, search, and quick actions. Page titles live in `WorkspacePage`.
 */
export function PortalHeader() {
  return (
    <header className={styles.root}>
      <div className={styles.left}>
        <nav className={styles.subNav} aria-label="Sección">
          <a className={styles.subLink} href="#overview">
            Vista general
          </a>
          <a className={styles.subLinkActive} href="#history">
            Historial
          </a>
          <a className={styles.subLink} href="#projects">
            Proyectos
          </a>
        </nav>
      </div>
      <div className={styles.right}>
        <label className={styles.search}>
          <MaterialIcon name="search" className={styles.searchIcon} />
          <input
            type="search"
            className={styles.searchInput}
            placeholder="Buscar..."
            aria-label="Buscar en el workspace"
          />
        </label>
        <button type="button" className={styles.iconGhost} aria-label="Notificaciones">
          <MaterialIcon name="notifications" />
        </button>
        <button type="button" className={styles.iconGhost} aria-label="Ajustes rápidos">
          <MaterialIcon name="settings" />
        </button>
        <div className={styles.avatar} aria-hidden>
          LA
        </div>
      </div>
    </header>
  )
}
