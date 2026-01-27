import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { getStats, getWinRate, type GameStats } from '../utils/stats'
import { getGlobalStats, type GlobalStats } from '../utils/guessTracking.firestore'
import { useState, useEffect } from 'react'

interface StatsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function StatsDialog({ open, onOpenChange }: StatsDialogProps) {
  const [stats, setStats] = useState<GameStats>(getStats())
  const [globalStats, setGlobalStats] = useState<GlobalStats | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (open) {
      setStats(getStats())
      // Fetch global stats
      setLoading(true)
      getGlobalStats()
        .then(setGlobalStats)
        .catch(console.error)
        .finally(() => setLoading(false))
    }
  }, [open])

  const winRate = getWinRate(stats)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent 
        className="sm:max-w-[500px]"
        style={{
          backgroundColor: '#1D252F',
          borderColor: '#4CF3AF',
          color: '#ffffff'
        }}
      >
        <DialogHeader style={{ textAlign: 'center' }}>
          <DialogTitle 
            style={{ 
              color: '#4CF3AF',
              fontSize: '1.5rem',
              marginBottom: '1rem'
            }}
          >
            📊 Statistics
          </DialogTitle>
        </DialogHeader>
        <div className="stats-content" style={{ padding: '1rem 0' }}>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(2, 1fr)', 
            gap: '1.5rem',
            marginBottom: '1.5rem'
          }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ 
                fontSize: '2rem', 
                fontWeight: 'bold', 
                color: '#4CF3AF',
                marginBottom: '0.25rem'
              }}>
                {stats.totalGames}
              </div>
              <div style={{ fontSize: '0.875rem', color: '#9ca3af' }}>
                Games Played
              </div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ 
                fontSize: '2rem', 
                fontWeight: 'bold', 
                color: '#4CF3AF',
                marginBottom: '0.25rem'
              }}>
                {winRate}%
              </div>
              <div style={{ fontSize: '0.875rem', color: '#9ca3af' }}>
                Win Rate
              </div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ 
                fontSize: '2rem', 
                fontWeight: 'bold', 
                color: '#4CF3AF',
                marginBottom: '0.25rem'
              }}>
                {stats.currentStreak}
              </div>
              <div style={{ fontSize: '0.875rem', color: '#9ca3af' }}>
                Current Streak
              </div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ 
                fontSize: '2rem', 
                fontWeight: 'bold', 
                color: '#4CF3AF',
                marginBottom: '0.25rem'
              }}>
                {stats.bestStreak}
              </div>
              <div style={{ fontSize: '0.875rem', color: '#9ca3af' }}>
                Best Streak
              </div>
            </div>
          </div>
          <div style={{ 
            textAlign: 'center', 
            paddingTop: '1rem',
            borderTop: '1px solid #374151',
            color: '#9ca3af',
            fontSize: '0.875rem'
          }}>
            <div style={{ marginBottom: '1rem', fontWeight: 'bold', color: '#4CF3AF' }}>
              Your Stats
            </div>
            <div style={{ marginBottom: '0.5rem' }}>
              Games Won: <strong style={{ color: '#ffffff' }}>{stats.gamesWon}</strong>
            </div>
            <div style={{ marginBottom: '1.5rem' }}>
              Games Lost: <strong style={{ color: '#ffffff' }}>{stats.totalGames - stats.gamesWon}</strong>
            </div>
            
            {loading ? (
              <div style={{ color: '#9ca3af', fontSize: '0.875rem' }}>Loading global stats...</div>
            ) : globalStats ? (
              <>
                <div style={{ marginBottom: '1rem', fontWeight: 'bold', color: '#4CF3AF' }}>
                  Global Stats (All Players)
                </div>
                <div style={{ marginBottom: '0.5rem' }}>
                  Total Games: <strong style={{ color: '#ffffff' }}>{globalStats.totalGuesses}</strong>
                </div>
                <div style={{ marginBottom: '0.5rem' }}>
                  Games Won: <strong style={{ color: '#ffffff' }}>{globalStats.totalWins}</strong>
                </div>
                <div style={{ marginBottom: '0.5rem' }}>
                  Games Lost: <strong style={{ color: '#ffffff' }}>{globalStats.totalLosses}</strong>
                </div>
                <div>
                  Win Rate: <strong style={{ color: '#ffffff' }}>{globalStats.winRate}%</strong>
                </div>
              </>
            ) : (
              <div style={{ color: '#9ca3af', fontSize: '0.875rem' }}>Unable to load global stats</div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
