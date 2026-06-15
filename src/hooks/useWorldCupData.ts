import { useQuery } from '@tanstack/react-query'
import { fetchWorldCupData, hasLiveMatches } from '../api/worldcup'

export function useWorldCupData() {
  return useQuery({
    queryKey: ['worldcup'],
    queryFn: fetchWorldCupData,
    staleTime: 30_000,
    refetchInterval: (query) => {
      const matches = query.state.data?.matches ?? []
      return hasLiveMatches(matches) ? 60_000 : false
    },
  })
}
