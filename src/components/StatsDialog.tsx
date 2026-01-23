import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { getStats, getWinRate, type GameStats } from '../utils/stats'
import { useState, useEffect } from 'react'

interface StatsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function StatsDialog({ open, onOpenChange }: StatsDialogProps) {
  const [stats, setStats] = useState<GameStats>(getStats())

  useEffect(() => {
    if (open) {
      setStats(getStats())
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
            <div style={{ marginBottom: '0.5rem' }}>
              Games Won: <strong style={{ color: '#ffffff' }}>{stats.gamesWon}</strong>
            </div>
            <div>
              Games Lost: <strong style={{ color: '#ffffff' }}>{stats.totalGames - stats.gamesWon}</strong>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
