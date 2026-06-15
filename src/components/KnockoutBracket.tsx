import {
  KNOCKOUT_ORDER,
  KNOCKOUT_ROUND_LABELS,
  type MatchType,
  type NormalizedMatch,
} from '../api/types'
import { formatKickoffTime } from '../api/worldcup'
import styles from './KnockoutBracket.module.css'

interface KnockoutBracketProps {
  matches: NormalizedMatch[]
}

function isPlaceholderName(name: string, label?: string): boolean {
  return (
    Boolean(label) ||
    name === 'TBD' ||
    name.startsWith('Winner') ||
    name.startsWith('Runner') ||
    name.startsWith('Loser') ||
    name.startsWith('3rd')
  )
}

function BracketMatch({ match }: { match: NormalizedMatch }) {
  const homePlaceholder = isPlaceholderName(
    match.homeTeamName,
    match.homeTeamLabel,
  )
  const awayPlaceholder = isPlaceholderName(
    match.awayTeamName,
    match.awayTeamLabel,
  )
  const showScore = match.status !== 'upcoming'

  return (
    <div className={styles.match}>
      <div className={styles.row}>
        <span
          className={
            homePlaceholder ? `${styles.team} ${styles.placeholder}` : styles.team
          }
        >
          {match.homeTeamName}
        </span>
        {showScore && (
          <span className={styles.score}>{match.homeScore ?? 0}</span>
        )}
      </div>
      <div className={styles.row}>
        <span
          className={
            awayPlaceholder ? `${styles.team} ${styles.placeholder}` : styles.team
          }
        >
          {match.awayTeamName}
        </span>
        {showScore && (
          <span className={styles.score}>{match.awayScore ?? 0}</span>
        )}
      </div>
      <div className={styles.meta}>
        {formatKickoffTime(match.kickoffUtc)} · {match.stadiumCity}
      </div>
    </div>
  )
}

export function KnockoutBracket({ matches }: KnockoutBracketProps) {
  const knockoutMatches = matches.filter((match) => match.type !== 'group')

  if (knockoutMatches.length === 0) {
    return (
      <p className={styles.empty}>
        Knockout bracket will appear once the group stage ends.
      </p>
    )
  }

  return (
    <div className={styles.bracket}>
      {KNOCKOUT_ORDER.map((round) => {
        const roundMatches = knockoutMatches
          .filter((match) => match.type === round)
          .sort((a, b) => a.kickoffUtc.getTime() - b.kickoffUtc.getTime())

        if (roundMatches.length === 0) return null

        return (
          <section key={round} className={styles.round}>
            <h3 className={styles.roundTitle}>
              {KNOCKOUT_ROUND_LABELS[round as MatchType]}
            </h3>
            <div className={styles.matches}>
              {roundMatches.map((match) => (
                <BracketMatch key={match.id} match={match} />
              ))}
            </div>
          </section>
        )
      })}
    </div>
  )
}
