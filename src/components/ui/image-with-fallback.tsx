
import React, { useState } from 'react';

interface ImageWithFallbackProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  fallbackSrc?: string;
}

// Placeholder inline em base64 (um ícone simples de usuário/imagem)
const INLINE_PLACEHOLDER = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0xNiAxNkMyMC40MTgzIDE2IDI0IDE5LjU4MTcgMjQgMjRDMjQgMjguNDE4MyAyMC40MTgzIDMyIDE2IDMyQzExLjU4MTcgMzIgOCAyOC40MTgzIDggMjRDOCAxOS41ODE3IDExLjU4MTcgMTYgMTYgMTZaIiBmaWxsPSIjOUNBM0FGIi8+Cjwvc3ZnPgo=';

export const ImageWithFallback: React.FC<ImageWithFallbackProps> = ({
  src,
  fallbackSrc,
  onError,
  ...props
}) => {
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const handleError = (event: React.SyntheticEvent<HTMLImageElement, Event>) => {
    console.warn('Image failed to load:', src);
    setHasError(true);
    setIsLoading(false);
    onError?.(event);
  };

  const handleLoad = () => {
    setIsLoading(false);
    setHasError(false);
  };

  // Se não tem src ou deu erro, usar fallback
  if (hasError || !src) {
    const finalFallback = fallbackSrc || INLINE_PLACEHOLDER;
    
    return (
      <img 
        src={finalFallback}
        onError={(e) => {
          // Se até mesmo o fallback personalizado falhar, usar o placeholder inline
          if (e.currentTarget.src !== INLINE_PLACEHOLDER) {
            e.currentTarget.src = INLINE_PLACEHOLDER;
          }
        }}
        {...props} 
      />
    );
  }

  return (
    <img 
      src={src} 
      onError={handleError}
      onLoad={handleLoad}
      {...props}
    />
  );
};
