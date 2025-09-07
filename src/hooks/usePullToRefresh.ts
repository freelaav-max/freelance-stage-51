import { useEffect, useRef } from 'react'
import PullToRefresh from 'pulltorefreshjs'

interface UsePullToRefreshOptions {
  onRefresh: () => Promise<void> | void
  enabled?: boolean
  threshold?: number
  resistance?: number
}

export function usePullToRefresh({
  onRefresh,
  enabled = true,
  threshold = 60,
  resistance = 2.5
}: UsePullToRefreshOptions) {
  const containerRef = useRef<HTMLElement>(null)

  useEffect(() => {
    if (!enabled || typeof window === 'undefined') return

    const element = containerRef.current || document.body

    PullToRefresh.init({
      mainElement: element as HTMLElement,
      onRefresh: async () => {
        try {
          await onRefresh()
        } catch (error) {
          console.error('Pull to refresh error:', error)
        }
      },
      distThreshold: threshold,
      distMax: threshold * 2,
      distReload: threshold * 1.2,
      bodyTopMargin: 20,
      instructionsPullToRefresh: 'Arraste para atualizar',
      instructionsReleaseToRefresh: 'Solte para atualizar',
      instructionsRefreshing: 'Atualizando...',
      refreshTimeout: 500,
      getStyles: function() {
        return `
          .__PREFIX__ptr {
            box-shadow: inset 0 -3px 5px rgba(0, 0, 0, 0.12);
            pointer-events: none;
            font-size: 0.85em;
            font-weight: bold;
            top: 0;
            height: 0;
            transition: height 0.3s, min-height 0.3s;
            text-align: center;
            width: 100%;
            overflow: hidden;
            display: flex;
            align-items: flex-end;
            align-content: stretch;
            background: hsl(var(--card));
            color: hsl(var(--card-foreground));
          }
          .__PREFIX__box {
            padding: 10px;
            flex-basis: 100%;
          }
          .__PREFIX__pull {
            transition: none;
          }
          .__PREFIX__text {
            margin-top: 0.33em;
            color: hsl(var(--muted-foreground));
          }
          .__PREFIX__icon {
            color: hsl(var(--primary));
            transition: transform 0.3s;
          }
          .__PREFIX__top {
            touch-action: pan-x pan-down pinch-zoom;
          }
          .__PREFIX__release .__PREFIX__icon {
            transform: rotate(180deg);
          }
        `
      },
      getMarkup: function() {
        return `
          <div class="__PREFIX__box">
            <div class="__PREFIX__content">
              <div class="__PREFIX__icon">↓</div>
              <div class="__PREFIX__text"></div>
            </div>
          </div>
        `
      },
      onInit: function() {
        // Optional: Add haptic feedback on init
        if (navigator.vibrate) {
          navigator.vibrate(10)
        }
      },
      resistanceFunction: (t: number) => Math.min(1, t / resistance)
    })

    return () => {
      PullToRefresh.destroyAll()
    }
  }, [onRefresh, enabled, threshold, resistance])

  return { containerRef }
}