import { addDays, isAfter, isBefore } from 'date-fns'
import {
  formatMatchDate,
  parseDateKey,
  toDateKey,
} from '../api/worldcup'
import { TOURNAMENT_END, TOURNAMENT_START } from '../api/types'
import styles from './DateNavigator.module.css'

interface DateNavigatorProps {
  selectedDateKey: string
  matchDates: string[]
  onDateChange: (dateKey: string) => void
}

function clampDate(date: Date): Date {
  if (isBefore(date, TOURNAMENT_START)) return TOURNAMENT_START
  if (isAfter(date, TOURNAMENT_END)) return TOURNAMENT_END
  return date
}

function findNearestMatchDate(
  dateKey: string,
  matchDates: string[],
  direction: -1 | 1,
): string | null {
  const sorted = [...matchDates].sort()
  if (direction === -1) {
    const prior = [...sorted].reverse().find((key) => key < dateKey)
    return prior ?? null
  }
  const next = sorted.find((key) => key > dateKey)
  return next ?? null
}

export function DateNavigator({
  selectedDateKey,
  matchDates,
  onDateChange,
}: DateNavigatorProps) {
  const selectedDate = parseDateKey(selectedDateKey)
  const displayDate = formatMatchDate(selectedDate)

  const goBack = () => {
    const prev = addDays(selectedDate, -1)
    const clamped = clampDate(prev)
    const key = toDateKey(clamped)
    if (matchDates.includes(key)) {
      onDateChange(key)
      return
    }
    const nearest = findNearestMatchDate(key, matchDates, -1)
    onDateChange(nearest ?? toDateKey(clampDate(prev)))
  }

  const goForward = () => {
    const next = addDays(selectedDate, 1)
    const clamped = clampDate(next)
    const key = toDateKey(clamped)
    if (matchDates.includes(key)) {
      onDateChange(key)
      return
    }
    const nearest = findNearestMatchDate(key, matchDates, 1)
    onDateChange(nearest ?? toDateKey(clampDate(next)))
  }

  const atStart = isBefore(addDays(selectedDate, -1), TOURNAMENT_START)
  const atEnd = isAfter(addDays(selectedDate, 1), TOURNAMENT_END)

  return (
    <div className={styles.navigator}>
      <button
        type="button"
        className={styles.arrow}
        onClick={goBack}
        disabled={atStart}
        aria-label="Previous day"
      >
        ‹
      </button>
      <div className={styles.date}>{displayDate}</div>
      <button
        type="button"
        className={styles.arrow}
        onClick={goForward}
        disabled={atEnd}
        aria-label="Next day"
      >
        ›
      </button>
    </div>
  )
}
