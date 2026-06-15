import { NavLink, Outlet } from 'react-router-dom'
import styles from './BottomNav.module.css'

export function BottomNav() {
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
    </nav>
  )
}

export function Layout() {
  return (
    <div className="app-shell">
      <Outlet />
      <BottomNav />
    </div>
  )
}
