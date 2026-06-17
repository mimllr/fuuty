import { NavLink, Outlet } from 'react-router-dom'
import { TeamSelectionProvider, useTeamSelection } from '../context/TeamSelectionContext'
import styles from './BottomNav.module.css'

function BottomNav() {
  const { selectedTeamCode } = useTeamSelection()

  return (
    <nav className={styles.nav} aria-label="Main navigation">
      <NavLink
        to="/"
        className={({ isActive }) =>
          isActive ? `${styles.link} ${styles.active}` : styles.link
        }
        end
      >
        Matches
      </NavLink>
      <NavLink
        to="/standings"
        className={({ isActive }) =>
          isActive ? `${styles.link} ${styles.active}` : styles.link
        }
      >
        Standings
      </NavLink>
      <NavLink
        to="/team"
        className={({ isActive }) =>
          isActive ? `${styles.link} ${styles.active}` : styles.link
        }
      >
        Team ({selectedTeamCode})
      </NavLink>
    </nav>
  )
}

export function Layout() {
  return (
    <TeamSelectionProvider>
      <div className="app-shell">
        <Outlet />
        <BottomNav />
      </div>
    </TeamSelectionProvider>
  )
}
