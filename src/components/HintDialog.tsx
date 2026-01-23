import { type User } from '../utils/dailyUser'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

interface HintDialogProps {
  dailyUser: User
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function HintDialog({ dailyUser, open, onOpenChange }: HintDialogProps) {
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
              marginBottom: '0.5rem'
            }}
          >
            💡 Hint!
          </DialogTitle>
          <DialogDescription style={{ textAlign: 'center', color: '#ffffff', marginTop: '0.5rem' }}>
            Here's a blurred picture of today's employee:
          </DialogDescription>
        </DialogHeader>
        <div className="hint-content" style={{ textAlign: 'center', padding: '1rem' }}>
          {dailyUser.image192 && (
            <img 
              src={dailyUser.image192} 
              alt="Hint"
              className="hint-image"
              style={{
                filter: 'blur(15px)',
                width: '200px',
                height: '200px',
                objectFit: 'cover',
                borderRadius: '8px',
                margin: '0 auto',
                display: 'block'
              }}
            />
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
