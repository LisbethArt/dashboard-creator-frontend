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

const PIE_PALETTE = ['#2563eb', '#7c3aed', '#f59e0b', '#10b981', '#ef4444', '#64748b']

type DashboardChartCardProps = {
  widgetId: string
  uploadId: string
  suggestion: ChartSuggestion
  onRemove: () => void
}

function renderChart(kind: ChartType, rows: Array<Record<string, string | number>>) {
  if (kind === 'bar') {
    return (
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={rows} margin={{ top: 8, right: 12, bottom: 8, left: 8 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis dataKey="name" tick={{ fill: '#64748b', fontSize: 12 }} />
          <YAxis tick={{ fill: '#64748b', fontSize: 12 }} />
          <Tooltip />
          <Bar dataKey="value" fill="#2563eb" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    )
  }

  if (kind === 'line') {
    return (
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={rows} margin={{ top: 8, right: 12, bottom: 8, left: 8 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis dataKey="name" tick={{ fill: '#64748b', fontSize: 12 }} />
          <YAxis tick={{ fill: '#64748b', fontSize: 12 }} />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="value" stroke="#2563eb" strokeWidth={2} dot />
        </LineChart>
      </ResponsiveContainer>
    )
  }

  if (kind === 'pie') {
    return (
      <ResponsiveContainer width="100%" height={320}>
        <PieChart margin={{ top: 8, right: 8, bottom: 8, left: 8 }}>
          <Tooltip />
          <Legend />
          <Pie data={rows} dataKey="value" nameKey="name" innerRadius={50} outerRadius={110} paddingAngle={4}>
            {rows.map((_entry, index) => (
              <Cell key={`slice-${index}`} fill={PIE_PALETTE[index % PIE_PALETTE.length]} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
    )
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <ScatterChart margin={{ top: 8, right: 12, bottom: 8, left: 8 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
        <XAxis type="number" dataKey="x" name="X" tick={{ fill: '#64748b', fontSize: 12 }} />
        <YAxis type="number" dataKey="y" name="Y" tick={{ fill: '#64748b', fontSize: 12 }} />
        <Tooltip cursor={{ strokeDasharray: '3 3' }} />
        <Scatter name="serie" data={rows} fill="#2563eb" />
      </ScatterChart>
    </ResponsiveContainer>
  )
}

/**
 * Loads aggregated chart points from the API and renders the appropriate Recharts primitive.
 */
export function DashboardChartCard({ widgetId, uploadId, suggestion, onRemove }: DashboardChartCardProps) {
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
    <section className={styles.card} aria-label={suggestion.title} data-widget-id={widgetId}>
      <header className={styles.head}>
        <div>
          <p className={styles.kicker}>{suggestion.chart_type.toUpperCase()}</p>
          <h2 className={styles.title}>{suggestion.title}</h2>
        </div>
        <button type="button" className={styles.iconBtn} onClick={onRemove} aria-label="Quitar gráfico del panel">
          <MaterialIcon name="close" />
        </button>
      </header>
      <p className={styles.insight}>{suggestion.insight}</p>
      <div className={styles.chart}>
        {status === 'loading' ? <p className={styles.state}>Cargando datos agregados…</p> : null}
        {status === 'error' ? (
          <p className={styles.stateError}>No se pudo cargar el gráfico. Verifique los parámetros o vuelva a analizar.</p>
        ) : null}
        {status === 'ready' && rows.length === 0 ? (
          <p className={styles.stateError}>Sin puntos suficientes para graficar.</p>
        ) : null}
        {status === 'ready' && rows.length > 0 ? renderChart(suggestion.chart_type, rows) : null}
      </div>
    </section>
  )
}
