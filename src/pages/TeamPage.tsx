import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { getMatchesForTeam } from '../api/worldcup'
import { LoadingSkeleton } from '../components/LoadingSkeleton'
import { MatchList } from '../components/MatchList'
import { TeamPicker } from '../components/TeamPicker'
import { type MapViewState, VenueMap } from '../components/VenueMap'
import { useTeamSelection } from '../context/TeamSelectionContext'
import { useWorldCupData } from '../hooks/useWorldCupData'
import styles from './TeamPage.module.css'

const defaultMapView = (): MapViewState => ({
  mode: 'default',
  revision: 0,
})

export function TeamPage() {
  const { data, isLoading, isError } = useWorldCupData()
  const { selectedTeamId, setSelectedTeamId } = useTeamSelection()
  const teamOptions = useMemo(() => {
    if (!data) return []
    return [...data.teams.entries()]
      .map(([id, team]) => ({ id, team }))
      .sort((a, b) => a.team.name_en.localeCompare(b.team.name_en))
  }, [data])

  const [mapView, setMapView] = useState<MapViewState>(defaultMapView)
  const mapViewRef = useRef(mapView)

  useEffect(() => {
    mapViewRef.current = mapView
  }, [mapView])

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

  const handleTeamChange = useCallback(
    (teamId: string) => {
      setSelectedTeamId(teamId)
      setMapView((current) => ({
        mode: 'default',
        revision: current.revision + 1,
      }))
    },
    [setSelectedTeamId],
  )

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
        <p>Unable to load team data. Please try again later.</p>
      </main>
    )
  }

  const teamMatches = selectedTeamId
    ? getMatchesForTeam(data.matches, selectedTeamId)
    : []
  const focusedStadiumId =
    mapView.mode === 'focus' ? mapView.stadiumId : undefined

  return (
    <main className={`page ${styles.page}`}>
      <h1 className="page-header">Team</h1>

      {data.source === 'fallback' && (
        <div className="banner" role="status">
          Live scores unavailable — showing schedule.
        </div>
      )}

      <section className={styles.stickyMapSection} aria-label="Team match map">
        <TeamPicker
          teams={teamOptions}
          selectedTeamId={selectedTeamId}
          onTeamChange={handleTeamChange}
        />
        <VenueMap
          matches={teamMatches}
          mapView={mapView}
          onModalClose={resetMapView}
        />
      </section>

      <section className={styles.scoreboard} aria-label="Team match list">
        <MatchList
          matches={teamMatches}
          teams={data.teams}
          focusedStadiumId={focusedStadiumId}
          onSelectMatch={focusStadium}
          showDate
          emptyMessage="No matches scheduled for this team."
        />
      </section>
    </main>
  )
}
