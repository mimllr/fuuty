import type { ApiTeam } from '../api/types'
import type { NormalizedMatch } from '../api/types'
import { MatchCard } from './MatchCard'
import styles from './MatchList.module.css'

interface MatchListProps {
  matches: NormalizedMatch[]
  teams: Map<string, ApiTeam>
  focusedStadiumId?: string
  onSelectMatch?: (stadiumId: string) => void
  showDate?: boolean
  emptyMessage?: string
}

export function MatchList({
  matches,
  teams,
  focusedStadiumId,
  onSelectMatch,
  showDate = false,
  emptyMessage = 'No matches scheduled for this day.',
}: MatchListProps) {
  if (matches.length === 0) {
    return <p className={styles.empty}>{emptyMessage}</p>
  }

  return (
    <div className={styles.list}>
      {matches.map((match) => (
        <MatchCard
          key={match.id}
          match={match}
          teams={teams}
          isFocused={focusedStadiumId === match.stadiumId}
          showDate={showDate}
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
