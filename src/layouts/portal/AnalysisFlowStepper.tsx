import { motion } from 'framer-motion'
import { NavLink, useLocation } from 'react-router-dom'
import { MaterialIcon } from '../../components/MaterialIcon'
import { ANALYSIS_FLOW_STEPS, isAnalysisFlowPath } from '../../config/nav'
import { useAnalysisFlow } from '../../context/AnalysisFlowContext'
import { blockedReasonForAnalysisStep } from '../../lib/analysisFlowStepGuards'
import styles from './AnalysisFlowStepper.module.css'

/**
 * Horizontal stepper for upload → data configuration → AI suggestions → dashboard preview.
 * Steps that lack prerequisites are not navigable (with a tooltip explaining why).
 */
export function AnalysisFlowStepper() {
  const { pathname } = useLocation()
  const { uploadId, datasetProfile, suggestions } = useAnalysisFlow()

  if (!isAnalysisFlowPath(pathname)) {
    return null
  }

  const guardCtx = { uploadId, datasetProfile, suggestions }
  const currentIndex = ANALYSIS_FLOW_STEPS.findIndex((s) => s.path === pathname)
  const safeIndex = currentIndex >= 0 ? currentIndex : 0

  return (
    <div className={styles.wrap}>
      <div className={styles.inner}>
        <ol className={styles.track} aria-label="Pasos del flujo de datos">
          {ANALYSIS_FLOW_STEPS.map((step, index) => {
            const isDone = index < safeIndex
            const isCurrent = pathname === step.path
            const showConnector = index < ANALYSIS_FLOW_STEPS.length - 1
            const connectorDone = index < safeIndex
            const isLast = index === ANALYSIS_FLOW_STEPS.length - 1
            const blockReason = blockedReasonForAnalysisStep(step.path, pathname, guardCtx)
            const isBlocked = blockReason !== null

            return (
              <li
                key={step.path}
                className={[styles.stepCell, isLast ? styles.stepCellLast : ''].filter(Boolean).join(' ')}
              >
                <NavLink
                  to={step.path}
                  title={isBlocked ? blockReason : undefined}
                  aria-disabled={isBlocked}
                  onClick={(e) => {
                    if (isBlocked) {
                      e.preventDefault()
                    }
                  }}
                  className={({ isActive }) =>
                    [
                      styles.stepLink,
                      isActive ? styles.stepLinkCurrent : '',
                      !isActive && isDone ? styles.stepLinkDone : '',
                      isBlocked ? styles.stepLinkBlocked : '',
                    ]
                      .filter(Boolean)
                      .join(' ')
                  }
                  aria-current={isCurrent ? 'step' : undefined}
                >
                  <motion.div
                    className={styles.bubble}
                    layout
                    transition={{ type: 'spring', stiffness: 420, damping: 28 }}
                  >
                    {isDone ? (
                      <MaterialIcon name="check_circle" className={styles.icon} filled />
                    ) : (
                      <MaterialIcon name={step.icon} className={styles.icon} />
                    )}
                  </motion.div>
                  <span className={styles.stepLabels}>
                    <span className={styles.stepTitle}>{step.label}</span>
                    <span className={styles.stepMeta}>
                      Paso {index + 1} de {ANALYSIS_FLOW_STEPS.length}
                    </span>
                  </span>
                </NavLink>
                {showConnector ? (
                  <div className={styles.connectorCell} aria-hidden>
                    <div className={styles.connector}>
                      <div
                        className={[
                          styles.connectorFill,
                          connectorDone ? styles.connectorFillDone : '',
                        ]
                          .filter(Boolean)
                          .join(' ')}
                      />
                    </div>
                  </div>
                ) : null}
              </li>
            )
          })}
        </ol>
      </div>
    </div>
  )
}
