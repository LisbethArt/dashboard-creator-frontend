import { useMemo, useRef, useState } from 'react'
import { DashboardChartCard } from '../../features/dashboard/DashboardChartCard'
import { WorkspacePage } from '../../layouts/WorkspacePage'
import { MaterialIcon } from '../../components/MaterialIcon'
import { useAnalysisFlow } from '../../context/AnalysisFlowContext'
import styles from './ExportReportScreen.module.css'

/**
 * Export configuration focused on a single deliverable: PDF report.
 */
export function ExportReportScreen() {
  const { uploadId, dashboardWidgets, datasetProfile, activeFileLabel } = useAnalysisFlow()
  const [isExporting, setIsExporting] = useState(false)
  const reportRef = useRef<HTMLDivElement>(null)

  const exportDateLabel = useMemo(
    () =>
      new Date().toLocaleDateString('es-MX', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
      }),
    [],
  )

  const canExport = Boolean(uploadId) && dashboardWidgets.length > 0

  const handleExportPdf = async () => {
    if (!canExport || isExporting || !reportRef.current) {
      return
    }
    setIsExporting(true)
    try {
      const [{ default: html2canvas }, { jsPDF }] = await Promise.all([
        import('html2canvas'),
        import('jspdf'),
      ])
      const canvas = await html2canvas(reportRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff',
      })
      const imageData = canvas.toDataURL('image/png')
      const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' })
      const pageWidth = 210
      const pageHeight = 297
      const margin = 10
      const renderWidth = pageWidth - margin * 2
      const renderHeight = (canvas.height * renderWidth) / canvas.width
      let remaining = renderHeight
      let offsetY = margin

      pdf.addImage(imageData, 'PNG', margin, offsetY, renderWidth, renderHeight, undefined, 'FAST')
      remaining -= pageHeight - margin * 2

      while (remaining > 0) {
        pdf.addPage()
        offsetY = margin - (renderHeight - remaining)
        pdf.addImage(imageData, 'PNG', margin, offsetY, renderWidth, renderHeight, undefined, 'FAST')
        remaining -= pageHeight - margin * 2
      }

      pdf.save(`reporte-dashboard-${new Date().toISOString().slice(0, 10)}.pdf`)
    } catch (error) {
      console.error(error)
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <WorkspacePage
      title="Configuración de exportación"
      description="Exporte su informe ejecutivo en PDF con gráficas e insights generados por IA."
    >
      <div className={styles.grid}>
        <section className={styles.preview}>
          <header className={styles.previewBar}>
            <div className={styles.previewTitle}>
              <MaterialIcon name="visibility" />
              <span>Vista previa del documento</span>
            </div>
            <span className={styles.badge}>Página 1 de 1</span>
          </header>
          <div className={styles.previewDoc}>
            <div className={styles.docPage} ref={reportRef}>
              <div className={styles.reportHead}>
                <div>
                  <p className={styles.docKicker}>Análisis al instante</p>
                  <h2 className={styles.docHeadline}>Informe de Dashboard</h2>
                </div>
                <div className={styles.reportMeta}>
                  <p>
                    <strong>Fecha:</strong> {exportDateLabel}
                  </p>
                  <p>
                    <strong>Archivo:</strong> {activeFileLabel ?? 'Dataset cargado'}
                  </p>
                  {datasetProfile ? (
                    <p>
                      <strong>Registros:</strong> {datasetProfile.row_count.toLocaleString('es-ES')}
                    </p>
                  ) : null}
                </div>
              </div>
              {datasetProfile ? <p className={styles.docLead}>{datasetProfile.ai_hint}</p> : null}
              {canExport ? (
                <div className={styles.reportWidgets}>
                  {dashboardWidgets.map((widget) => (
                    <DashboardChartCard
                      key={widget.id}
                      widgetId={widget.id}
                      uploadId={uploadId as string}
                      suggestion={widget.suggestion}
                      onRemove={() => {}}
                      showRemove={false}
                    />
                  ))}
                </div>
              ) : (
                <div className={styles.emptyReport}>
                  <MaterialIcon name="analytics" />
                  <p>Agregue visualizaciones en Dashboard para habilitar la exportación en PDF.</p>
                </div>
              )}
            </div>
          </div>
        </section>

        <aside className={styles.options}>
          <div className={styles.optionCard}>
            <h3 className={styles.optionTitle}>Formato de salida</h3>
            <div className={styles.formatSingle}>
              <MaterialIcon name="description" />
              <div>
                <p className={styles.formatTitle}>PDF</p>
                <p className={styles.formatDesc}>Documento ejecutivo con visualizaciones e insights IA.</p>
              </div>
            </div>
          </div>

          <div className={styles.optionCard}>
            <h3 className={styles.optionTitle}>Contenido incluido</h3>
            <p className={styles.contentItem}>Resumen ejecutivo del análisis</p>
            <p className={styles.contentItem}>Gráficas seleccionadas en Dashboard</p>
            <p className={styles.contentItem}>Insights generados por IA por visualización</p>
          </div>

          <button
            type="button"
            className={styles.exportBtn}
            onClick={handleExportPdf}
            disabled={!canExport || isExporting}
          >
            <MaterialIcon name="download" />
            {isExporting ? 'Generando PDF...' : 'Exportar Reporte'}
          </button>
        </aside>
      </div>
    </WorkspacePage>
  )
}
