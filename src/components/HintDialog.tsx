import { useEffect, useRef, useState } from 'react'
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

function PixelatedImage({ src, pixelSize = 20 }: { src: string; pixelSize?: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const img = new Image()
    
    img.onload = () => {
      const ctx = canvas.getContext('2d')
      if (!ctx) return

      const width = 200
      const height = 200
      canvas.width = width
      canvas.height = height

      // Create a temporary canvas for the scaled down version
      const tempCanvas = document.createElement('canvas')
      const tempCtx = tempCanvas.getContext('2d')
      if (!tempCtx) return

      const smallWidth = Math.floor(width / pixelSize)
      const smallHeight = Math.floor(height / pixelSize)
      
      tempCanvas.width = smallWidth
      tempCanvas.height = smallHeight
      
      // Draw the image scaled down on temp canvas
      tempCtx.drawImage(img, 0, 0, smallWidth, smallHeight)
      
      // Disable smoothing and scale up to main canvas
      ctx.imageSmoothingEnabled = false
      ctx.drawImage(tempCanvas, 0, 0, smallWidth, smallHeight, 0, 0, width, height)
    }

    img.onerror = () => {
      console.error('Failed to load image:', src)
    }

    img.src = src
  }, [src, pixelSize])

  return (
    <canvas
      ref={canvasRef}
      style={{
        width: '200px',
        height: '200px',
        borderRadius: '8px',
        display: 'block',
        margin: '0 auto',
        objectFit: 'cover'
      }}
    />
  )
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
            Here's a pixelated picture of today's employee:
          </DialogDescription>
        </DialogHeader>
        <div className="hint-content" style={{ textAlign: 'center', padding: '1rem' }}>
          {dailyUser.image192 && (
            <PixelatedImage src={dailyUser.image192} pixelSize={20} />
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
