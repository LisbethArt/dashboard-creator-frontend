import { useCallback, useRef, useState } from 'react'
import { MaterialIcon } from '../../components/MaterialIcon'
import { useAnalysisFlow } from '../../context/AnalysisFlowContext'
import { WorkspacePage } from '../../layouts/WorkspacePage'
import styles from './DataUploadScreen.module.css'

const ACCEPT = '.csv,.xlsx,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,text/csv'

/** Server pipeline limit aligned with practical browser uploads. */
const MAX_FILE_BYTES = 50 * 1024 * 1024

function pickFirstFile(list: FileList | null): File | null {
  if (!list?.length) {
    return null
  }
  const candidate = list[0]
  const name = candidate.name.toLowerCase()
  if (name.endsWith('.csv') || name.endsWith('.xlsx')) {
    return candidate
  }
  return null
}

function validateSpreadsheetFile(file: File): string | null {
  const name = file.name.toLowerCase()
  if (!name.endsWith('.csv') && !name.endsWith('.xlsx')) {
    return 'Solo se admiten archivos .csv o .xlsx.'
  }
  if (file.size === 0) {
    return 'El archivo está vacío.'
  }
  if (file.size > MAX_FILE_BYTES) {
    return `El archivo supera el tamaño máximo permitido (${MAX_FILE_BYTES / (1024 * 1024)} MB).`
  }
  return null
}

/**
 * Spreadsheet upload workspace with drag-and-drop and AI analysis orchestration.
 *
 * @remarks Visible strings use Spanish for end users.
 */
export function DataUploadScreen() {
  const inputRef = useRef<HTMLInputElement>(null)
  const [dragOver, setDragOver] = useState(false)
  const [clientError, setClientError] = useState<string | null>(null)
  const { isAnalyzing, analysisProgress, activeFileLabel, lastError, clearError, runAnalysis } =
    useAnalysisFlow()

  const ingest = useCallback(
    (file: File | null) => {
      if (!file || isAnalyzing) {
        return
      }
      setClientError(null)
      const invalid = validateSpreadsheetFile(file)
      if (invalid) {
        setClientError(invalid)
        return
      }
      void runAnalysis(file)
    },
    [isAnalyzing, runAnalysis],
  )

  const tryIngestList = useCallback(
    (list: FileList | null) => {
      if (!list?.length) {
        return
      }
      const file = pickFirstFile(list)
      if (!file) {
        setClientError('Solo se admiten archivos .csv o .xlsx.')
        return
      }
      ingest(file)
    },
    [ingest],
  )

  return (
    <WorkspacePage
      title="Cargar datos"
      description="Importe sus archivos para que la IA genere análisis estadísticos al instante."
    >
      <div className={styles.grid}>
        <section
          className={[styles.dropzone, dragOver ? styles.dropzoneActive : ''].filter(Boolean).join(' ')}
          aria-label="Zona de carga"
          onDragOver={(e) => {
            e.preventDefault()
            setDragOver(true)
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => {
            e.preventDefault()
            setDragOver(false)
            tryIngestList(e.dataTransfer.files)
          }}
        >
          <input
            ref={inputRef}
            type="file"
            accept={ACCEPT}
            className={styles.fileInput}
            aria-label="Seleccionar archivo CSV o Excel"
            onChange={(e) => {
              tryIngestList(e.target.files)
              e.target.value = ''
            }}
          />
          <div className={styles.dropGlow} aria-hidden />
          <div className={styles.dropIcon}>
            <MaterialIcon name="cloud_upload" className={styles.dropIconGlyph} />
          </div>
          <h2 className={styles.dropTitle}>
            {isAnalyzing ? 'Analizando sus datos con IA…' : 'Arrastra y suelta tus archivos'}
          </h2>
          <p className={styles.dropHint}>
            Formatos .csv y .xlsx. Arrastre el archivo o selecciónelo desde su equipo.
          </p>
          <button
            type="button"
            className={styles.pickBtn}
            disabled={isAnalyzing}
            onClick={() => inputRef.current?.click()}
          >
            Seleccionar archivos
          </button>
          <div className={styles.formats}>
            <div>
              <p className={styles.formatTitle}>.CSV</p>
              <p className={styles.formatMeta}>Delimitado estándar</p>
            </div>
            <div>
              <p className={styles.formatTitle}>.XLSX</p>
              <p className={styles.formatMeta}>Excel moderno</p>
            </div>
          </div>
        </section>
        <aside className={styles.side}>
          <div className={styles.sideCard}>
            <div className={styles.sideHead}>
              <MaterialIcon name="analytics" />
              <span>{isAnalyzing ? 'Procesando' : 'Análisis activo'}</span>
              {isAnalyzing ? (
                <span className={styles.progressPercent} aria-live="polite">
                  {analysisProgress}%
                </span>
              ) : null}
            </div>
            <p className={styles.sideTitle}>
              {isAnalyzing && activeFileLabel ? activeFileLabel : isAnalyzing ? '…' : 'Sin archivo'}
            </p>
            <div
              className={styles.progress}
              role="progressbar"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={isAnalyzing ? analysisProgress : 0}
              aria-label="Avance del análisis"
            >
              <span className={styles.progressBar} style={{ width: `${isAnalyzing ? analysisProgress : 0}%` }} />
            </div>
            <p className={styles.sideMeta}>
              {isAnalyzing
                ? analysisProgress < 95
                  ? 'Subiendo el archivo al servidor'
                  : 'Cargando archivo y procesando datos...'
                : 'Suba un archivo para iniciar el flujo automático.'}
            </p>
          </div>
          {clientError ? (
            <div className={styles.errorCard} role="alert">
              <p className={styles.errorTitle}>Archivo no válido</p>
              <p className={styles.errorBody}>{clientError}</p>
              <button type="button" className={styles.errorDismiss} onClick={() => setClientError(null)}>
                Cerrar
              </button>
            </div>
          ) : null}
          {lastError ? (
            <div className={styles.errorCard} role="alert">
              <p className={styles.errorTitle}>No se pudo analizar el archivo</p>
              <p className={styles.errorBody}>{lastError}</p>
              <button type="button" className={styles.errorDismiss} onClick={clearError}>
                Entendido
              </button>
            </div>
          ) : null}
          <div className={styles.sideCardMuted}>
            <h3 className={styles.sideH}>Calidad de datos</h3>
            <ul className={styles.checks}>
              <li>
                <MaterialIcon name="check_circle" />
                Validación de formatos .csv y .xlsx
              </li>
              <li>
                <MaterialIcon name="check_circle" />
                Procesamiento rápido y eficiente
              </li>
              <li>
                <MaterialIcon name="info" />
                Tras cargar el archivo, siga los pasos de la barra superior
              </li>
            </ul>
          </div>
        </aside>
      </div>
    </WorkspacePage>
  )
}
