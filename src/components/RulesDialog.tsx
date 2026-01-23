import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { RulesContent } from './RulesContent'

interface RulesDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function RulesDialog({ open, onOpenChange }: RulesDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent 
        className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto"
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
            How to Play
          </DialogTitle>
        </DialogHeader>
        <RulesContent />
      </DialogContent>
    </Dialog>
  )
}
