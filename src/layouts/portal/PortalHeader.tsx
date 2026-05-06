import { MaterialIcon } from '../../components/MaterialIcon'
import { useTheme } from '../../context/ThemeContext'
import styles from './PortalHeader.module.css'

type PortalHeaderProps = {
  onToggleMobileMenu: () => void
}

/**
 * Global workspace chrome: section tabs, search, and quick actions. Page titles live in `WorkspacePage`.
 */
export function PortalHeader({ onToggleMobileMenu }: PortalHeaderProps) {
  const { theme, toggleTheme } = useTheme()

  return (
    <header className={styles.root}>
      <div className={styles.left}>
        <button
          type="button"
          className={styles.mobileMenuButton}
          onClick={onToggleMobileMenu}
          aria-label="Abrir menú lateral"
        >
          <MaterialIcon name="menu" />
        </button>
      </div>
      <div className={styles.right}>
        <button
          type="button"
          className={styles.iconGhost}
          onClick={toggleTheme}
          aria-label={theme === 'light' ? 'Activar modo oscuro' : 'Activar modo claro'}
        >
          <MaterialIcon name={theme === 'light' ? 'dark_mode' : 'light_mode'} />
        </button>
        <div className={styles.avatar} aria-hidden>
          LA
        </div>
      </div>
    </header>
  )
}
