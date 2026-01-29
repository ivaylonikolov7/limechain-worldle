import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { getGlobalStats, getTodayStats, type GlobalStats, type TodayStats } from '../utils/guessTracking.firestore'
import { useState, useEffect } from 'react'

interface StatsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function StatsDialog({ open, onOpenChange }: StatsDialogProps) {
  const [globalStats, setGlobalStats] = useState<GlobalStats | null>(null)
  const [todayStats, setTodayStats] = useState<TodayStats | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (open) {
      // Fetch global stats and today's stats
      setLoading(true)
      const today = new Date().toISOString().split('T')[0]
      
      Promise.all([
        getGlobalStats(),
        getTodayStats(today)
      ])
        .then(([global, today]) => {
          setGlobalStats(global)
          setTodayStats(today)
        })
        .catch(console.error)
        .finally(() => setLoading(false))
    }
  }, [open])

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
          {loading ? (
            <div style={{ textAlign: 'center', color: '#9ca3af', fontSize: '0.875rem', padding: '2rem 0' }}>
              Loading stats...
            </div>
          ) : (
            <>
              {/* Today's Stats */}
              <div style={{ 
                textAlign: 'center', 
                paddingBottom: '1.5rem',
                borderBottom: '1px solid #374151',
                marginBottom: '1.5rem'
              }}>
                <div style={{ marginBottom: '1rem', fontWeight: 'bold', color: '#4CF3AF', fontSize: '1.1rem' }}>
                  Today's Stats
                </div>
                {todayStats ? (
                  <>
                    <div style={{ marginBottom: '0.75rem', color: '#9ca3af', fontSize: '0.875rem' }}>
                      Users Guessed: <strong style={{ color: '#ffffff', fontSize: '1rem' }}>{todayStats.totalUsers ?? 0}</strong>
                    </div>
                    <div style={{ marginBottom: '0.75rem', color: '#9ca3af', fontSize: '0.875rem' }}>
                      Win Rate: <strong style={{ color: '#ffffff', fontSize: '1rem' }}>{(todayStats.winRate ?? 0)}%</strong>
                    </div>
                    <div style={{ color: '#9ca3af', fontSize: '0.875rem' }}>
                      Avg Guess (Wins): <strong style={{ color: '#ffffff', fontSize: '1rem' }}>
                        {todayStats.averageGuessNumber > 0 ? todayStats.averageGuessNumber : 'N/A'}
                      </strong>
                    </div>
                  </>
                ) : (
                  <div style={{ color: '#9ca3af', fontSize: '0.875rem' }}>No data for today</div>
                )}
              </div>

              {/* Global Stats */}
              <div style={{ 
                textAlign: 'center', 
                color: '#9ca3af',
                fontSize: '0.875rem'
              }}>
                <div style={{ marginBottom: '1rem', fontWeight: 'bold', color: '#4CF3AF', fontSize: '1.1rem' }}>
                  Global Stats (All Time)
                </div>
                {globalStats ? (
                  <>
                    <div style={{ marginBottom: '0.75rem' }}>
                      Total Games: <strong style={{ color: '#ffffff', fontSize: '1rem' }}>{globalStats.totalGuesses}</strong>
                    </div>
                    <div style={{ marginBottom: '0.75rem' }}>
                      Games Won: <strong style={{ color: '#ffffff', fontSize: '1rem' }}>{globalStats.totalWins}</strong>
                    </div>
                    <div style={{ marginBottom: '0.75rem' }}>
                      Games Lost: <strong style={{ color: '#ffffff', fontSize: '1rem' }}>{globalStats.totalLosses}</strong>
                    </div>
                    <div>
                      Avg Guess (Wins): <strong style={{ color: '#ffffff', fontSize: '1rem' }}>
                        {globalStats.averageGuessNumber > 0 ? globalStats.averageGuessNumber : 'N/A'}
                      </strong>
                    </div>
                  </>
                ) : (
                  <div style={{ color: '#9ca3af', fontSize: '0.875rem' }}>Unable to load global stats</div>
                )}
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
