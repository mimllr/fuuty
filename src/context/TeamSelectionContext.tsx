import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import type { ApiTeam } from '../api/types'
import { useWorldCupData } from '../hooks/useWorldCupData'
import { getDefaultTeamId, getTeamFifaCode } from '../utils/team'

interface TeamSelectionContextValue {
  selectedTeamId: string
  setSelectedTeamId: (teamId: string) => void
  selectedTeam: ApiTeam | undefined
  selectedTeamCode: string
}

const TeamSelectionContext = createContext<TeamSelectionContextValue | null>(
  null,
)

export function TeamSelectionProvider({ children }: { children: ReactNode }) {
  const { data } = useWorldCupData()
  const [selectedTeamId, setSelectedTeamId] = useState('')

  useEffect(() => {
    if (!data || selectedTeamId) return
    const defaultId = getDefaultTeamId(data.teams)
    if (defaultId) setSelectedTeamId(defaultId)
  }, [data, selectedTeamId])

  const selectedTeam = data?.teams.get(selectedTeamId)
  const selectedTeamCode = useMemo(
    () => (selectedTeam ? getTeamFifaCode(selectedTeam) : 'USA'),
    [selectedTeam],
  )

  const value = useMemo(
    () => ({
      selectedTeamId,
      setSelectedTeamId,
      selectedTeam,
      selectedTeamCode,
    }),
    [selectedTeamId, selectedTeam, selectedTeamCode],
  )

  return (
    <TeamSelectionContext.Provider value={value}>
      {children}
    </TeamSelectionContext.Provider>
  )
}

export function useTeamSelection(): TeamSelectionContextValue {
  const context = useContext(TeamSelectionContext)
  if (!context) {
    throw new Error('useTeamSelection must be used within TeamSelectionProvider')
  }
  return context
}
