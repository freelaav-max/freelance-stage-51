import { lazy, Suspense } from 'react';
import { LoadingSpinner } from '@/components/LoadingSpinner';

// Lazy load heavy components for better performance
export const LazyChatInterface = lazy(() => 
  import('@/components/chat/ChatInterface').then(module => ({ 
    default: module.ChatInterface 
  }))
);

export const LazySearchFilters = lazy(() => 
  import('@/components/SearchFilters')
);

export const LazyModernOfferForm = lazy(() => 
  import('@/components/ModernOfferForm').then(module => ({ 
    default: module.ModernOfferForm 
  }))
);

// Wrapper components with loading states
export const ChatInterfaceWithSuspense = (props: any) => (
  <Suspense fallback={<LoadingSpinner />}>
    <LazyChatInterface {...props} />
  </Suspense>
);

export const SearchFiltersWithSuspense = (props: any) => (
  <Suspense fallback={<LoadingSpinner />}>
    <LazySearchFilters {...props} />
  </Suspense>
);

export const ModernOfferFormWithSuspense = (props: any) => (
  <Suspense fallback={<LoadingSpinner />}>
    <LazyModernOfferForm {...props} />
  </Suspense>
);