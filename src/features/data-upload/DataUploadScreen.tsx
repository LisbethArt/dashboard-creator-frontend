import { WorkspacePage } from '../../layouts/WorkspacePage'
import { MaterialIcon } from '../../components/MaterialIcon'
import styles from './DataUploadScreen.module.css'

/**
 * Data upload surface (Stitch "Cargar Datos"): dropzone and format hints.
 */
export function DataUploadScreen() {
  return (
    <WorkspacePage
      title="Subir datos"
      description="Importe sus archivos para que la IA genere análisis estadísticos al instante."
    >
      <div className={styles.grid}>
        <section className={styles.dropzone} aria-label="Zona de carga">
          <div className={styles.dropGlow} aria-hidden />
          <div className={styles.dropIcon}>
            <MaterialIcon name="cloud_upload" className={styles.dropIconGlyph} />
          </div>
          <h2 className={styles.dropTitle}>Arrastra y suelta tus archivos</h2>
          <p className={styles.dropHint}>
            Formatos .csv, .xlsx y .json. Tamaño máximo 100&nbsp;MB.
          </p>
          <button type="button" className={styles.pickBtn}>
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
            <div>
              <p className={styles.formatTitle}>.JSON</p>
              <p className={styles.formatMeta}>APIs y logs</p>
            </div>
          </div>
        </section>
        <aside className={styles.side}>
          <div className={styles.sideCard}>
            <div className={styles.sideHead}>
              <MaterialIcon name="analytics" />
              <span>Análisis activo</span>
            </div>
            <p className={styles.sideTitle}>ventas_q3.csv</p>
            <div className={styles.progress}>
              <span className={styles.progressBar} />
            </div>
            <p className={styles.sideMeta}>Extrayendo esquema… 68%</p>
          </div>
          <div className={styles.sideCardMuted}>
            <h3 className={styles.sideH}>Calidad de datos</h3>
            <ul className={styles.checks}>
              <li>
                <MaterialIcon name="check_circle" /> Sin nulos en columnas clave
              </li>
              <li>
                <MaterialIcon name="check_circle" /> Tipos inferidos correctamente
              </li>
              <li>
                <MaterialIcon name="warning" /> 12 filas duplicadas detectadas
              </li>
            </ul>
          </div>
        </aside>
      </div>
    </WorkspacePage>
  )
}
