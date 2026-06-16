import { useState, useEffect, useCallback, useRef } from 'react'

export default function useAutoRefresh(callback, intervalMs = 60000) {
  const [lastRefresh, setLastRefresh] = useState(Date.now())
  const [secondsAgo, setSecondsAgo] = useState(0)
  const callbackRef = useRef(callback)

  useEffect(() => {
    callbackRef.current = callback
  }, [callback])

  useEffect(() => {
    const interval = setInterval(() => {
      callbackRef.current()
      setLastRefresh(Date.now())
    }, intervalMs)

    return () => clearInterval(interval)
  }, [intervalMs])

  useEffect(() => {
    const ticker = setInterval(() => {
      setSecondsAgo(Math.floor((Date.now() - lastRefresh) / 1000))
    }, 1000)

    return () => clearInterval(ticker)
  }, [lastRefresh])

  const refresh = useCallback(() => {
    callbackRef.current()
    setLastRefresh(Date.now())
    setSecondsAgo(0)
  }, [])

  return { secondsAgo, refresh, lastRefresh }
}
