"use client"

import { useEffect, useRef } from "react"
import { usePathname, useSearchParams } from "next/navigation"
import NProgress from "nprogress"

export function NavigationProgress() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const isNavigatingRef = useRef(false)

  useEffect(() => {
    // Configure NProgress immediately
    NProgress.configure({
      showSpinner: false,
      speed: 500,
      minimum: 0.08,
      easing: "ease",
      trickleSpeed: 200,
    })

    // More aggressive link click detection
    const handleClick = (e: MouseEvent) => {
      try {
        const target = e.target as HTMLElement
        const link = target.closest("a")

        if (link && link.href) {
          const url = new URL(link.href, window.location.origin)
          const currentUrl = new URL(window.location.href)

          // Check if it's a same-origin navigation to a different path
          if (
            url.origin === currentUrl.origin &&
            (url.pathname !== currentUrl.pathname || url.search !== currentUrl.search)
          ) {
            // Start immediately, don't wait
            if (!isNavigatingRef.current) {
              isNavigatingRef.current = true
              NProgress.start()
            }
          }
        }
      } catch (error) {
        // Ignore URL parsing errors
      }
    }

    // Intercept router methods more aggressively
    const startProgress = () => {
      if (!isNavigatingRef.current) {
        isNavigatingRef.current = true
        NProgress.start()
      }
    }

    // Store original methods
    const originalPushState = window.history.pushState
    const originalReplaceState = window.history.replaceState

    // Override history methods
    window.history.pushState = function (...args) {
      startProgress()
      return originalPushState.apply(this, args)
    }

    window.history.replaceState = function (...args) {
      startProgress()
      return originalReplaceState.apply(this, args)
    }

    // Handle popstate (back/forward)
    const handlePopState = () => {
      startProgress()
    }

    // Also listen for any programmatic navigation
    const handleBeforeUnload = () => {
      startProgress()
    }
    window.addEventListener("beforeunload", handleBeforeUnload)

    // Add event listeners with capture phase for earlier detection
    document.addEventListener("click", handleClick, true)
    window.addEventListener("popstate", handlePopState)

    return () => {
      // Cleanup
      document.removeEventListener("click", handleClick, true)
      window.removeEventListener("popstate", handlePopState)
      window.removeEventListener("beforeunload", handleBeforeUnload)

      // Restore original methods
      window.history.pushState = originalPushState
      window.history.replaceState = originalReplaceState
    }
  }, [])

  // Complete progress when navigation finishes
  useEffect(() => {
    if (isNavigatingRef.current) {
      isNavigatingRef.current = false
      NProgress.done()
    }
  }, [pathname, searchParams])

  return null
}
