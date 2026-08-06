import clsx from 'clsx'
import { AlertCircle, CheckCircle2, Info, Star, X } from 'lucide-react'
import type { InputHTMLAttributes, ReactNode, SelectHTMLAttributes, TextareaHTMLAttributes } from 'react'
import { useToastStore } from '@/store/toast'

export const Badge = ({
  children,
  tone = 'neutral',
  className,
}: {
  children: ReactNode
  tone?: 'neutral' | 'success' | 'warning' | 'danger' | 'gold' | 'info'
  className?: string
}) => {
  const tones = {
    neutral: 'bg-ink-100 text-ink-700',
    success: 'bg-moss-100 text-moss-700',
    warning: 'bg-gold-100 text-gold-700',
    danger: 'bg-red-100 text-red-700',
    gold: 'bg-gold-400 text-ink-900',
    info: 'bg-sky-100 text-sky-700',
  }
  return (
    <span
      className={clsx(
        'inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-sm font-semibold tracking-wide',
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  )
}

export const SectionHeading = ({
  eyebrow,
  title,
  description,
  align = 'left',
  action,
}: {
  eyebrow?: string
  title: string
  description?: string
  align?: 'left' | 'center'
  action?: ReactNode
}) => (
  <div
    className={clsx(
      'flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between',
      align === 'center' && 'sm:flex-col sm:items-center sm:text-center',
    )}
  >
    <div className={clsx('max-w-2xl', align === 'center' && 'mx-auto text-center')}>
      {eyebrow ? (
        <p className="mb-2 text-sm font-bold uppercase tracking-[0.2em] text-gold-600">{eyebrow}</p>
      ) : null}
      <h2 className="text-3xl font-semibold sm:text-4xl">{title}</h2>
      {description ? <p className="mt-3 text-base leading-relaxed text-ink-500">{description}</p> : null}
    </div>
    {action}
  </div>
)

interface FieldProps {
  label?: string
  hint?: string
  error?: string
  className?: string
  children: ReactNode
}

export const Field = ({ label, hint, error, className, children }: FieldProps) => (
  <label className={clsx('block', className)}>
    {label ? <span className="field-label">{label}</span> : null}
    {children}
    {error ? (
      <span className="mt-1.5 block text-sm font-medium text-red-600">{error}</span>
    ) : hint ? (
      <span className="mt-1.5 block text-sm text-ink-400">{hint}</span>
    ) : null}
  </label>
)

export const Input = ({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) => (
  <input className={clsx('field-input', className)} {...props} />
)

export const Textarea = ({ className, ...props }: TextareaHTMLAttributes<HTMLTextAreaElement>) => (
  <textarea className={clsx('field-input min-h-28 resize-y', className)} {...props} />
)

export const Select = ({ className, children, ...props }: SelectHTMLAttributes<HTMLSelectElement>) => (
  <select className={clsx('field-input appearance-none pr-9', className)} {...props}>
    {children}
  </select>
)

export const Rating = ({ value, count, size = 'sm' }: { value: number; count?: number; size?: 'sm' | 'md' }) => (
  <span className="inline-flex items-center gap-1">
    <span className="flex">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={clsx(
            size === 'sm' ? 'size-3.5' : 'size-4',
            star <= Math.round(value) ? 'fill-gold-400 text-gold-400' : 'text-ink-200',
          )}
        />
      ))}
    </span>
    {count !== undefined ? <span className="text-sm text-ink-400">({count})</span> : null}
  </span>
)

export const EmptyState = ({
  title,
  description,
  action,
  icon,
}: {
  title: string
  description?: string
  action?: ReactNode
  icon?: ReactNode
}) => (
  <div className="card-surface flex flex-col items-center gap-3 px-6 py-14 text-center">
    <div className="flex size-12 items-center justify-center rounded-2xl bg-ink-50 text-ink-400">
      {icon ?? <Info className="size-5" />}
    </div>
    <h3 className="text-lg font-semibold">{title}</h3>
    {description ? <p className="max-w-md text-base text-ink-500">{description}</p> : null}
    {action}
  </div>
)

export const Skeleton = ({ className }: { className?: string }) => <div className={clsx('skeleton', className)} />

export const ErrorState = ({ message, onRetry }: { message: string; onRetry?: () => void }) => (
  <div className="flex items-start gap-3 rounded-3xl border border-red-200 bg-red-50 px-4 py-4 text-base text-ink-900 shadow-sm">
    <div className="flex size-11 min-w-[2.75rem] items-center justify-center rounded-2xl bg-red-100 text-red-600">
      <AlertCircle className="size-5" />
    </div>
    <div className="flex-1">
      <p className="font-semibold">{message}</p>
      {onRetry ? (
        <button type="button" onClick={onRetry} className="mt-2 inline-flex items-center gap-2 text-sm font-semibold text-red-600 transition hover:text-red-700">
          <span>Try again</span>
        </button>
      ) : null}
    </div>
  </div>
)

export const ToastHost = () => {
  const { toasts, dismiss } = useToastStore()
  const toastStyles = {
    success: 'border-moss-200 bg-moss-50 text-ink-900',
    error: 'border-red-200 bg-red-50 text-ink-900',
    info: 'border-sky-200 bg-sky-50 text-ink-900',
  }
  const icons = {
    success: <CheckCircle2 className="size-5 text-moss-600" />,
    error: <AlertCircle className="size-5 text-red-600" />,
    info: <Info className="size-5 text-sky-600" />,
  }
  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-6 z-100 flex flex-col items-center gap-2 px-4">
      {toasts.map((item) => (
        <div
          key={item.id}
          className={`animate-rise pointer-events-auto flex w-full max-w-md items-start gap-3 rounded-3xl border px-4 py-3 shadow-[0_18px_60px_-30px_rgba(15,23,42,0.35)] ${toastStyles[item.tone]}`}
        >
          <span className="flex size-11 min-w-[2.75rem] items-center justify-center rounded-2xl bg-white/80 shadow-sm">
            {icons[item.tone]}
          </span>
          <p className="flex-1 text-base leading-6">{item.message}</p>
          <button type="button" onClick={() => dismiss(item.id)} className="text-ink-400 transition hover:text-ink-700">
            <X className="size-4" />
          </button>
        </div>
      ))}
    </div>
  )
}
