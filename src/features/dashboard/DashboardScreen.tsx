import { WorkspacePage } from '../../layouts/WorkspacePage'
import { MaterialIcon } from '../../components/MaterialIcon'
import styles from './DashboardScreen.module.css'

/**
 * Executive dashboard (Stitch "Dashboard"): KPI row, chart panels, table.
 */
export function DashboardScreen() {
  return (
    <WorkspacePage
      title="Panel ejecutivo"
      description="Indicadores clave y síntesis generada para el último ciclo."
    >
      <div className={styles.kpis}>
        {[
          { label: 'Ingresos netos', value: '$1.24M', delta: '+8.4%' },
          { label: 'Margen bruto', value: '42.1%', delta: '+1.2pt' },
          { label: 'Churn', value: '1.1%', delta: '-0.3pt vs LM' },
          { label: 'NPS', value: '54', delta: '+6' },
        ].map((k) => (
          <div key={k.label} className={styles.kpi}>
            <p className={styles.kpiLabel}>{k.label}</p>
            <p className={styles.kpiValue}>{k.value}</p>
            <p className={styles.kpiDelta}>{k.delta}</p>
          </div>
        ))}
      </div>

      <div className={styles.panels}>
        <section className={styles.panel}>
          <header className={styles.panelHead}>
            <h2 className={styles.panelTitle}>Tendencia de ingresos</h2>
            <button type="button" className={styles.linkBtn}>
              Exportar PNG
            </button>
          </header>
          <div className={styles.lineChart} aria-hidden>
            <span />
            <span />
            <span />
            <span />
            <span />
            <span />
            <span />
            <span />
          </div>
        </section>
        <section className={styles.panel}>
          <header className={styles.panelHead}>
            <h2 className={styles.panelTitle}>Mix por región</h2>
            <MaterialIcon name="more_horiz" />
          </header>
          <div className={styles.donut}>
            <div className={styles.donutRing} />
            <ul className={styles.legend}>
              <li>
                <span className={styles.dotA} /> NAM 44%
              </li>
              <li>
                <span className={styles.dotB} /> EMEA 31%
              </li>
              <li>
                <span className={styles.dotC} /> LATAM 25%
              </li>
            </ul>
          </div>
        </section>
      </div>

      <section className={styles.tableWrap}>
        <header className={styles.tableHead}>
          <h2 className={styles.panelTitle}>Detalle por cuenta</h2>
          <button type="button" className={styles.linkBtn}>
            Descargar CSV
          </button>
        </header>
        <div className={styles.tableScroll}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Cuenta</th>
                <th>Segmento</th>
                <th>ARR</th>
                <th>Riesgo</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['Acme Robotics', 'Enterprise', '$480k', 'Bajo'],
                ['Northwind', 'Mid-market', '$210k', 'Medio'],
                ['Studio 54', 'Growth', '$96k', 'Bajo'],
              ].map((row) => (
                <tr key={row[0]}>
                  <td>{row[0]}</td>
                  <td>{row[1]}</td>
                  <td>{row[2]}</td>
                  <td>{row[3]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </WorkspacePage>
  )
}
