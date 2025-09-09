import React from 'react';
import { ImageWithFallback } from '@/components/ui/image-with-fallback';
import { cn } from '@/lib/utils';

interface LogoProps {
  size?: 'xs' | 'sm' | 'md' | 'lg';
  className?: string;
  'aria-label'?: string;
}

const sizeMap = {
  xs: 'h-6',
  sm: 'h-8', 
  md: 'h-10',
  lg: 'h-12'
} as const;

export const Logo: React.FC<LogoProps> = ({ 
  size = 'md', 
  className,
  'aria-label': ariaLabel = 'Logotipo FreelaAV'
}) => {
  return (
    <ImageWithFallback
      src="/freelaav-logo.png"
      fallbackSrc="/lovable-uploads/c127466c-6a9e-4bef-bb44-66895ef039fb.png"
      alt={ariaLabel}
      className={cn(
        sizeMap[size],
        'w-auto object-contain pointer-events-none select-none p-0.5',
        className
      )}
    />
  );
};