import { useEffect } from 'react'

type KeyHandler = Record<string, (e: KeyboardEvent) => void>

export function useKeyboard(handlers: KeyHandler) {
  useEffect(() => {
    function listener(e: KeyboardEvent) {
      const key = [e.ctrlKey || e.metaKey ? 'Ctrl+' : '', e.key].join('')
      const handler = handlers[key] ?? handlers[e.key]
      if (handler) handler(e)
    }
    window.addEventListener('keydown', listener)
    return () => window.removeEventListener('keydown', listener)
  }, [handlers])
}
