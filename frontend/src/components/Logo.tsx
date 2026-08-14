import React from 'react'
import clsx from 'clsx'
import { Link } from 'react-router-dom'

const logoUrl = import.meta.env.VITE_LOGO_URL ?? '/images/logo.svg'

export const Logo = ({ tone = 'dark', className }: { tone?: 'dark' | 'light'; className?: string }) => {
  const [imgLoaded, setImgLoaded] = React.useState(false)
  const [imgError, setImgError] = React.useState(false)

  return (
    <Link to="/" className={clsx('group inline-flex items-center gap-3.5 transition hover:opacity-95', className)}>
      <span
        className={clsx(
          'relative flex size-12 items-center justify-center overflow-hidden rounded-2xl border shadow-sm transition group-hover:scale-105',
          tone === 'light'
            ? 'border-white/20 bg-ink-900/60 shadow-black/20'
            : 'border-gold-500/30 bg-moss-950 shadow-gold-500/10',
        )}
      >
        {!imgError && (
          <img
            src={logoUrl}
            alt="Sovereign Gold Livestock"
            className="size-full object-cover"
            style={{ display: imgLoaded ? 'block' : 'none' }}
            onLoad={() => setImgLoaded(true)}
            onError={() => setImgError(true)}
          />
        )}

        {(!imgLoaded || imgError) && (
          <svg viewBox="0 0 100 100" className="size-8" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="50" cy="50" r="44" fill="#144230" stroke="#FDE047" strokeWidth="2" />
            <path
              d="M32 38C26 28 40 22 50 32C60 22 74 28 68 38C62 48 54 62 50 68C46 62 38 48 32 38Z"
              fill="#FACC15"
            />
            <circle cx="44" cy="42" r="2" fill="#091A13" />
            <circle cx="56" cy="42" r="2" fill="#091A13" />
            <polygon points="50,22 53,27 58,25 55,30 50,28 45,30 42,25 47,27" fill="#FEF08A" />
          </svg>
        )}
      </span>

      <span className="flex flex-col justify-center leading-none">
        <span
          className={clsx(
            'font-display text-xl font-bold tracking-tight transition sm:text-2xl',
            tone === 'light' ? 'text-white' : 'text-ink-950',
          )}
        >
          Sovereign Gold
        </span>
        <span
          className={clsx(
            'mt-1 text-[0.68rem] font-bold uppercase tracking-[0.24em]',
            tone === 'light' ? 'text-gold-300' : 'text-gold-600',
          )}
        >
          Livestock Farm
        </span>
      </span>
    </Link>
  )
}
