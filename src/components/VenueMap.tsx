import L from 'leaflet'
import { useEffect, useMemo, useState } from 'react'
import { MapContainer, Marker, TileLayer, useMap } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import type { MatchStatus, NormalizedMatch } from '../api/types'
import { formatKickoffTime } from '../api/worldcup'
import { STADIUM_COORDS } from '../data/stadium-coords'
import styles from './VenueMap.module.css'

export const MAP_HEIGHT = 240
const FOCUS_ZOOM = 10

const MAP_FLY_OPTIONS: L.ZoomPanOptions = {
  duration: 0.9,
  easeLinearity: 0.22,
}

const MAP_FIT_OPTIONS: L.FitBoundsOptions = {
  padding: [24, 24],
  maxZoom: 5,
  duration: 0.9,
  easeLinearity: 0.22,
}

export interface MapViewState {
  mode: 'default' | 'focus'
  stadiumId?: string
  revision: number
}

interface VenueMapProps {
  matches: NormalizedMatch[]
  mapView: MapViewState
  onModalClose: () => void
}

interface VenuePin {
  id: string
  lat: number
  lng: number
  name: string
  city: string
  status: MatchStatus
  matches: NormalizedMatch[]
}

function getVenueStatus(venueMatches: NormalizedMatch[]): MatchStatus {
  if (venueMatches.some((match) => match.status === 'live')) return 'live'
  if (venueMatches.every((match) => match.status === 'finished')) {
    return 'finished'
  }
  return 'upcoming'
}

function createMarkerIcon(status: MatchStatus): L.DivIcon {
  return L.divIcon({
    className: styles.markerHost,
    html: `<div class="${styles.dot} ${styles[`dot_${status}`]}" aria-hidden="true"></div>`,
    iconSize: [22, 22],
    iconAnchor: [11, 11],
  })
}

function fitDefaultBounds(map: L.Map, boundsKey: string) {
  const positions = boundsKey
    .split(',')
    .filter(Boolean)
    .map((id) => {
      const coords = STADIUM_COORDS[id]
      return [coords.lat, coords.lng] as [number, number]
    })

  if (positions.length === 0) return
  if (positions.length === 1) {
    map.flyTo(positions[0], 6, MAP_FLY_OPTIONS)
    return
  }
  map.flyToBounds(positions, MAP_FIT_OPTIONS)
}

function focusStadium(map: L.Map, stadiumId: string) {
  const coords = STADIUM_COORDS[stadiumId]
  if (!coords) return
  map.flyTo([coords.lat, coords.lng], FOCUS_ZOOM, MAP_FLY_OPTIONS)
}

function MapViewController({
  boundsKey,
  mapView,
}: {
  boundsKey: string
  mapView: MapViewState
}) {
  const map = useMap()

  useEffect(() => {
    if (mapView.mode === 'focus' && mapView.stadiumId) {
      focusStadium(map, mapView.stadiumId)
      return
    }

    fitDefaultBounds(map, boundsKey)
  }, [map, boundsKey, mapView.mode, mapView.stadiumId, mapView.revision])

  return null
}

function MatchModalRow({ match }: { match: NormalizedMatch }) {
  const showScore = match.status !== 'upcoming'

  return (
    <div className={styles.modalMatch}>
      <div className={styles.modalTeams}>
        <span className={styles.modalTeamName}>{match.homeTeamName}</span>
        {showScore ? (
          <span className={styles.modalScore}>
            {match.homeScore ?? 0} – {match.awayScore ?? 0}
          </span>
        ) : (
          <span className={styles.modalVs}>vs</span>
        )}
        <span className={styles.modalTeamName}>{match.awayTeamName}</span>
      </div>
      <div className={styles.modalMeta}>
        {match.status === 'live' && (
          <span className={styles.modalLive}>
            Live {match.timeElapsed !== 'finished' ? match.timeElapsed : ''}
          </span>
        )}
        {match.status === 'finished' && (
          <span className={styles.modalFinal}>Final</span>
        )}
        {match.status === 'upcoming' && (
          <span>{formatKickoffTime(match.kickoffUtc)}</span>
        )}
      </div>
    </div>
  )
}

function VenueModal({
  venue,
  onClose,
}: {
  venue: VenuePin
  onClose: () => void
}) {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleKeyDown)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = ''
    }
  }, [onClose])

  return (
    <div
      className={styles.modalOverlay}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="venue-modal-title"
    >
      <div className={styles.modal} onClick={(event) => event.stopPropagation()}>
        <button
          type="button"
          className={styles.modalClose}
          onClick={onClose}
          aria-label="Close"
        >
          ×
        </button>

        <header className={styles.modalHeader}>
          <h2 id="venue-modal-title" className={styles.modalTitle}>
            {venue.name}
          </h2>
          <p className={styles.modalCity}>{venue.city}</p>
        </header>

        <div className={styles.modalBody}>
          {venue.matches.map((match) => (
            <MatchModalRow key={match.id} match={match} />
          ))}
        </div>
      </div>
    </div>
  )
}

export function VenueMap({ matches, mapView, onModalClose }: VenueMapProps) {
  const [selectedVenueId, setSelectedVenueId] = useState<string | null>(null)

  const venues = useMemo(() => {
    const byStadium = new Map<string, NormalizedMatch[]>()

    for (const match of matches) {
      const existing = byStadium.get(match.stadiumId) ?? []
      existing.push(match)
      byStadium.set(match.stadiumId, existing)
    }

    const result: VenuePin[] = []

    for (const [stadiumId, venueMatches] of byStadium) {
      const coords = STADIUM_COORDS[stadiumId]
      if (!coords) continue

      const sorted = [...venueMatches].sort(
        (a, b) => a.kickoffUtc.getTime() - b.kickoffUtc.getTime(),
      )

      result.push({
        id: stadiumId,
        lat: coords.lat,
        lng: coords.lng,
        name: coords.name,
        city: coords.city,
        status: getVenueStatus(sorted),
        matches: sorted,
      })
    }

    return result
  }, [matches])

  const boundsKey = venues
    .map((venue) => venue.id)
    .sort()
    .join(',')

  const selectedVenue =
    venues.find((venue) => venue.id === selectedVenueId) ?? null

  const handleModalClose = () => {
    setSelectedVenueId(null)
    onModalClose()
  }

  if (venues.length === 0) {
    return (
      <div
        className={styles.empty}
        style={{ height: MAP_HEIGHT }}
        aria-label="No matches on map"
      >
        No matches on this day
      </div>
    )
  }

  return (
    <>
      <div className={styles.mapWrap}>
        <MapContainer
          center={[39.8, -98.5]}
          zoom={4}
          scrollWheelZoom
          dragging
          touchZoom
          doubleClickZoom
          className={styles.map}
          style={{ height: MAP_HEIGHT }}
          attributionControl={false}
        >
          <TileLayer url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png" />
          <MapViewController boundsKey={boundsKey} mapView={mapView} />
          {venues.map((venue) => (
            <Marker
              key={venue.id}
              position={[venue.lat, venue.lng]}
              icon={createMarkerIcon(venue.status)}
              eventHandlers={{
                click: () => setSelectedVenueId(venue.id),
              }}
            />
          ))}
        </MapContainer>
      </div>

      {selectedVenue && (
        <VenueModal venue={selectedVenue} onClose={handleModalClose} />
      )}
    </>
  )
}
