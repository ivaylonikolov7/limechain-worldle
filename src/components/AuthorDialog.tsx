import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import authorImage from '../assets/ivaylon.jpg'

interface AuthorDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function AuthorDialog({ open, onOpenChange }: AuthorDialogProps) {
  console.log('AuthorDialog render - open:', open, 'image:', authorImage)
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
            Author
          </DialogTitle>
        </DialogHeader>
        <div className="author-content">
          <img 
            src={authorImage} 
            alt="Author"
            className="author-image"
            onError={(e) => {
              console.error('Failed to load author image:', e)
            }}
          />
          <p className="author-text">
            Created with ❤️ by Ivaylo Nikolov
          </p>
        </div>
      </DialogContent>
    </Dialog>
  )
}
