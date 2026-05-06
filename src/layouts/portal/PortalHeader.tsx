import { MaterialIcon } from '../../components/MaterialIcon'
import { useTheme } from '../../context/ThemeContext'
import styles from './PortalHeader.module.css'

/**
 * Global workspace chrome: section tabs, search, and quick actions. Page titles live in `WorkspacePage`.
 */
export function PortalHeader() {
  const { theme, toggleTheme } = useTheme()

  return (
    <header className={styles.root}>
      <div className={styles.left}>
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
        <button
          type="button"
          className={styles.iconGhost}
          onClick={toggleTheme}
          aria-label={theme === 'light' ? 'Activar modo oscuro' : 'Activar modo claro'}
        >
          <MaterialIcon name={theme === 'light' ? 'dark_mode' : 'light_mode'} />
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
