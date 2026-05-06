import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { MaterialIcon } from '../../components/MaterialIcon'
import { DATA_UPLOAD_PATH } from '../../config/nav'
import { useAnalysisFlow } from '../../context/AnalysisFlowContext'
import { WorkspacePage } from '../../layouts/WorkspacePage'
import { chartTypeLabelEs } from '../../lib/chartLabels'
import styles from './AiSuggestionsScreen.module.css'

/**
 * Renders Gemini-backed chart suggestion cards tied to the latest successful upload.
 */
export function AiSuggestionsScreen() {
  const { suggestions, uploadId, addWidget } = useAnalysisFlow()
  const [appliedId, setAppliedId] = useState<string | null>(null)

  const keyed = useMemo(
    () => suggestions.map((s, idx) => ({ suggestion: s, key: `${s.title}-${idx}` })),
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
      toolbar={
        <div className={styles.toggle} role="group" aria-label="Ordenar sugerencias">
          <button type="button" className={styles.toggleActive}>
            Recientes
          </button>
          <button type="button" className={styles.toggleIdle} disabled>
            Populares
          </button>
        </div>
      }
    >
      {!uploadId || suggestions.length === 0 ? (
        emptyMessage
      ) : (
        <>
          <p className={styles.kicker}>Sugerencias del motor IA</p>
          <div className={styles.feed}>
            {keyed.map(({ suggestion, key }) => (
              <article key={key} className={styles.card}>
                <div className={styles.cardTop}>
                  <span className={styles.badge}>{chartTypeLabelEs(suggestion.chart_type)}</span>
                  <span className={styles.time}>Listo para el tablero</span>
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
                    className={styles.primary}
                    aria-label={`Agregar al dashboard: ${suggestion.title}`}
                    onClick={() => {
                      addWidget(suggestion)
                      setAppliedId(key)
                      setTimeout(() => setAppliedId((current) => (current === key ? null : current)), 2800)
                    }}
                  >
                    Agregar al Dashboard
                  </button>
                  {appliedId === key ? (
                    <span className={styles.feedback} role="status">
                      Añadido al panel ejecutivo.
                    </span>
                  ) : null}
                </div>
              </article>
            ))}
          </div>
        </>
      )}
    </WorkspacePage>
  )
}
