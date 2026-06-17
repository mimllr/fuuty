import type { ApiTeam } from '../api/types'

const TEAM_NAME_FIFA_CODES: Record<string, string> = {
  Algeria: 'ALG',
  Argentina: 'ARG',
  Australia: 'AUS',
  Austria: 'AUT',
  Belgium: 'BEL',
  'Bosnia and Herzegovina': 'BIH',
  Brazil: 'BRA',
  'Cabo Verde': 'CPV',
  Canada: 'CAN',
  Colombia: 'COL',
  'Congo DR': 'COD',
  "Cote d'Ivoire": 'CIV',
  Croatia: 'CRO',
  Curacao: 'CUW',
  Czechia: 'CZE',
  Ecuador: 'ECU',
  Egypt: 'EGY',
  England: 'ENG',
  France: 'FRA',
  Germany: 'GER',
  Ghana: 'GHA',
  Haiti: 'HAI',
  'IR Iran': 'IRN',
  Iraq: 'IRQ',
  Japan: 'JPN',
  Jordan: 'JOR',
  'Korea Republic': 'KOR',
  Mexico: 'MEX',
  Morocco: 'MAR',
  Netherlands: 'NED',
  'New Zealand': 'NZL',
  Norway: 'NOR',
  Panama: 'PAN',
  Paraguay: 'PAR',
  Portugal: 'POR',
  Qatar: 'QAT',
  'Saudi Arabia': 'KSA',
  Scotland: 'SCO',
  Senegal: 'SEN',
  'South Africa': 'RSA',
  Spain: 'ESP',
  Sweden: 'SWE',
  Switzerland: 'SUI',
  Tunisia: 'TUN',
  Turkiye: 'TUR',
  'United States': 'USA',
  Uruguay: 'URU',
  Uzbekistan: 'UZB',
}

export function getDefaultTeamId(teams: Map<string, ApiTeam>): string {
  for (const [id, team] of teams) {
    if (team.fifa_code.toUpperCase() === 'USA') return id
  }
  for (const [id, team] of teams) {
    if (team.name_en === 'United States') return id
  }
  const sorted = [...teams.entries()].sort((a, b) =>
    a[1].name_en.localeCompare(b[1].name_en),
  )
  return sorted[0]?.[0] ?? ''
}

export function getTeamFifaCode(team: ApiTeam): string {
  if (team.fifa_code) return team.fifa_code.toUpperCase()
  if (TEAM_NAME_FIFA_CODES[team.name_en]) {
    return TEAM_NAME_FIFA_CODES[team.name_en]
  }
  if (/^[A-Z]{3}$/.test(team.name_en)) return team.name_en
  return team.name_en.replace(/[^A-Za-z]/g, '').slice(0, 3).toUpperCase() || 'TBD'
}
