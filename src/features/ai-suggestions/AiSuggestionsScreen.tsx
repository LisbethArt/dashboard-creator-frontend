import type { CSSProperties } from 'react'
import { useMemo } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import type { ChartType } from '../../types/api'
import { MaterialIcon } from '../../components/MaterialIcon'
import { DATA_UPLOAD_PATH, DASHBOARD_PATH } from '../../config/nav'
import { useAnalysisFlow } from '../../context/AnalysisFlowContext'
import { WorkspacePage } from '../../layouts/WorkspacePage'
import { chartTypeLabelEs } from '../../lib/chartLabels'
import { ChartTypeArtwork } from './ChartTypeArtwork'
import { formatInsightHighlights } from './insightHighlights'
import styles from './AiSuggestionsScreen.module.css'

function suggestionCardKey(
  s: {
    title: string
    chart_type: string
    insight: string
    parameters: Record<string, string>
  },
  index: number,
): string {
  const paramKeys = Object.keys(s.parameters).sort().join('|')
  const paramVals = Object.keys(s.parameters)
    .sort()
    .map((k) => s.parameters[k])
    .join('|')
  return `${index}:${s.title}:${s.chart_type}:${paramKeys}:${paramVals}:${s.insight.slice(0, 48)}`
}

type SuggestionTheme = {
  category: string
  accent: string
}

function themeForChartType(chartType: ChartType): SuggestionTheme {
  switch (chartType) {
    case 'line':
      return { category: 'Finanzas', accent: '#13708a' }
    case 'bar':
      return { category: 'Operaciones', accent: '#0d9488' }
    case 'pie':
      return { category: 'Mercado', accent: '#7c3aed' }
    case 'scatter':
      return { category: 'Correlación', accent: '#50a1c7' }
    default:
      return { category: 'Análisis', accent: '#13708a' }
  }
}

const STATUS_META = ['Nuevo insight', 'Actualizado', 'Listo para revisar'] as const

/**
 * Renders Gemini-backed chart suggestion cards tied to the latest successful upload.
 */
export function AiSuggestionsScreen() {
  const navigate = useNavigate()
  const { suggestions, uploadId, addWidget, suggestionIsOnDashboard } = useAnalysisFlow()

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
      title="Sugerencias IA"
      description="Ideas de visualización basadas en su dataset: agregue las que desee al tablero."
      toolbar={
        <button
          type="button"
          className={styles.toolbarPrimary}
          disabled={!uploadId || suggestions.length === 0}
          title={
            !uploadId || suggestions.length === 0
              ? 'Se requiere una sesión de datos con sugerencias'
              : undefined
          }
          onClick={() => {
            if (!uploadId || suggestions.length === 0) {
              return
            }
            navigate(DASHBOARD_PATH)
          }}
        >
          <MaterialIcon name="arrow_forward" />
          Continuar
        </button>
      }
    >
      {!uploadId || suggestions.length === 0 ? (
        emptyMessage
      ) : (
        <>
          <p className={styles.pageKicker}>Motor de recomendaciones</p>
          <div className={styles.feed}>
            {keyed.map(({ suggestion, key }, rowIndex) => {
              const onDashboard = suggestionIsOnDashboard(suggestion)
              const theme = themeForChartType(suggestion.chart_type)
              const statusLine = STATUS_META[rowIndex % STATUS_META.length]

              return (
                <article
                  key={key}
                  className={styles.card}
                  style={
                    {
                      '--suggestion-accent': theme.accent,
                    } as CSSProperties
                  }
                >
                  <div className={styles.cardMain}>
                    <div className={styles.cardMetaRow}>
                      <span className={styles.categoryBadge}>{theme.category}</span>
                      <span className={styles.statusMeta}>{statusLine}</span>
                    </div>
                    <h2 className={styles.cardTitle}>{suggestion.title}</h2>
                    <div className={styles.insight}>
                      <MaterialIcon name="insights" className={styles.insightGlyph} filled />
                      <p className={styles.insightText}>{formatInsightHighlights(suggestion.insight)}</p>
                    </div>
                    <div className={styles.actions}>
                      <button
                        type="button"
                        className={[styles.primaryBtn, onDashboard ? styles.primaryBtnDone : '']
                          .filter(Boolean)
                          .join(' ')}
                        disabled={onDashboard}
                        aria-label={
                          onDashboard
                            ? `Ya en el dashboard: ${suggestion.title}`
                            : `Agregar al dashboard: ${suggestion.title}`
                        }
                        onClick={() => {
                          if (!onDashboard) {
                            addWidget(suggestion)
                          }
                        }}
                      >
                        <MaterialIcon name="add_box" />
                        {onDashboard ? 'Agregado al dashboard' : 'Agregar al Dashboard'}
                      </button>
                    </div>
                  </div>
                  <div className={styles.cardVisual}>
                    <span className={styles.visualTypeTag}>{chartTypeLabelEs(suggestion.chart_type)}</span>
                    <ChartTypeArtwork
                      kind={suggestion.chart_type}
                      title={suggestion.title}
                      className={styles.artworkPanel}
                    />
                  </div>
                </article>
              )
            })}
          </div>
          <p className={styles.pageFoot}>
            Vista previa interactiva en{' '}
            <Link className={styles.inlineLink} to={DASHBOARD_PATH}>
              Previsualización del dashboard
            </Link>
            .
          </p>
        </>
      )}
    </WorkspacePage>
  )
}
