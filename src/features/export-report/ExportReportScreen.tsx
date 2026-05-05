import { WorkspacePage } from '../../layouts/WorkspacePage'
import { MaterialIcon } from '../../components/MaterialIcon'
import styles from './ExportReportScreen.module.css'

/**
 * Export configuration (Stitch "Exportar Reporte").
 */
export function ExportReportScreen() {
  return (
    <WorkspacePage
      title="Configuración de exportación"
      description="Personalice la estructura y el contenido de su informe ejecutivo."
    >
      <nav className={styles.breadcrumb} aria-label="Migas">
        <span>Proyectos</span>
        <MaterialIcon name="chevron_right" className={styles.crumbIcon} />
        <span>Q4 market analysis</span>
        <MaterialIcon name="chevron_right" className={styles.crumbIcon} />
        <span className={styles.crumbActive}>Exportar reporte</span>
      </nav>

      <div className={styles.grid}>
        <section className={styles.preview}>
          <header className={styles.previewBar}>
            <div className={styles.previewTitle}>
              <MaterialIcon name="visibility" />
              <span>Vista previa ejecutiva</span>
            </div>
            <span className={styles.badge}>PDF · A4</span>
          </header>
          <div className={styles.previewDoc}>
            <div className={styles.docPage}>
              <p className={styles.docKicker}>Análisis al instante</p>
              <h2 className={styles.docHeadline}>Informe trimestral</h2>
              <p className={styles.docLead}>
                Resumen de KPIs, riesgos y oportunidades detectadas por el modelo.
              </p>
              <div className={styles.docBlocks}>
                <div className={styles.docBlock} />
                <div className={styles.docBlock} />
                <div className={styles.docBlockShort} />
              </div>
            </div>
          </div>
        </section>

        <aside className={styles.options}>
          <div className={styles.optionCard}>
            <h3 className={styles.optionTitle}>Formato</h3>
            <div className={styles.radios}>
              <label className={styles.radio}>
                <input type="radio" name="fmt" defaultChecked /> PDF presentación
              </label>
              <label className={styles.radio}>
                <input type="radio" name="fmt" /> Excel analítico
              </label>
              <label className={styles.radio}>
                <input type="radio" name="fmt" /> Paquete ZIP (datos + gráficos)
              </label>
            </div>
          </div>

          <div className={styles.optionCard}>
            <h3 className={styles.optionTitle}>Contenido</h3>
            <label className={styles.check}>
              <input type="checkbox" defaultChecked /> Portada y resumen ejecutivo
            </label>
            <label className={styles.check}>
              <input type="checkbox" defaultChecked /> Anexos con tablas fuente
            </label>
            <label className={styles.check}>
              <input type="checkbox" /> Narrativa ampliada del modelo
            </label>
          </div>

          <button type="button" className={styles.exportBtn}>
            <MaterialIcon name="download" />
            Generar paquete
          </button>
        </aside>
      </div>
    </WorkspacePage>
  )
}
