import { WorkspacePage } from '../../layouts/WorkspacePage'
import { MaterialIcon } from '../../components/MaterialIcon'
import styles from './AiSuggestionsScreen.module.css'

const CARDS = [
  {
    tag: 'Finanzas',
    time: 'Actualizado hace 2h',
    title: 'Tendencia de ingresos trimestrales',
    insight:
      'La serie muestra estacionalidad estable con un repunte anticipado para el próximo cierre.',
  },
  {
    tag: 'Operaciones',
    time: 'Actualizado hace 5h',
    title: 'Cuellos de botella en fulfillment',
    insight:
      'Picos de latencia correlacionan con el turno nocturno; revisar staffing al 80% del SLA.',
  },
  {
    tag: 'Clientes',
    time: 'Actualizado ayer',
    title: 'Segmento enterprise en expansión',
    insight:
      'El cohort con más de 50 empleados aumentó retención un 6.2% interanual.',
  },
] as const

/**
 * AI suggestions feed (Stitch "Sugerencias de IA").
 */
export function AiSuggestionsScreen() {
  return (
    <WorkspacePage
      title="Análisis sugeridos"
      description="Hallazgos recientes basados en la actividad de sus datos."
      toolbar={
        <div className={styles.toggle} role="group" aria-label="Ordenar sugerencias">
          <button type="button" className={styles.toggleActive}>
            Recientes
          </button>
          <button type="button" className={styles.toggleIdle}>
            Populares
          </button>
        </div>
      }
    >
      <p className={styles.kicker}>Sugerencias del motor AI</p>

      <div className={styles.feed}>
        {CARDS.map((card) => (
          <article key={card.title} className={styles.card}>
            <div className={styles.cardTop}>
              <span className={styles.badge}>{card.tag}</span>
              <span className={styles.time}>{card.time}</span>
            </div>
            <h2 className={styles.cardTitle}>{card.title}</h2>
            <div className={styles.insight}>
              <MaterialIcon name="lightbulb" />
              <p>{card.insight}</p>
            </div>
            <div className={styles.spark} aria-hidden>
              <span />
              <span />
              <span />
              <span />
              <span />
              <span />
            </div>
            <div className={styles.actions}>
              <button type="button" className={styles.ghost}>
                Ver detalle
              </button>
              <button type="button" className={styles.primary}>
                Aplicar al tablero
              </button>
            </div>
          </article>
        ))}
      </div>
    </WorkspacePage>
  )
}
