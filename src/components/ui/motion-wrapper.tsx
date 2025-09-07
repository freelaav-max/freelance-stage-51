import { motion, AnimatePresence, MotionConfig, Transition } from "framer-motion"
import * as React from "react"

// Motion presets for common animations
export const motionPresets = {
  fadeIn: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
    transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] as const }
  },
  scaleIn: {
    initial: { opacity: 0, scale: 0.95 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.95 },
    transition: { duration: 0.2, ease: [0.4, 0, 0.2, 1] as const }
  },
  slideUp: {
    initial: { opacity: 0, y: 40 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 40 },
    transition: { duration: 0.4, ease: [0.4, 0, 0.2, 1] as const }
  },
  press: {
    whileTap: { scale: 0.98 },
    transition: { duration: 0.1 } as Transition
  },
  hover: {
    whileHover: { y: -2, scale: 1.02 },
    transition: { duration: 0.2 } as Transition
  }
}

interface MotionWrapperProps {
  children: React.ReactNode
  preset?: keyof typeof motionPresets
  className?: string
  reducedMotion?: boolean
}

export function MotionWrapper({ 
  children, 
  preset = 'fadeIn', 
  className,
  reducedMotion = false 
}: MotionWrapperProps) {
  const presetConfig = motionPresets[preset]
  
  // Respect user's reduced motion preference
  if (reducedMotion) {
    return <div className={className}>{children}</div>
  }

  return (
    <motion.div
      className={className}
      {...presetConfig}
    >
      {children}
    </motion.div>
  )
}

interface MotionCardProps {
  children: React.ReactNode
  className?: string
  interactive?: boolean
}

export function MotionCard({ children, className, interactive = true }: MotionCardProps) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={interactive ? { y: -4, scale: 1.02 } : undefined}
      whileTap={interactive ? { scale: 0.98 } : undefined}
      transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] } as Transition}
    >
      {children}
    </motion.div>
  )
}

interface MotionButtonProps {
  children: React.ReactNode
  className?: string
  haptic?: boolean
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void
}

export function MotionButton({ children, className, haptic = false, onClick }: MotionButtonProps) {
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (haptic && navigator.vibrate) {
      navigator.vibrate(20)
    }
    onClick?.(e)
  }

  return (
    <motion.button
      className={className}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      transition={{ duration: 0.1 } as Transition}
      onClick={handleClick}
    >
      {children}
    </motion.button>
  )
}

// Motion configuration component for app-wide settings
export function MotionProvider({ children }: { children: React.ReactNode }) {
  return (
    <MotionConfig reducedMotion="user">
      {children}
    </MotionConfig>
  )
}

export { motion, AnimatePresence }