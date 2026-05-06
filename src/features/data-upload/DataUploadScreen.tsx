import { useCallback, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { MaterialIcon } from '../../components/MaterialIcon'
import { useAnalysisFlow } from '../../context/AnalysisFlowContext'
import { WorkspacePage } from '../../layouts/WorkspacePage'
import styles from './DataUploadScreen.module.css'

const ACCEPT = '.csv,.xlsx,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,text/csv'

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

/**
 * Spreadsheet upload workspace with drag-and-drop and AI analysis orchestration.
 *
 * @remarks Visible strings use Spanish for end users.
 */
export function DataUploadScreen() {
  const inputRef = useRef<HTMLInputElement>(null)
  const [dragOver, setDragOver] = useState(false)
  const { isAnalyzing, analysisProgress, activeFileLabel, lastError, clearError, runAnalysis } =
    useAnalysisFlow()

  const ingest = useCallback(
    (file: File | null) => {
      if (!file || isAnalyzing) {
        return
      }
      void runAnalysis(file)
    },
    [isAnalyzing, runAnalysis],
  )

  return (
    <WorkspacePage
      title="Subir datos"
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
            ingest(pickFirstFile(e.dataTransfer.files))
          }}
        >
          <input
            ref={inputRef}
            type="file"
            accept={ACCEPT}
            className={styles.fileInput}
            aria-label="Seleccionar archivo CSV o Excel"
            onChange={(e) => {
              ingest(pickFirstFile(e.target.files))
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
                  ? 'Subiendo el archivo al servidor (porcentaje real según bytes enviados).'
                  : 'Archivo recibido. Perfilando datos, Gemini y persistencia en Supabase…'
                : 'Suba un archivo para iniciar el flujo automático.'}
            </p>
          </div>
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
                Procesamiento en el servidor (sin exponer su API key)
              </li>
              <li>
                <MaterialIcon name="info" />
                ¿Necesita ayuda? Visite las{' '}
                <Link className={styles.inlineLink} to="/ai-suggestions">
                  sugerencias
                </Link>{' '}
                tras cargar un archivo.
              </li>
            </ul>
          </div>
        </aside>
      </div>
    </WorkspacePage>
  )
}
