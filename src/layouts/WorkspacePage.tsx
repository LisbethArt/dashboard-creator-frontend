import type { ReactNode } from 'react'
import { MaterialIcon } from '../components/MaterialIcon'
import styles from './WorkspacePage.module.css'

type WorkspacePageProps = {
  title: string
  description?: string
  toolbar?: ReactNode
  children: ReactNode
}

/**
 * Inner page frame: top app bar and padded content area (matches Stitch desktop shell).
 */
export function WorkspacePage({
  title,
  description,
  toolbar,
  children,
}: WorkspacePageProps) {
  return (
    <div className={styles.root}>
      <header className={styles.top}>
        <div className={styles.topLeft}>
          <nav className={styles.subNav} aria-label="Sección">
            <a className={styles.subLink} href="#overview">
              Overview
            </a>
            <a className={styles.subLinkActive} href="#history">
              History
            </a>
            <a className={styles.subLink} href="#projects">
              Projects
            </a>
          </nav>
        </div>
        <div className={styles.topRight}>
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
            DA
          </div>
        </div>
      </header>

      <div className={styles.body}>
        <div className={styles.intro}>
          <div>
            <h1 className={styles.title}>{title}</h1>
            {description ? <p className={styles.desc}>{description}</p> : null}
          </div>
          {toolbar ? <div className={styles.toolbar}>{toolbar}</div> : null}
        </div>
        {children}
      </div>
    </div>
  )
}
