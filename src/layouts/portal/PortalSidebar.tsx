import { useEffect, useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { MaterialIcon } from '../../components/MaterialIcon'
import {
  DASHBOARD_PATH,
  DATA_UPLOAD_PATH,
  isAnalysisFlowPath,
  isAnalysisWorkflowHubPath,
  NAV_ITEMS,
} from '../../config/nav'
import styles from './PortalSidebar.module.css'

const LAST_ANALYSIS_STEP_KEY = 'dashboard-creator:last-analysis-step'

type PortalSidebarProps = {
  isMobileOpen: boolean
  onClose: () => void
}

/**
 * Primary workspace navigation (brand + shell links). Shared across all authenticated-style routes.
 */
export function PortalSidebar({ isMobileOpen, onClose }: PortalSidebarProps) {
  const { pathname } = useLocation()
  const [lastAnalysisStep, setLastAnalysisStep] = useState<string>(() => {
    if (typeof window === 'undefined') {
      return DATA_UPLOAD_PATH
    }
    try {
      const saved = window.localStorage.getItem(LAST_ANALYSIS_STEP_KEY)
      return saved && isAnalysisFlowPath(saved) ? saved : DATA_UPLOAD_PATH
    } catch {
      return DATA_UPLOAD_PATH
    }
  })

  useEffect(() => {
    if (!isAnalysisFlowPath(pathname)) {
      return
    }
    setLastAnalysisStep(pathname)
    try {
      window.localStorage.setItem(LAST_ANALYSIS_STEP_KEY, pathname)
    } catch {
      return
    }
  }, [pathname])

  const hasCompletedStepFour = lastAnalysisStep === DASHBOARD_PATH

  return (
    <aside className={[styles.sidebar, isMobileOpen ? styles.sidebarOpen : ''].filter(Boolean).join(' ')}>
      <div className={styles.brand}>
        <div className={styles.brandMark} aria-hidden>
          <MaterialIcon name="bolt" className={styles.brandIcon} />
        </div>
        <div className={styles.brandText}>
          <h1 className={styles.brandTitle}>Análisis al Instante</h1>
          <p className={styles.brandTag}>DASHBOARDS INTELIGENTES</p>
        </div>
      </div>
      <nav className={styles.nav} aria-label="Principal">
        {NAV_ITEMS.map((item) => {
          const isLocked =
            (item.key === 'dashboard' || item.key === 'export-report') && !hasCompletedStepFour
          return (
            <NavLink
              key={item.key}
              to={item.key === 'analysis-workflow' ? lastAnalysisStep : item.path}
              title={isLocked ? 'Complete primero el paso 4 en Datos e IA' : undefined}
              aria-disabled={isLocked}
              tabIndex={isLocked ? -1 : 0}
              onClick={(e) => {
                if (isLocked) {
                  e.preventDefault()
                  return
                }
                onClose()
              }}
              className={({ isActive }) => {
                const active =
                  item.key === 'analysis-workflow' ? isAnalysisWorkflowHubPath(pathname) : isActive
                return [
                  styles.navLink,
                  active ? styles.navLinkActive : '',
                  isLocked ? styles.navLinkDisabled : '',
                ]
                  .filter(Boolean)
                  .join(' ')
              }}
            >
              <MaterialIcon name={item.icon} />
              {item.label}
            </NavLink>
          )
        })}
      </nav>
    </aside>
  )
}
