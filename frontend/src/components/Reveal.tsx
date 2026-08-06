import clsx from 'clsx'
import { useEffect, useRef, useState, type ReactNode } from 'react'

interface RevealProps {
  children: ReactNode
  className?: string
  /** Stagger in milliseconds applied before the element animates in. */
  delay?: number
  id?: string
}

/** Fades and lifts its children into view the first time they enter the viewport. */
export const Reveal = ({ children, className, delay = 0, id }: RevealProps) => {
  const ref = useRef<HTMLDivElement | null>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const node = ref.current
    if (!node) return
    if (typeof IntersectionObserver === 'undefined') {
      setVisible(true)
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisible(true)
            observer.disconnect()
          }
        })
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' },
    )

    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      id={id}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
      className={clsx('reveal', visible && 'reveal-visible', className)}
    >
      {children}
    </div>
  )
}
