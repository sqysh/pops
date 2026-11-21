import { useState, useEffect } from 'react'

interface Typed {
  /** The text this progress belongs to, so progress for old text is never shown for new text. */
  text: string
  displayed: string
  done: boolean
}

export function useTypingText(text: string, speed = 45, delay = 300) {
  const [typed, setTyped] = useState<Typed>({ text: '', displayed: '', done: false })

  useEffect(() => {
    let i = 0
    let interval: ReturnType<typeof setInterval> | undefined

    const timeout = setTimeout(() => {
      interval = setInterval(() => {
        i++
        setTyped({ text, displayed: text.slice(0, i), done: i >= text.length })
        if (i >= text.length) clearInterval(interval)
      }, speed)
    }, delay)

    return () => {
      clearTimeout(timeout)
      clearInterval(interval)
    }
  }, [text, speed, delay])

  // new text (or timing) starts over from nothing until its own typing begins
  const current = typed.text === text
  return { displayed: current ? typed.displayed : '', done: current ? typed.done : false }
}
