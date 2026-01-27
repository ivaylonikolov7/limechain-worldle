import { type User } from '../utils/dailyUser'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

interface ResultSectionProps {
  isCorrect: boolean
  dailyUser: User
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ResultSection({ isCorrect, dailyUser, open, onOpenChange }: ResultSectionProps) {
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
              color: isCorrect ? '#4ade80' : '#f87171',
              fontSize: '1.5rem',
              marginBottom: '0.5rem'
            }}
          >
            {isCorrect ? '🎉 Correct!' : '❌ Game Over'}
          </DialogTitle>
          {!isCorrect && (
            <DialogDescription style={{ textAlign: 'center', color: '#ffffff' }}>
              The daily employee was:
            </DialogDescription>
          )}
        </DialogHeader>
        <div className="user-info">
          {dailyUser.image192 && (
            <img 
              src={dailyUser.image192} 
              alt={dailyUser.name}
              className="user-avatar"
            />
          )}
          <h2>{dailyUser.displayName || dailyUser.name}</h2>
          <p className="user-name">{dailyUser.name}</p>
          <p className="user-role">Role: {dailyUser.role}</p>
          <p className="user-before-me">
            Before me in company: {dailyUser['before-me-in-company'] ? 'Yes' : 'No'}
          </p>
          <p className="user-gender">Gender: {dailyUser.gender}</p>
        </div>
      </DialogContent>
    </Dialog>
  )
}
