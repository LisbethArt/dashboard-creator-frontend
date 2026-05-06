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

function fillChartMinPx(kind: ChartType, rowCount: number): number {
  if (rowCount <= 0) {
    return 200
  }
  const capped = kind === 'scatter' ? Math.min(rowCount, 96) : Math.min(rowCount, 22)
  switch (kind) {
    case 'pie':
      return Math.min(540, Math.max(224, 152 + capped * 32))
    case 'bar':
      return Math.min(540, Math.max(200, 112 + capped * 28))
    case 'line':
      return Math.min(500, Math.max(200, 128 + capped * 16))
    case 'scatter':
      return Math.min(500, Math.max(200, 168 + capped * 2.6))
    default:
      return 200
  }
}

function barChartBottomMargin(barCount: number): number {
  return Math.min(104, Math.max(10, 10 + Math.min(barCount, 24) * (barCount > 14 ? 6 : 4)))
}

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
  chartMinPx?: number,
) {
  const n = rows.length
  const marginBottomBar = barChartBottomMargin(n)

  if (kind === 'bar') {
    const denseCats = n > 12
    return (
      <ResponsiveContainer width="100%" height={fillContainer ? '100%' : 300} minHeight={chartMinPx}>
        <BarChart
          data={rows}
          margin={{ top: 8, right: 12, bottom: marginBottomBar, left: denseCats ? 12 : 8 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="var(--color-outline-variant)" />
          <XAxis
            dataKey="name"
            tick={{ fill: 'var(--color-slate-500)', fontSize: 12 }}
            angle={denseCats ? -22 : 0}
            textAnchor={denseCats ? 'end' : 'middle'}
            height={denseCats ? 72 : undefined}
            interval={0}
          />
          <YAxis tick={{ fill: 'var(--color-slate-500)', fontSize: 12 }} />
          <Tooltip />
          <Bar dataKey="value" fill="var(--color-primary)" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    )
  }

  if (kind === 'line') {
    const legendTall = n > 6
    return (
      <ResponsiveContainer width="100%" height={fillContainer ? '100%' : 300} minHeight={chartMinPx}>
        <LineChart
          data={rows}
          margin={{
            top: 8,
            right: 12,
            bottom: legendTall ? Math.min(88, 28 + n * 4) : 12,
            left: 8,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="var(--color-outline-variant)" />
          <XAxis dataKey="name" tick={{ fill: 'var(--color-slate-500)', fontSize: 12 }} />
          <YAxis tick={{ fill: 'var(--color-slate-500)', fontSize: 12 }} />
          <Tooltip />
          <Legend verticalAlign="bottom" />
          <Line type="monotone" dataKey="value" stroke="var(--color-primary-container)" strokeWidth={2} dot />
        </LineChart>
      </ResponsiveContainer>
    )
  }

  if (kind === 'pie') {
    const pieH = fillContainer ? '100%' : 320
    return (
      <ResponsiveContainer width="100%" height={pieH} minHeight={chartMinPx}>
        <PieChart margin={{ top: 8, right: 8, bottom: Math.min(96, 12 + n * 10), left: 8 }}>
          <Tooltip />
          <Legend verticalAlign="bottom" />
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
    <ResponsiveContainer width="100%" height={fillContainer ? '100%' : 300} minHeight={chartMinPx}>
      <ScatterChart margin={{ top: 8, right: 12, bottom: 8, left: 12 }}>
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

  const chartMinPx =
    fillContainer && status === 'ready' && rows.length > 0
      ? fillChartMinPx(suggestion.chart_type, rows.length)
      : fillContainer
        ? 200
        : 0

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
      <div
        className={[styles.chart, fillContainer ? styles.chartFill : ''].filter(Boolean).join(' ')}
        style={fillContainer && chartMinPx > 0 ? { minHeight: chartMinPx } : undefined}
      >
        {status === 'loading' ? <p className={styles.state}>Cargando datos agregados…</p> : null}
        {status === 'error' ? (
          <p className={styles.stateError}>No se pudo cargar el gráfico. Verifique los parámetros o vuelva a analizar.</p>
        ) : null}
        {status === 'ready' && rows.length === 0 ? (
          <p className={styles.stateError}>Sin puntos suficientes para graficar.</p>
        ) : null}
        {status === 'ready' && rows.length > 0
          ? renderChart(suggestion.chart_type, rows, fillContainer, fillContainer ? chartMinPx || 200 : undefined)
          : null}
      </div>
    </section>
  )
}
