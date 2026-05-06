import type { ReactNode } from 'react'
import styles from './WorkspacePage.module.css'

type WorkspacePageProps = {
  title: string
  description?: string
  toolbar?: ReactNode
  children: ReactNode
}

/**
 * Page title and main content inside the portal scroll region; shell chrome is `PortalLayout`.
 */
export function WorkspacePage({
  title,
  description,
  toolbar,
  children,
}: WorkspacePageProps) {
  return (
    <div className={styles.root}>
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
