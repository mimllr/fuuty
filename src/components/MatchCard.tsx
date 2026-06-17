import type { ApiTeam } from '../api/types'
import { formatKickoffTime, formatMatchDateShort } from '../api/worldcup'
import type { NormalizedMatch } from '../api/types'
import styles from './MatchCard.module.css'

interface MatchCardProps {
  match: NormalizedMatch
  teams: Map<string, ApiTeam>
  isFocused?: boolean
  onSelect?: () => void
  showDate?: boolean
}

function getFlag(
  teamId: string,
  teamName: string,
  teams: Map<string, ApiTeam>,
): string | undefined {
  if (teamId && teamId !== '0' && teams.has(teamId)) {
    return teams.get(teamId)?.flag
  }
  const byName = [...teams.values()].find((team) => team.name_en === teamName)
  return byName?.flag
}

function isPlaceholder(name: string, label?: string): boolean {
  return Boolean(label) || name === 'TBD' || name.startsWith('Winner') || name.startsWith('Runner') || name.startsWith('Loser') || name.startsWith('3rd')
}

function StatusBadge({
  match,
  showDate = false,
}: {
  match: NormalizedMatch
  showDate?: boolean
}) {
  const datePrefix = showDate
    ? `${formatMatchDateShort(match.kickoffUtc)} · `
    : ''

  if (match.status === 'live') {
    const minute =
      match.timeElapsed && match.timeElapsed !== 'finished'
        ? match.timeElapsed
        : 'Live'
    return (
      <span className={`${styles.badge} ${styles.live}`}>
        {datePrefix}Live {minute}
      </span>
    )
  }
  if (match.status === 'finished') {
    return <span className={styles.badge}>{datePrefix}Final</span>
  }
  return (
    <span className={styles.badge}>
      {datePrefix}
      {formatKickoffTime(match.kickoffUtc)}
    </span>
  )
}

export function MatchCard({
  match,
  teams,
  isFocused = false,
  onSelect,
  showDate = false,
}: MatchCardProps) {
  const homeFlag = getFlag(match.homeTeamId, match.homeTeamName, teams)
  const awayFlag = getFlag(match.awayTeamId, match.awayTeamName, teams)
  const showScore = match.status !== 'upcoming'
  const homePlaceholder = isPlaceholder(
    match.homeTeamName,
    match.homeTeamLabel,
  )
  const awayPlaceholder = isPlaceholder(
    match.awayTeamName,
    match.awayTeamLabel,
  )

  return (
    <article
      className={
        isFocused
          ? `${styles.card} ${styles.cardFocused}`
          : styles.card
      }
      onClick={onSelect}
      onKeyDown={
        onSelect
          ? (event) => {
              if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault()
                onSelect()
              }
            }
          : undefined
      }
      role={onSelect ? 'button' : undefined}
      tabIndex={onSelect ? 0 : undefined}
    >
      <div className={styles.header}>
        <StatusBadge match={match} showDate={showDate} />
        {match.type !== 'group' && (
          <span className={styles.stage}>{match.group}</span>
        )}
      </div>

      <div className={styles.teams}>
        <div className={styles.team}>
          {homeFlag ? (
            <img src={homeFlag} alt="" className={styles.flag} />
          ) : (
            <span className={styles.flagPlaceholder} />
          )}
          <span
            className={
              homePlaceholder ? `${styles.teamName} ${styles.placeholder}` : styles.teamName
            }
          >
            {match.homeTeamName}
          </span>
          {showScore && (
            <span className={styles.score}>{match.homeScore ?? 0}</span>
          )}
        </div>

        <div className={styles.team}>
          {awayFlag ? (
            <img src={awayFlag} alt="" className={styles.flag} />
          ) : (
            <span className={styles.flagPlaceholder} />
          )}
          <span
            className={
              awayPlaceholder ? `${styles.teamName} ${styles.placeholder}` : styles.teamName
            }
          >
            {match.awayTeamName}
          </span>
          {showScore && (
            <span className={styles.score}>{match.awayScore ?? 0}</span>
          )}
        </div>
      </div>

      <p className={styles.venue}>
        {match.stadiumName}
        {match.stadiumCity ? ` · ${match.stadiumCity}` : ''}
      </p>
    </article>
  )
}
