import type { NormalizedGroup } from '../api/types'
import styles from './GroupTable.module.css'

interface GroupTableProps {
  group: NormalizedGroup
}

export function GroupTable({ group }: GroupTableProps) {
  return (
    <section className={styles.card}>
      <h2 className={styles.title}>Group {group.name}</h2>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Team</th>
            <th>P</th>
            <th>W</th>
            <th>D</th>
            <th>L</th>
            <th>GD</th>
            <th className={styles.points}>Pts</th>
          </tr>
        </thead>
        <tbody>
          {group.standings.map((row) => (
            <tr key={row.teamId}>
              <td>
                <div className={styles.teamCell}>
                  {row.flag ? (
                    <img src={row.flag} alt="" className={styles.flag} />
                  ) : (
                    <span className={styles.flagPlaceholder} />
                  )}
                  <span>{row.teamName}</span>
                </div>
              </td>
              <td>{row.played}</td>
              <td>{row.won}</td>
              <td>{row.drawn}</td>
              <td>{row.lost}</td>
              <td>{row.goalDiff > 0 ? `+${row.goalDiff}` : row.goalDiff}</td>
              <td className={styles.points}>{row.points}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  )
}
