import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { Layout } from './components/Layout'
import { MatchesPage } from './pages/MatchesPage'
import { StandingsPage } from './pages/StandingsPage'
import { TeamPage } from './pages/TeamPage'

const queryClient = new QueryClient()

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route index element={<MatchesPage />} />
            <Route path="standings" element={<StandingsPage />} />
            <Route path="team" element={<TeamPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  )
}
