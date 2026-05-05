import { NavLink, Outlet } from 'react-router-dom'
import { MaterialIcon } from '../components/MaterialIcon'
import { NAV_ITEMS } from '../config/nav'
import styles from './AppShell.module.css'

/**
 * Authenticated-style workspace shell: fixed sidebar and main outlet (matches Stitch app screens).
 */
export function AppShell() {
  return (
    <div className={styles.shell}>
      <aside className={styles.sidebar}>
        <div className={styles.brand}>
          <h1 className={styles.brandTitle}>Análisis al Instante</h1>
          <p className={styles.brandTag}>Analytical Authority</p>
        </div>
        <nav className={styles.nav} aria-label="Principal">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                [styles.navLink, isActive ? styles.navLinkActive : '']
                  .filter(Boolean)
                  .join(' ')
              }
              end={item.path === '/'}
            >
              <MaterialIcon name={item.icon} />
              {item.label}
            </NavLink>
          ))}
        </nav>
      </aside>
      <div className={styles.main}>
        <Outlet />
      </div>
    </div>
  )
}
