import { useState } from 'react'
import { HelpCircle, User, BarChart3, LogOut } from 'lucide-react'
import { RulesDialog } from './RulesDialog'
import { StatsDialog } from './StatsDialog'
import { AuthorDialog } from './AuthorDialog'

interface HeaderButtonsProps {
  onLogout: () => void
  userEmail?: string | null
}

export function HeaderButtons({
  onLogout,
  userEmail
}: HeaderButtonsProps) {
  const [rulesOpen, setRulesOpen] = useState(false)
  const [statsOpen, setStatsOpen] = useState(false)
  const [authorOpen, setAuthorOpen] = useState(false)

  return (
    <>
      <div className="header-buttons">
        <div className="header-buttons-wrapper">
          <button 
            className="header-button"
            onClick={() => setRulesOpen(true)}
            aria-label="How to Play"
          >
            <HelpCircle size={24} />
          </button>
          <button 
            className="header-button"
            onClick={() => setStatsOpen(true)}
            aria-label="Statistics"
          >
            <BarChart3 size={24} />
          </button>
          <button 
            className="header-button"
            onClick={() => {
              console.log('Author button clicked, opening dialog')
              setAuthorOpen(true)
            }}
            aria-label="Author"
          >
            <User size={24} />
          </button>
          <button 
            className="header-button"
            onClick={onLogout}
            aria-label="Logout"
            title={`Logged in as ${userEmail}`}
          >
            <LogOut size={24} />
          </button>
        </div>
      </div>

      <RulesDialog 
        open={rulesOpen} 
        onOpenChange={setRulesOpen}
      />
      <StatsDialog 
        open={statsOpen} 
        onOpenChange={setStatsOpen}
      />
      <AuthorDialog 
        open={authorOpen} 
        onOpenChange={setAuthorOpen}
      />
    </>
  )
}
