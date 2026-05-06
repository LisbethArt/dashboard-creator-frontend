import { Outlet } from 'react-router-dom'
import { PortalFooter } from './PortalFooter'
import { PortalHeader } from './PortalHeader'
import { PortalSidebar } from './PortalSidebar'
import styles from './PortalLayout.module.css'

/**
 * Authenticated-style application shell: sidebar + shared header/footer around nested routes.
 * Not used for the marketing home at `/`.
 */
export function PortalLayout() {
  return (
    <div className={styles.shell}>
      <PortalSidebar />
      <div className={styles.mainColumn}>
        <PortalHeader />
        <div className={styles.scrollMain}>
          <Outlet />
        </div>
        <PortalFooter />
      </div>
    </div>
  )
}
