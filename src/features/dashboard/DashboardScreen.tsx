import { Link } from 'react-router-dom'
import { AI_SUGGESTIONS_PATH, PUBLISHED_DASHBOARD_PATH } from '../../config/nav'
import { useAnalysisFlow } from '../../context/AnalysisFlowContext'
import { WorkspacePage } from '../../layouts/WorkspacePage'
import { DashboardGridStack } from './DashboardGridStack'
import styles from './DashboardScreen.module.css'

/**
 * Editable GridStack preview: drag, resize within min sizes; layout is shared with the final Dashboard module.
 */
export function DashboardScreen() {
  const { uploadId, dashboardWidgets } = useAnalysisFlow()

  const empty = (
    <div className={styles.empty}>
      <p className={styles.emptyTitle}>Todavía no hay visualizaciones</p>
      <p className={styles.emptyLead}>
        Abra una sugerencia y pulse &quot;Agregar a la previsualización&quot; para poblar esta cuadrícula.
      </p>
      <Link className={styles.emptyCta} to={AI_SUGGESTIONS_PATH}>
        Ver sugerencias de IA
      </Link>
    </div>
  )

  const missingUpload =
    dashboardWidgets.length > 0 && !uploadId ? (
      <p className={styles.warn} role="status">
        No hay sesión activa para estos gráficos. Vuelva a cargar datos y repita las sugerencias.
      </p>
    ) : null

  return (
    <WorkspacePage
      title="Previsualización del dashboard"
      description="Arrastre las tarjetas por la barra «Mover», redimensione desde las esquinas y bordes. El tablero final en el menú «Dashboard» replica esta organización."
    >
      {!uploadId || dashboardWidgets.length === 0 ? empty : null}
      {missingUpload}
      {uploadId && dashboardWidgets.length > 0 ? (
        <p className={styles.gridHint}>
          Vista previa interactiva — el resultado fijo está en{' '}
          <Link className={styles.gridHintLink} to={PUBLISHED_DASHBOARD_PATH}>
            Dashboard
          </Link>
          .
        </p>
      ) : null}
      {uploadId && dashboardWidgets.length > 0 ? <DashboardGridStack editable /> : null}
    </WorkspacePage>
  )
}
