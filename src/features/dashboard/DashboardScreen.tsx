import { Link } from 'react-router-dom'
import { AI_SUGGESTIONS_PATH } from '../../config/nav'
import { useAnalysisFlow } from '../../context/AnalysisFlowContext'
import { WorkspacePage } from '../../layouts/WorkspacePage'
import { DashboardChartCard } from './DashboardChartCard'
import styles from './DashboardScreen.module.css'

/**
 * Renders widgets added by the analyst; each visualization hydrates aggregates from the API.
 */
export function DashboardScreen() {
  const { uploadId, dashboardWidgets, removeWidget } = useAnalysisFlow()

  const empty = (
    <div className={styles.empty}>
      <p className={styles.emptyTitle}>Todavía no hay visualizaciones</p>
      <p className={styles.emptyLead}>
        Abra una sugerencia y pulse &quot;Agregar al Dashboard&quot; para poblar esta cuadrícula.
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
      title="Panel ejecutivo"
      description="Área flexible con los indicadores seleccionados desde las tarjetas de IA."
    >
      {!uploadId || dashboardWidgets.length === 0 ? empty : null}
      {missingUpload}
      {uploadId ? (
        <div className={styles.chartGrid}>
          {dashboardWidgets.map((widget) => (
            <DashboardChartCard
              key={widget.id}
              widgetId={widget.id}
              uploadId={uploadId}
              suggestion={widget.suggestion}
              onRemove={() => removeWidget(widget.id)}
            />
          ))}
        </div>
      ) : null}
    </WorkspacePage>
  )
}
