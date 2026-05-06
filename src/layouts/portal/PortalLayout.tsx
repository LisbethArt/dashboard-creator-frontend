import { motion, useReducedMotion } from 'framer-motion'
import { Outlet, useLocation } from 'react-router-dom'
import { isAnalysisFlowPath } from '../../config/nav'
import { AnalysisFlowStepper } from './AnalysisFlowStepper'
import { PortalFooter } from './PortalFooter'
import { PortalHeader } from './PortalHeader'
import { PortalSidebar } from './PortalSidebar'
import styles from './PortalLayout.module.css'

/**
 * Authenticated-style application shell: sidebar + shared header/footer around nested routes.
 * Not used for the marketing home at `/`.
 */
export function PortalLayout() {
  const location = useLocation()
  const reduceMotion = useReducedMotion()
  const showAnalysisStepper = isAnalysisFlowPath(location.pathname)

  return (
    <div className={styles.shell}>
      <PortalSidebar />
      <div className={styles.mainColumn}>
        <PortalHeader />
        <div className={styles.scrollMain}>
          {showAnalysisStepper ? <AnalysisFlowStepper /> : null}
          <motion.div
            key={location.pathname}
            initial={reduceMotion ? false : { opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={
              reduceMotion
                ? { duration: 0 }
                : { duration: 0.42, ease: [0.22, 1, 0.36, 1] as const }
            }
          >
            <Outlet />
          </motion.div>
        </div>
        <PortalFooter />
      </div>
    </div>
  )
}
