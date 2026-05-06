import { NavLink, useLocation } from 'react-router-dom'
import { MaterialIcon } from '../../components/MaterialIcon'
import { isAnalysisWorkflowHubPath, NAV_ITEMS } from '../../config/nav'
import styles from './PortalSidebar.module.css'

/**
 * Primary workspace navigation (brand + shell links). Shared across all authenticated-style routes.
 */
export function PortalSidebar() {
  const { pathname } = useLocation()

  return (
    <aside className={styles.sidebar}>
      <div className={styles.brand}>
        <div className={styles.brandMark} aria-hidden>
          <MaterialIcon name="bolt" className={styles.brandIcon} />
        </div>
        <div className={styles.brandText}>
          <h1 className={styles.brandTitle}>Análisis al Instante</h1>
          <p className={styles.brandTag}>PIPELINE INTELIGENTE</p>
        </div>
      </div>
      <nav className={styles.nav} aria-label="Principal">
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.key}
            to={item.path}
            className={({ isActive }) => {
              const active =
                item.key === 'analysis-workflow' ? isAnalysisWorkflowHubPath(pathname) : isActive
              return [styles.navLink, active ? styles.navLinkActive : ''].filter(Boolean).join(' ')
            }}
          >
            <MaterialIcon name={item.icon} />
            {item.label}
          </NavLink>
        ))}
      </nav>
      <div className={styles.sidebarFoot}>
        <p className={styles.sidebarFootMuted}>Workspace</p>
      </div>
    </aside>
  )
}
