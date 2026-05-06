import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { MaterialIcon } from '../../components/MaterialIcon'
import { DATA_UPLOAD_PATH } from '../../config/nav'
import { useAnalysisFlow } from '../../context/AnalysisFlowContext'
import { WorkspacePage } from '../../layouts/WorkspacePage'
import { chartTypeLabelEs } from '../../lib/chartLabels'
import styles from './AiSuggestionsScreen.module.css'

function suggestionCardKey(s: {
  title: string
  chart_type: string
  insight: string
  parameters: Record<string, string>
}, index: number): string {
  const paramKeys = Object.keys(s.parameters).sort().join('|')
  const paramVals = Object.keys(s.parameters)
    .sort()
    .map((k) => s.parameters[k])
    .join('|')
  return `${index}:${s.title}:${s.chart_type}:${paramKeys}:${paramVals}:${s.insight.slice(0, 48)}`
}

/**
 * Renders Gemini-backed chart suggestion cards tied to the latest successful upload.
 */
export function AiSuggestionsScreen() {
  const { suggestions, uploadId, addWidget, suggestionIsOnDashboard } =
    useAnalysisFlow()

  const keyed = useMemo(
    () =>
      suggestions.map((s, idx) => ({
        suggestion: s,
        key: suggestionCardKey(s, idx),
      })),
    [suggestions],
  )

  const emptyMessage = (
    <div className={styles.empty}>
      <p className={styles.emptyTitle}>Aún no hay sugerencias</p>
      <p className={styles.emptyLead}>
        Cargue una hoja de cálculo para que la IA analice patrones interesantes.
      </p>
      <Link className={styles.emptyCta} to={DATA_UPLOAD_PATH}>
        Ir a cargar datos
      </Link>
    </div>
  )

  return (
    <WorkspacePage
      title="Análisis sugeridos"
      description="Tarjetas interactivas generadas tras examinar los metadatos y la distribución de sus columnas."
    >
      {!uploadId || suggestions.length === 0 ? (
        emptyMessage
      ) : (
        <>
          <p className={styles.kicker}>Sugerencias del motor IA</p>
          <div className={styles.feed}>
            {keyed.map(({ suggestion, key }) => {
              const onDashboard = suggestionIsOnDashboard(suggestion)
              return (
                <article key={key} className={styles.card}>
                  <div className={styles.cardTop}>
                    <span className={styles.badge}>{chartTypeLabelEs(suggestion.chart_type)}</span>
                    <span className={onDashboard ? styles.stateOnDash : styles.stateIdle}>
                      {onDashboard ? 'En la previsualización' : 'Listo para agregar'}
                    </span>
                  </div>
                  <h2 className={styles.cardTitle}>{suggestion.title}</h2>
                  <div className={styles.insight}>
                    <MaterialIcon name="lightbulb" />
                    <p>{suggestion.insight}</p>
                  </div>
                  <div className={styles.spark} aria-hidden>
                    <span />
                    <span />
                    <span />
                    <span />
                    <span />
                    <span />
                  </div>
                  <div className={styles.actions}>
                    <button
                      type="button"
                      className={[styles.primary, onDashboard ? styles.primaryAdded : '']
                        .filter(Boolean)
                        .join(' ')}
                      disabled={onDashboard}
                      aria-label={
                        onDashboard
                          ? `Ya en la previsualización: ${suggestion.title}`
                          : `Agregar a la previsualización: ${suggestion.title}`
                      }
                      onClick={() => {
                        if (onDashboard) {
                          return
                        }
                        addWidget(suggestion)
                      }}
                    >
                      {onDashboard ? 'Agregado' : 'Agregar a la previsualización'}
                    </button>
                  </div>
                </article>
              )
            })}
          </div>
        </>
      )}
    </WorkspacePage>
  )
}
