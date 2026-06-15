export type MatchType =
  | 'group'
  | 'r32'
  | 'r16'
  | 'qf'
  | 'sf'
  | 'third'
  | 'final'

export interface ApiGame {
  id: string
  home_team_id: string
  away_team_id: string
  home_score: string
  away_score: string
  home_scorers?: string
  away_scorers?: string
  group: string
  matchday: string
  local_date: string
  stadium_id: string
  finished: string
  time_elapsed: string
  type: MatchType
  home_team_name_en?: string
  away_team_name_en?: string
  home_team_label?: string
  away_team_label?: string
}

export interface ApiTeam {
  id: string
  name_en: string
  flag: string
  fifa_code: string
  groups: string
}

export interface ApiGroupStanding {
  team_id: string
  mp: string
  w: string
  l: string
  d: string
  pts: string
  gf: string
  ga: string
  gd: string
}

export interface ApiGroup {
  name: string
  teams: ApiGroupStanding[]
}

export interface ApiStadium {
  id: string
  name_en: string
  city_en: string
  country_en: string
}

export type MatchStatus = 'upcoming' | 'live' | 'finished'

export interface NormalizedMatch {
  id: string
  homeTeamId: string
  awayTeamId: string
  homeTeamName: string
  awayTeamName: string
  homeScore: number | null
  awayScore: number | null
  group: string
  type: MatchType
  stadiumId: string
  stadiumName: string
  stadiumCity: string
  status: MatchStatus
  timeElapsed: string
  kickoffUtc: Date
  localDateKey: string
  homeTeamLabel?: string
  awayTeamLabel?: string
}

export interface NormalizedStanding {
  teamId: string
  teamName: string
  flag: string
  played: number
  won: number
  drawn: number
  lost: number
  goalsFor: number
  goalsAgainst: number
  goalDiff: number
  points: number
}

export interface NormalizedGroup {
  name: string
  standings: NormalizedStanding[]
}

export interface WorldCupData {
  matches: NormalizedMatch[]
  teams: Map<string, ApiTeam>
  groups: NormalizedGroup[]
  stadiums: Map<string, ApiStadium>
  source: 'live' | 'fallback'
}

export const TOURNAMENT_START = new Date(2026, 5, 11)
export const TOURNAMENT_END = new Date(2026, 6, 19)

export const KNOCKOUT_ROUND_LABELS: Record<MatchType, string> = {
  group: 'Group Stage',
  r32: 'Round of 32',
  r16: 'Round of 16',
  qf: 'Quarterfinals',
  sf: 'Semifinals',
  third: 'Third Place',
  final: 'Final',
}

export const KNOCKOUT_ORDER: MatchType[] = [
  'r32',
  'r16',
  'qf',
  'sf',
  'third',
  'final',
]
