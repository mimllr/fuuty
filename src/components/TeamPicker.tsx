import type { ApiTeam } from '../api/types'
import styles from './TeamPicker.module.css'

interface TeamOption {
  id: string
  team: ApiTeam
}

interface TeamPickerProps {
  teams: TeamOption[]
  selectedTeamId: string
  onTeamChange: (teamId: string) => void
}

export function TeamPicker({
  teams,
  selectedTeamId,
  onTeamChange,
}: TeamPickerProps) {
  return (
    <div className={styles.picker}>
      <label htmlFor="team-select" className={styles.label}>
        Team
      </label>
      <select
        id="team-select"
        className={styles.select}
        value={selectedTeamId}
        onChange={(event) => onTeamChange(event.target.value)}
      >
        {teams.map(({ id, team }) => (
          <option key={id} value={id}>
            {team.name_en}
          </option>
        ))}
      </select>
    </div>
  )
}
