import { motion, PanInfo } from "framer-motion"
import { useState } from "react"
import { Trash2, Archive } from "lucide-react"
import { cn } from "@/lib/utils"
import { toast } from "@/hooks/use-toast"

interface SwipeItemProps {
  children: React.ReactNode
  onDelete?: () => void
  onArchive?: () => void
  className?: string
}

export function SwipeItem({ children, onDelete, onArchive, className }: SwipeItemProps) {
  const [dragX, setDragX] = useState(0)
  const [showActions, setShowActions] = useState(false)

  const handleDragEnd = (event: any, info: PanInfo) => {
    const threshold = 100
    
    if (info.offset.x > threshold) {
      // Swipe right - Archive
      if (onArchive) {
        onArchive()
        toast({
          title: "Item arquivado",
        })
      }
    } else if (info.offset.x < -threshold) {
      // Swipe left - Delete
      if (onDelete) {
        onDelete()
        // Haptic feedback for delete action
        if (navigator.vibrate) {
          navigator.vibrate([50, 50, 50])
        }
        toast({
          title: "Item removido",
          variant: "destructive",
        })
      }
    }
    
    // Reset position
    setDragX(0)
    setShowActions(false)
  }

  const handleDrag = (event: any, info: PanInfo) => {
    setDragX(info.offset.x)
    setShowActions(Math.abs(info.offset.x) > 50)
  }

  return (
    <div className={cn("relative overflow-hidden", className)}>
      {/* Background Actions */}
      <div className="absolute inset-0 flex items-center justify-between px-4">
        <div className={cn(
          "flex items-center gap-2 text-success transition-opacity",
          dragX > 50 ? "opacity-100" : "opacity-0"
        )}>
          <Archive className="h-5 w-5" />
          <span>Arquivar</span>
        </div>
        <div className={cn(
          "flex items-center gap-2 text-destructive transition-opacity",
          dragX < -50 ? "opacity-100" : "opacity-0"
        )}>
          <span>Remover</span>
          <Trash2 className="h-5 w-5" />
        </div>
      </div>

      {/* Draggable Content */}
      <motion.div
        drag="x"
        dragConstraints={{ left: -150, right: 150 }}
        dragElastic={0.2}
        onDrag={handleDrag}
        onDragEnd={handleDragEnd}
        animate={{ x: 0 }}
        className="relative z-10 bg-background"
      >
        {children}
      </motion.div>
    </div>
  )
}