import { useState } from 'react'
import { GroupTable } from '../components/GroupTable'
import { KnockoutBracket } from '../components/KnockoutBracket'
import { LoadingSkeleton } from '../components/LoadingSkeleton'
import { useWorldCupData } from '../hooks/useWorldCupData'
import styles from './StandingsPage.module.css'

type StandingsTab = 'groups' | 'bracket'

export function StandingsPage() {
  const { data, isLoading, isError } = useWorldCupData()
  const [tab, setTab] = useState<StandingsTab>('groups')

  if (isLoading) {
    return (
      <main className="page">
        <LoadingSkeleton />
      </main>
    )
  }

  if (isError || !data) {
    return (
      <main className="page">
        <p>Unable to load standings. Please try again later.</p>
      </main>
    )
  }

  return (
    <main className="page">
      <h1 className="page-header">Standings</h1>

      {data.source === 'fallback' && (
        <div className="banner" role="status">
          Live scores unavailable — showing schedule.
        </div>
      )}

      <div className={styles.tabs} role="tablist" aria-label="Standings view">
        <button
          type="button"
          role="tab"
          aria-selected={tab === 'groups'}
          className={tab === 'groups' ? `${styles.tab} ${styles.active}` : styles.tab}
          onClick={() => setTab('groups')}
        >
          Groups
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={tab === 'bracket'}
          className={tab === 'bracket' ? `${styles.tab} ${styles.active}` : styles.tab}
          onClick={() => setTab('bracket')}
        >
          Bracket
        </button>
      </div>

      {tab === 'groups' ? (
        data.groups.length > 0 ? (
          <div className={styles.groups}>
            {data.groups.map((group) => (
              <GroupTable key={group.name} group={group} />
            ))}
          </div>
        ) : (
          <p className={styles.empty}>Group standings are not available right now.</p>
        )
      ) : (
        <KnockoutBracket matches={data.matches} />
      )}
    </main>
  )
}
