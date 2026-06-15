import { format, parse } from 'date-fns'
import { fromZonedTime } from 'date-fns-tz'
import { STADIUM_COORDS } from '../data/stadium-coords'
import type {
  ApiGame,
  ApiGroup,
  ApiStadium,
  ApiTeam,
  MatchStatus,
  NormalizedGroup,
  NormalizedMatch,
  NormalizedStanding,
  WorldCupData,
} from './types'

const API_BASE = 'https://worldcup26.ir'
const FIXTURES_URL =
  'https://www.thestatsapi.com/world-cup/data/fixtures.json'

async function fetchJson<T>(url: string): Promise<T> {
  const response = await fetch(url)
  if (!response.ok) {
    throw new Error(`Failed to fetch ${url}: ${response.status}`)
  }
  return response.json() as Promise<T>
}

function parseScore(value: string | undefined): number | null {
  if (!value || value === 'null') return null
  const parsed = Number.parseInt(value, 10)
  return Number.isNaN(parsed) ? null : parsed
}

function getMatchStatus(game: ApiGame): MatchStatus {
  if (game.finished === 'TRUE') return 'finished'
  if (
    game.time_elapsed &&
    game.time_elapsed !== 'notstarted' &&
    game.time_elapsed !== 'finished'
  ) {
    return 'live'
  }
  return 'upcoming'
}

function parseKickoff(game: ApiGame, stadiumId: string): Date {
  const coords = STADIUM_COORDS[stadiumId]
  const timezone = coords?.timezone ?? 'America/New_York'
  const parsed = parse(game.local_date, 'MM/dd/yyyy HH:mm', new Date())
  return fromZonedTime(parsed, timezone)
}

function getTeamName(
  game: ApiGame,
  side: 'home' | 'away',
  teams: Map<string, ApiTeam>,
): string {
  const id = side === 'home' ? game.home_team_id : game.away_team_id
  const label =
    side === 'home' ? game.home_team_label : game.away_team_label
  const apiName =
    side === 'home' ? game.home_team_name_en : game.away_team_name_en

  if (id && id !== '0' && teams.has(id)) {
    return teams.get(id)!.name_en
  }
  if (apiName) return apiName
  if (label) return label
  return 'TBD'
}

function normalizeGame(
  game: ApiGame,
  stadiums: Map<string, ApiStadium>,
  teams: Map<string, ApiTeam>,
): NormalizedMatch {
  const stadium = stadiums.get(game.stadium_id)
  const coords = STADIUM_COORDS[game.stadium_id]
  const kickoffUtc = parseKickoff(game, game.stadium_id)
  const finished = game.finished === 'TRUE'
  const homeScore = finished || getMatchStatus(game) === 'live'
    ? parseScore(game.home_score)
    : null
  const awayScore = finished || getMatchStatus(game) === 'live'
    ? parseScore(game.away_score)
    : null

  return {
    id: game.id,
    homeTeamId: game.home_team_id,
    awayTeamId: game.away_team_id,
    homeTeamName: getTeamName(game, 'home', teams),
    awayTeamName: getTeamName(game, 'away', teams),
    homeScore,
    awayScore,
    group: game.group,
    type: game.type,
    stadiumId: game.stadium_id,
    stadiumName: stadium?.name_en ?? coords?.name ?? 'Stadium',
    stadiumCity: stadium?.city_en ?? coords?.city ?? '',
    status: getMatchStatus(game),
    timeElapsed: game.time_elapsed,
    kickoffUtc,
    localDateKey: format(kickoffUtc, 'yyyy-MM-dd'),
    homeTeamLabel: game.home_team_label,
    awayTeamLabel: game.away_team_label,
  }
}

function normalizeGroups(
  groups: ApiGroup[],
  teams: Map<string, ApiTeam>,
): NormalizedGroup[] {
  return groups
    .map((group) => {
      const standings: NormalizedStanding[] = group.teams
        .map((standing) => {
          const team = teams.get(standing.team_id)
          return {
            teamId: standing.team_id,
            teamName: team?.name_en ?? `Team ${standing.team_id}`,
            flag: team?.flag ?? '',
            played: Number.parseInt(standing.mp, 10) || 0,
            won: Number.parseInt(standing.w, 10) || 0,
            drawn: Number.parseInt(standing.d, 10) || 0,
            lost: Number.parseInt(standing.l, 10) || 0,
            goalsFor: Number.parseInt(standing.gf, 10) || 0,
            goalsAgainst: Number.parseInt(standing.ga, 10) || 0,
            goalDiff: Number.parseInt(standing.gd, 10) || 0,
            points: Number.parseInt(standing.pts, 10) || 0,
          }
        })
        .sort((a, b) => {
          if (b.points !== a.points) return b.points - a.points
          return b.goalDiff - a.goalDiff
        })

      return { name: group.name, standings }
    })
    .sort((a, b) => a.name.localeCompare(b.name))
}

interface FixturesResponse {
  fixtures: Array<{
    matchNumber: number
    date: string
    kickoffUtc: string
    stage: string
    group?: string
    homeTeam: string
    awayTeam: string
    stadium: string
  }>
}

const STADIUM_NAME_TO_ID: Record<string, string> = Object.fromEntries(
  Object.entries(STADIUM_COORDS).map(([id, coords]) => [coords.name, id]),
)

function findStadiumIdByName(name: string): string {
  if (STADIUM_NAME_TO_ID[name]) return STADIUM_NAME_TO_ID[name]
  const entry = Object.entries(STADIUM_COORDS).find(
    ([, coords]) => name.includes(coords.name) || coords.name.includes(name),
  )
  return entry?.[0] ?? '1'
}

async function fetchFallbackData(): Promise<WorldCupData> {
  const fixtures = await fetchJson<FixturesResponse>(FIXTURES_URL)
  const teams = new Map<string, ApiTeam>()
  const stadiums = new Map<string, ApiStadium>()
  let teamId = 1

  Object.entries(STADIUM_COORDS).forEach(([id, coords]) => {
    stadiums.set(id, {
      id,
      name_en: coords.name,
      city_en: coords.city,
      country_en: '',
    })
  })

  const matches: NormalizedMatch[] = fixtures.fixtures.map((fixture) => {
    const homeKey = fixture.homeTeam
    const awayKey = fixture.awayTeam

    if (!teams.has(homeKey)) {
      teams.set(homeKey, {
        id: String(teamId++),
        name_en: homeKey,
        flag: '',
        fifa_code: '',
        groups: fixture.group ?? '',
      })
    }
    if (!teams.has(awayKey)) {
      teams.set(awayKey, {
        id: String(teamId++),
        name_en: awayKey,
        flag: '',
        fifa_code: '',
        groups: fixture.group ?? '',
      })
    }

    const stadiumId = findStadiumIdByName(fixture.stadium)
    const stadium = stadiums.get(stadiumId)
    const kickoffUtc = new Date(fixture.kickoffUtc)

    return {
      id: String(fixture.matchNumber),
      homeTeamId: homeKey,
      awayTeamId: awayKey,
      homeTeamName: homeKey,
      awayTeamName: awayKey,
      homeScore: null,
      awayScore: null,
      group: fixture.group?.toUpperCase() ?? fixture.stage,
      type: fixture.stage === 'group-stage' ? 'group' : 'r32',
      stadiumId,
      stadiumName: stadium?.name_en ?? fixture.stadium,
      stadiumCity: stadium?.city_en ?? '',
      status: 'upcoming',
      timeElapsed: 'notstarted',
      kickoffUtc,
      localDateKey: format(kickoffUtc, 'yyyy-MM-dd'),
    }
  })

  return {
    matches,
    teams,
    groups: [],
    stadiums,
    source: 'fallback',
  }
}

export async function fetchWorldCupData(): Promise<WorldCupData> {
  try {
    const [gamesRes, groupsRes, teamsRes, stadiumsRes] = await Promise.all([
      fetchJson<{ games: ApiGame[] }>(`${API_BASE}/get/games`),
      fetchJson<{ groups: ApiGroup[] }>(`${API_BASE}/get/groups`),
      fetchJson<{ teams: ApiTeam[] }>(`${API_BASE}/get/teams`),
      fetchJson<{ stadiums: ApiStadium[] }>(`${API_BASE}/get/stadiums`),
    ])

    const teams = new Map(teamsRes.teams.map((team) => [team.id, team]))
    const stadiums = new Map(
      stadiumsRes.stadiums.map((stadium) => [stadium.id, stadium]),
    )

    const matches = gamesRes.games.map((game) =>
      normalizeGame(game, stadiums, teams),
    )

    return {
      matches,
      teams,
      groups: normalizeGroups(groupsRes.groups, teams),
      stadiums,
      source: 'live',
    }
  } catch {
    return fetchFallbackData()
  }
}

export function getMatchesForDate(
  matches: NormalizedMatch[],
  dateKey: string,
): NormalizedMatch[] {
  return matches
    .filter((match) => match.localDateKey === dateKey)
    .sort((a, b) => a.kickoffUtc.getTime() - b.kickoffUtc.getTime())
}

export function getMatchDates(matches: NormalizedMatch[]): string[] {
  const dates = new Set(matches.map((match) => match.localDateKey))
  return Array.from(dates).sort()
}

export function hasLiveMatches(matches: NormalizedMatch[]): boolean {
  return matches.some((match) => match.status === 'live')
}

export function formatKickoffTime(date: Date): string {
  return new Intl.DateTimeFormat(undefined, {
    hour: 'numeric',
    minute: '2-digit',
  }).format(date)
}

export function formatMatchDate(date: Date): string {
  return new Intl.DateTimeFormat(undefined, {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  }).format(date)
}

export function toDateKey(date: Date): string {
  return format(date, 'yyyy-MM-dd')
}

export function parseDateKey(dateKey: string): Date {
  const [year, month, day] = dateKey.split('-').map(Number)
  return new Date(year, month - 1, day)
}
