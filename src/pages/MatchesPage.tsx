import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import {
  getMatchesForDate,
  getMatchDates,
  toDateKey,
} from '../api/worldcup'
import { DateNavigator } from '../components/DateNavigator'
import { LoadingSkeleton } from '../components/LoadingSkeleton'
import { MatchList } from '../components/MatchList'
import { type MapViewState, VenueMap } from '../components/VenueMap'
import { useWorldCupData } from '../hooks/useWorldCupData'
import styles from './MatchesPage.module.css'

function resolveDateKey(selected: string, matchDates: string[]): string {
  if (matchDates.length === 0) return selected
  if (matchDates.includes(selected)) return selected
  const today = toDateKey(new Date())
  if (matchDates.includes(today)) return today
  return matchDates.find((key) => key >= today) ?? matchDates.at(-1) ?? selected
}

const defaultMapView = (): MapViewState => ({
  mode: 'default',
  revision: 0,
})

export function MatchesPage() {
  const { data, isLoading, isError } = useWorldCupData()
  const matchDates = useMemo(
    () => (data ? getMatchDates(data.matches) : []),
    [data],
  )

  const [selectedDateKey, setSelectedDateKey] = useState(() =>
    toDateKey(new Date()),
  )
  const [mapView, setMapView] = useState<MapViewState>(defaultMapView)
  const mapViewRef = useRef(mapView)

  useEffect(() => {
    mapViewRef.current = mapView
  }, [mapView])

  const activeDateKey = useMemo(
    () => resolveDateKey(selectedDateKey, matchDates),
    [selectedDateKey, matchDates],
  )

  const resetMapView = useCallback(() => {
    setMapView((current) =>
      current.mode === 'default'
        ? current
        : { mode: 'default', revision: current.revision + 1 },
    )
  }, [])

  const focusStadium = useCallback((stadiumId: string) => {
    setMapView((current) => ({
      mode: 'focus',
      stadiumId,
      revision: current.revision + 1,
    }))
  }, [])

  const handleDateChange = useCallback((dateKey: string) => {
    setSelectedDateKey(dateKey)
    setMapView((current) => ({
      mode: 'default',
      revision: current.revision + 1,
    }))
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      if (mapViewRef.current.mode === 'focus') {
        setMapView((current) => ({
          mode: 'default',
          revision: current.revision + 1,
        }))
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

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
        <p>Unable to load match data. Please try again later.</p>
      </main>
    )
  }

  const dayMatches = getMatchesForDate(data.matches, activeDateKey)
  const focusedStadiumId =
    mapView.mode === 'focus' ? mapView.stadiumId : undefined

  return (
    <main className={`page ${styles.page}`}>
      <h1 className="page-header">World Cup Matches</h1>

      {data.source === 'fallback' && (
        <div className="banner" role="status">
          Live scores unavailable — showing schedule.
        </div>
      )}

      <section className={styles.stickyMapSection} aria-label="Match map">
        <DateNavigator
          selectedDateKey={activeDateKey}
          matchDates={matchDates}
          onDateChange={handleDateChange}
        />
        <VenueMap
          matches={dayMatches}
          mapView={mapView}
          onModalClose={resetMapView}
        />
      </section>

      <section className={styles.scoreboard} aria-label="Match list">
        <MatchList
          matches={dayMatches}
          teams={data.teams}
          focusedStadiumId={focusedStadiumId}
          onSelectMatch={focusStadium}
        />
      </section>
    </main>
  )
}
