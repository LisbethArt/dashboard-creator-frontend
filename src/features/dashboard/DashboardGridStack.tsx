import 'gridstack/dist/gridstack.min.css'
import { useLayoutEffect, useRef } from 'react'
import { GridStack } from 'gridstack'
import { MaterialIcon } from '../../components/MaterialIcon'
import { useAnalysisFlow } from '../../context/AnalysisFlowContext'
import type { DashboardWidget } from '../../types/api'
import { DashboardChartCard } from './DashboardChartCard'
import styles from './DashboardGridStack.module.css'

function gsAttrs(widget: DashboardWidget) {
  return {
    'gs-id': widget.id,
    'gs-x': widget.layout.x,
    'gs-y': widget.layout.y,
    'gs-w': widget.layout.w,
    'gs-h': widget.layout.h,
    'gs-min-w': widget.layout.minW,
    'gs-min-h': widget.layout.minH,
  } as Record<string, string | number>
}

type DashboardGridStackProps = {
  editable: boolean
}

/**
 * GridStack-backed layout for dashboard widgets; editable mode enables drag/resize within min sizes.
 */
export function DashboardGridStack({ editable }: DashboardGridStackProps) {
  const { uploadId, dashboardWidgets, removeWidget, applyDashboardLayoutFromGrid } =
    useAnalysisFlow()
  const rootRef = useRef<HTMLDivElement>(null)
  const gridRef = useRef<GridStack | null>(null)
  const idsKey = [...dashboardWidgets].map((w) => w.id).sort().join('|')

  useLayoutEffect(() => {
    const root = rootRef.current
    if (!root || !uploadId || dashboardWidgets.length === 0) {
      if (gridRef.current) {
        gridRef.current.destroy(false)
        gridRef.current = null
      }
      return
    }

    if (gridRef.current) {
      gridRef.current.destroy(false)
      gridRef.current = null
    }

    const grid = GridStack.init(
      editable
        ? {
            cellHeight: 72,
            margin: 10,
            column: 12,
            animate: true,
            float: true,
            staticGrid: false,
            sizeToContent: false,
            disableDrag: false,
            disableResize: false,
            alwaysShowResizeHandle: true,
            handle: '.dashboard-grid-drag-handle',
            draggable: {
              handle: '.dashboard-grid-drag-handle',
              appendTo: 'body',
              scroll: true,
            },
            resizable: {
              handles: 'se',
              autoHide: false,
            },
          }
        : {
            cellHeight: 72,
            margin: 10,
            column: 12,
            animate: true,
            float: true,
            staticGrid: true,
            sizeToContent: false,
          },
      root,
    )
    gridRef.current = grid

    const onChange = () => {
      const patches = (grid.engine.nodes ?? [])
        .map((n) => {
          const nodeId = n.el?.id || n.el?.getAttribute('gs-id') || (n.id != null ? String(n.id) : '')
          if (!nodeId || n.x == null || n.y == null || n.w == null || n.h == null) {
            return null
          }
          return { id: nodeId, x: n.x, y: n.y, w: n.w, h: n.h }
        })
        .filter((p): p is { id: string; x: number; y: number; w: number; h: number } => p !== null)
      if (patches.length > 0) {
        applyDashboardLayoutFromGrid(patches)
      }
    }
    if (editable) {
      grid.on('change', onChange)
    }

    return () => {
      if (editable) {
        grid.off('change')
      }
      grid.destroy(false)
      gridRef.current = null
    }
  }, [uploadId, idsKey, editable, applyDashboardLayoutFromGrid])

  if (!uploadId || dashboardWidgets.length === 0) {
    return null
  }

  return (
    <div
      ref={rootRef}
      className={[
        'grid-stack',
        styles.gridCanvas,
        editable ? styles.gridCanvasPreview : styles.gridCanvasReadonly,
        editable ? styles.gridCanvasEdit : '',
      ]
        .filter(Boolean)
        .join(' ')}
      data-dashboard-grid={editable ? 'edit' : 'view'}
    >
      {dashboardWidgets.map((widget) => (
        <div key={widget.id} id={widget.id} className="grid-stack-item" {...gsAttrs(widget)}>
          <div className={`grid-stack-item-content ${styles.itemContent}`}>
            <div className={styles.itemBody}>
              {editable ? (
                <div
                  className={`${styles.dragHandleRoot} dashboard-grid-drag-handle`}
                  role="toolbar"
                  aria-label="Arrastrar tarjeta"
                >
                  <MaterialIcon name="drag_indicator" className={styles.dragIcon} />
                  <span className={styles.dragLabel}>Mover</span>
                </div>
              ) : null}
              <DashboardChartCard
                widgetId={widget.id}
                uploadId={uploadId}
                suggestion={widget.suggestion}
                onRemove={() => removeWidget(widget.id)}
                showRemove={editable}
                fillContainer
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
