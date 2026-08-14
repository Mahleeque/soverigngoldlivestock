import clsx from 'clsx'
import { Loader2 } from 'lucide-react'
import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { Link } from 'react-router-dom'

type Variant = 'primary' | 'gold' | 'outline' | 'ghost' | 'danger'
type Size = 'sm' | 'md' | 'lg'

const VARIANTS: Record<Variant, string> = {
  primary: 'bg-ink-900 text-white hover:bg-ink-800 focus-visible:outline-ink-900',
  gold: 'bg-gold-400 text-ink-900 hover:bg-gold-300 focus-visible:outline-gold-500',
  outline: 'border border-ink-200 bg-white text-ink-800 hover:border-ink-300 hover:bg-ink-50',
  ghost: 'text-ink-700 hover:bg-ink-100',
  danger: 'bg-rose-900 text-white hover:bg-rose-950 focus-visible:outline-rose-900',
}

const SIZES: Record<Size, string> = {
  sm: 'h-9 px-3.5 text-base',
  md: 'h-11 px-5 text-base',
  lg: 'h-12 px-7 text-base',
}

const base =
  'inline-flex items-center justify-center gap-2 rounded-full font-semibold transition duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-not-allowed disabled:opacity-55'

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: Size
  loading?: boolean
  icon?: ReactNode
}

export const Button = ({
  variant = 'primary',
  size = 'md',
  loading = false,
  icon,
  className,
  children,
  disabled,
  ...props
}: ButtonProps) => (
  <button
    className={clsx(base, VARIANTS[variant], SIZES[size], className)}
    disabled={disabled || loading}
    {...props}
  >
    {loading ? <Loader2 className="size-4 animate-spin" /> : icon}
    {children}
  </button>
)

export interface ButtonLinkProps {
  to: string
  variant?: Variant
  size?: Size
  className?: string
  children: ReactNode
  icon?: ReactNode
  state?: unknown
}

export const ButtonLink = ({ to, variant = 'primary', size = 'md', className, children, icon, state }: ButtonLinkProps) => (
  <Link to={to} state={state} className={clsx(base, VARIANTS[variant], SIZES[size], className)}>
    {icon}
    {children}
  </Link>
)
