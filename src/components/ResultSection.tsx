import { type User, getAllUsers } from '../utils/dailyUser'
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

function getFirstNameInitial(name: string): string {
  return name.charAt(0).toUpperCase()
}

function getEmployeeIndex(user: User): number {
  const allUsers = getAllUsers()
  return allUsers.findIndex(
    u => u.name === user.name && u.displayName === user.displayName
  )
}

export function ResultSection({ isCorrect, dailyUser, open, onOpenChange }: ResultSectionProps) {
  const employeeIndex = getEmployeeIndex(dailyUser)
  const firstLetter = getFirstNameInitial(dailyUser.name)
  
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
            {isCorrect ? '🎉 Правилно!' : '❌ Свърши играта'}
          </DialogTitle>
          {!isCorrect && (
            <DialogDescription style={{ textAlign: 'center', color: '#ffffff' }}>
              Днешното Лаймче беше:
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
          
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'auto 1fr', 
            gap: '0.75rem 1rem',
            marginTop: '1rem',
            textAlign: 'left',
            width: '100%'
          }}>
            <div style={{ color: '#4CF3AF', fontWeight: '600' }}>Роля:</div>
            <div>{dailyUser.role}</div>
            
            <div style={{ color: '#4CF3AF', fontWeight: '600' }}>Пол:</div>
            <div>{dailyUser.gender}</div>
            
            <div style={{ color: '#4CF3AF', fontWeight: '600' }}>Първа буква:</div>
            <div>{firstLetter}</div>
            
            <div style={{ color: '#4CF3AF', fontWeight: '600' }}>Employee #:</div>
            <div>{employeeIndex + 1}</div>
            
            <div style={{ color: '#4CF3AF', fontWeight: '600' }}>#chalga:</div>
            <div>{dailyUser['listens-to-chalga'] ? '✓' : '✗'}</div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
