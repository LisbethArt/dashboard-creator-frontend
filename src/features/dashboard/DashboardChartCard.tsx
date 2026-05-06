import { useEffect, useState } from 'react'
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { MaterialIcon } from '../../components/MaterialIcon'
import { fetchChartSeries } from '../../api/analysis'
import type { ChartSuggestion, ChartType } from '../../types/api'
import styles from './DashboardChartCard.module.css'

const PIE_PALETTE = ['#1fbecc', '#13708a', '#5fd4e0', '#10b981', '#64748b', '#0d5666']

type DashboardChartCardProps = {
  widgetId: string
  uploadId: string
  suggestion: ChartSuggestion
  onRemove: () => void
  showRemove?: boolean
  fillContainer?: boolean
}

function renderChart(
  kind: ChartType,
  rows: Array<Record<string, string | number>>,
  fillContainer: boolean,
) {
  if (kind === 'bar') {
    return (
      <ResponsiveContainer
        width="100%"
        height={fillContainer ? '100%' : 300}
        minHeight={fillContainer ? 200 : undefined}
      >
        <BarChart data={rows} margin={{ top: 8, right: 12, bottom: 8, left: 8 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--color-outline-variant)" />
          <XAxis dataKey="name" tick={{ fill: 'var(--color-slate-500)', fontSize: 12 }} />
          <YAxis tick={{ fill: 'var(--color-slate-500)', fontSize: 12 }} />
          <Tooltip />
          <Bar dataKey="value" fill="var(--color-primary)" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    )
  }

  if (kind === 'line') {
    return (
      <ResponsiveContainer
        width="100%"
        height={fillContainer ? '100%' : 300}
        minHeight={fillContainer ? 200 : undefined}
      >
        <LineChart data={rows} margin={{ top: 8, right: 12, bottom: 8, left: 8 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--color-outline-variant)" />
          <XAxis dataKey="name" tick={{ fill: 'var(--color-slate-500)', fontSize: 12 }} />
          <YAxis tick={{ fill: 'var(--color-slate-500)', fontSize: 12 }} />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="value" stroke="var(--color-primary-container)" strokeWidth={2} dot />
        </LineChart>
      </ResponsiveContainer>
    )
  }

  if (kind === 'pie') {
    const pieH = fillContainer ? '100%' : 320
    return (
      <ResponsiveContainer width="100%" height={pieH} minHeight={fillContainer ? 220 : undefined}>
        <PieChart margin={{ top: 8, right: 8, bottom: 8, left: 8 }}>
          <Tooltip />
          <Legend />
          <Pie
            data={rows}
            dataKey="value"
            nameKey="name"
            innerRadius={fillContainer ? 40 : 50}
            outerRadius={fillContainer ? 95 : 110}
            paddingAngle={4}
          >
            {rows.map((_entry, index) => (
              <Cell key={`slice-${index}`} fill={PIE_PALETTE[index % PIE_PALETTE.length]} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
    )
  }

  return (
    <ResponsiveContainer
      width="100%"
      height={fillContainer ? '100%' : 300}
      minHeight={fillContainer ? 200 : undefined}
    >
      <ScatterChart margin={{ top: 8, right: 12, bottom: 8, left: 8 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--color-outline-variant)" />
        <XAxis type="number" dataKey="x" name="X" tick={{ fill: 'var(--color-slate-500)', fontSize: 12 }} />
        <YAxis type="number" dataKey="y" name="Y" tick={{ fill: 'var(--color-slate-500)', fontSize: 12 }} />
        <Tooltip cursor={{ strokeDasharray: '3 3' }} />
        <Scatter name="serie" data={rows} fill="var(--color-primary)" />
      </ScatterChart>
    </ResponsiveContainer>
  )
}

/**
 * Loads aggregated chart points from the API and renders the appropriate Recharts primitive.
 */
export function DashboardChartCard({
  widgetId,
  uploadId,
  suggestion,
  onRemove,
  showRemove = true,
  fillContainer = false,
}: DashboardChartCardProps) {
  const [status, setStatus] = useState<'idle' | 'loading' | 'ready' | 'error'>('idle')
  const [rows, setRows] = useState<Array<Record<string, string | number>>>([])

  const parametersKey = JSON.stringify(suggestion.parameters)

  useEffect(() => {
    const ac = new AbortController()
    let cancelled = false
    setStatus('loading')
    ;(async () => {
      try {
        const response = await fetchChartSeries(
          {
            upload_id: uploadId,
            chart_type: suggestion.chart_type,
            parameters: suggestion.parameters,
          },
          { signal: ac.signal },
        )
        if (!cancelled) {
          setRows(response.data)
          setStatus('ready')
        }
      } catch (err) {
        if (err instanceof DOMException && err.name === 'AbortError') {
          return
        }
        console.error(err)
        if (!cancelled) {
          setStatus('error')
        }
      }
    })()
    return () => {
      cancelled = true
      ac.abort()
    }
  }, [uploadId, suggestion.chart_type, parametersKey])

  return (
    <section
      className={[styles.card, fillContainer ? styles.cardFill : ''].filter(Boolean).join(' ')}
      aria-label={suggestion.title}
      data-widget-id={widgetId}
    >
      <header className={styles.head}>
        <div>
          <p className={styles.kicker}>{suggestion.chart_type.toUpperCase()}</p>
          <h2 className={styles.title}>{suggestion.title}</h2>
        </div>
        {showRemove ? (
          <button type="button" className={styles.iconBtn} onClick={onRemove} aria-label="Quitar gráfico del panel">
            <MaterialIcon name="close" />
          </button>
        ) : null}
      </header>
      <p className={styles.insight}>{suggestion.insight}</p>
      <div className={[styles.chart, fillContainer ? styles.chartFill : ''].filter(Boolean).join(' ')}>
        {status === 'loading' ? <p className={styles.state}>Cargando datos agregados…</p> : null}
        {status === 'error' ? (
          <p className={styles.stateError}>No se pudo cargar el gráfico. Verifique los parámetros o vuelva a analizar.</p>
        ) : null}
        {status === 'ready' && rows.length === 0 ? (
          <p className={styles.stateError}>Sin puntos suficientes para graficar.</p>
        ) : null}
        {status === 'ready' && rows.length > 0 ? renderChart(suggestion.chart_type, rows, fillContainer) : null}
      </div>
    </section>
  )
}
