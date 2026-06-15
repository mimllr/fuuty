import type { ApiTeam } from '../api/types'
import type { NormalizedMatch } from '../api/types'
import { MatchCard } from './MatchCard'
import styles from './MatchList.module.css'

interface MatchListProps {
  matches: NormalizedMatch[]
  teams: Map<string, ApiTeam>
  focusedStadiumId?: string
  onSelectMatch?: (stadiumId: string) => void
}

export function MatchList({
  matches,
  teams,
  focusedStadiumId,
  onSelectMatch,
}: MatchListProps) {
  if (matches.length === 0) {
    return (
      <p className={styles.empty}>No matches scheduled for this day.</p>
    )
  }

  return (
    <div className={styles.list}>
      {matches.map((match) => (
        <MatchCard
          key={match.id}
          match={match}
          teams={teams}
          isFocused={focusedStadiumId === match.stadiumId}
          onSelect={
            onSelectMatch
              ? () => onSelectMatch(match.stadiumId)
              : undefined
          }
        />
      ))}
    </div>
  )
}
