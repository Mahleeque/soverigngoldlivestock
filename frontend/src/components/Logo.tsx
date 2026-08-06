import React from 'react'
import clsx from 'clsx'
import { Link } from 'react-router-dom'

const logoUrl = import.meta.env.VITE_LOGO_URL ?? '/images/logo.svg'

export const Logo = ({ tone = 'dark', className }: { tone?: 'dark' | 'light'; className?: string }) => {
  const [imgLoaded, setImgLoaded] = React.useState(false)
  const [imgError, setImgError] = React.useState(false)

  return (
    <Link to="/" className={clsx('group inline-flex items-center gap-4', className)}>
      <span
        className={clsx(
          'relative flex size-14 items-center justify-center rounded-2xl border transition bg-transparent',
          tone === 'light' ? 'border-white/25' : 'border-ink-900/10',
        )}
      >
        {!imgError && (
          <img
            src={logoUrl}
            alt="Sovereign Gold"
            className="size-7 object-contain"
            style={{ display: imgLoaded ? 'block' : 'none' }}
            onLoad={() => setImgLoaded(true)}
            onError={() => setImgError(true)}
          />
        )}

        {!imgLoaded || imgError ? (
          <svg viewBox="0 0 24 24" className="size-7" aria-hidden="true">
            <path
              d="M12 3.2c2.6 0 4.3 1.5 4.3 1.5l1.2-1.3.9 3.4c.6 2.3.2 4.4-1 6.1-.8 1.1-.9 1.6-.9 2.6v3.3H7.5v-3.3c0-1-.1-1.5-.9-2.6-1.2-1.7-1.6-3.8-1-6.1l.9-3.4 1.2 1.3S9.4 3.2 12 3.2Z"
              className="fill-gold-400"
            />
            <circle cx="9.6" cy="11" r="1.05" className="fill-ink-900" />
            <circle cx="14.4" cy="11" r="1.05" className="fill-ink-900" />
          </svg>
        ) : null}
      </span>
      <span className="leading-tight">
        <span
          className={clsx(
            'block font-display text-2xl font-semibold tracking-tight',
            tone === 'light' ? 'text-white' : 'text-ink-900',
          )}
        >
          Sovereign Gold Livestock
        </span>
        <span
          className={clsx(
            'block text-sm font-semibold uppercase tracking-[0.28em]',
            tone === 'light' ? 'text-gold-300' : 'text-gold-600',
          )}
        >
          Premium Livestock
        </span>
      </span>
    </Link>
  )
}
