import { Link } from 'react-router-dom'
import { AI_SUGGESTIONS_PATH, DASHBOARD_PATH } from '../../config/nav'
import { useAnalysisFlow } from '../../context/AnalysisFlowContext'
import { WorkspacePage } from '../../layouts/WorkspacePage'
import { DashboardGridStack } from './DashboardGridStack'
import styles from './DashboardScreen.module.css'

/**
 * Read-only dashboard grid reflecting the layout produced in previsualización (GridStack static mode).
 */
export function PublishedDashboardScreen() {
  const { uploadId, dashboardWidgets } = useAnalysisFlow()

  const empty = (
    <div className={styles.empty}>
      <p className={styles.emptyTitle}>Sin tablero aún</p>
      <p className={styles.emptyLead}>
        Agregue gráficos desde las sugerencias, organícelos en la previsualización y vuelva aquí: verá la misma
        disposición.
      </p>
      <div className={styles.emptyActions}>
        <Link className={styles.emptyCta} to={AI_SUGGESTIONS_PATH}>
          Ver sugerencias de IA
        </Link>
        <Link className={styles.emptyCtaSecondary} to={DASHBOARD_PATH}>
          Ir a previsualización
        </Link>
      </div>
    </div>
  )

  const missingUpload =
    dashboardWidgets.length > 0 && !uploadId ? (
      <p className={styles.warn} role="status">
        No hay sesión activa para estos gráficos. Vuelva a cargar datos y repita el flujo.
      </p>
    ) : null

  return (
    <WorkspacePage
      title="Dashboard"
      description="Misma cuadrícula y tamaños que definiste al arrastrar y redimensionar en la previsualización."
    >
      {!uploadId || dashboardWidgets.length === 0 ? empty : null}
      {missingUpload}
      {uploadId && dashboardWidgets.length > 0 ? <DashboardGridStack editable={false} /> : null}
    </WorkspacePage>
  )
}
