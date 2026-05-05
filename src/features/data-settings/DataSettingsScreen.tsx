import { WorkspacePage } from '../../layouts/WorkspacePage'
import { MaterialIcon } from '../../components/MaterialIcon'
import styles from './DataSettingsScreen.module.css'

const COLUMNS = [
  { name: 'order_id', type: 'string', role: 'ID transaccional' },
  { name: 'amount_usd', type: 'number', role: 'Métrica continua' },
  { name: 'created_at', type: 'datetime', role: 'Eje temporal' },
  { name: 'region', type: 'category', role: 'Dimensión' },
] as const

/**
 * Column typing and schema preview (Stitch "Configuración de Datos").
 */
export function DataSettingsScreen() {
  return (
    <WorkspacePage
      title="Configuración de DataFrame"
      description="Previsualice y ajuste los tipos antes del procesamiento final."
      toolbar={
        <>
          <button type="button" className={styles.secondary}>
            <MaterialIcon name="refresh" />
            Revertir cambios
          </button>
          <button type="button" className={styles.primary}>
            <MaterialIcon name="save" />
            Confirmar estructura
          </button>
        </>
      }
    >
      <div className={styles.layout}>
        <section className={styles.preview}>
          <header className={styles.previewHead}>
            <h2 className={styles.previewTitle}>Vista previa (100 filas)</h2>
            <span className={styles.chip}>Dataset: ventas_q3.csv</span>
          </header>
          <div className={styles.previewBody}>
            <table className={styles.miniTable}>
              <thead>
                <tr>
                  {COLUMNS.map((c) => (
                    <th key={c.name}>{c.name}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>SO-10923</td>
                  <td>1,240.50</td>
                  <td>2025-09-12</td>
                  <td>NAM</td>
                </tr>
                <tr>
                  <td>SO-10924</td>
                  <td>880.00</td>
                  <td>2025-09-12</td>
                  <td>EMEA</td>
                </tr>
                <tr>
                  <td>SO-10925</td>
                  <td>2,015.10</td>
                  <td>2025-09-13</td>
                  <td>LATAM</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section className={styles.columns}>
          <h2 className={styles.columnsTitle}>Columnas inferidas</h2>
          <ul className={styles.columnList}>
            {COLUMNS.map((col) => (
              <li key={col.name} className={styles.columnItem}>
                <div>
                  <p className={styles.columnName}>{col.name}</p>
                  <p className={styles.columnRole}>{col.role}</p>
                </div>
                <label className={styles.selectWrap}>
                  <span className={styles.visuallyHidden}>Tipo para {col.name}</span>
                  <select className={styles.select} defaultValue={col.type}>
                    <option value="string">string</option>
                    <option value="number">number</option>
                    <option value="datetime">datetime</option>
                    <option value="category">category</option>
                  </select>
                </label>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </WorkspacePage>
  )
}
