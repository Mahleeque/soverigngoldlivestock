import { AlertTriangle, ShieldAlert, Trash2, X } from 'lucide-react'
import { useEffect, type ReactNode } from 'react'
import { Button } from './Button'

export type ConfirmVariant = 'danger' | 'warning' | 'primary'

export interface ConfirmDialogProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void | Promise<void>
  title: string
  description?: string
  confirmText?: string
  cancelText?: string
  variant?: ConfirmVariant
  icon?: ReactNode
  loading?: boolean
  itemSummary?: {
    label?: string
    value: string
  }
}

export const ConfirmDialog = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'danger',
  icon,
  loading = false,
  itemSummary,
}: ConfirmDialogProps) => {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen && !loading) {
        onClose()
      }
    }
    if (isOpen) {
      document.body.style.overflow = 'hidden'
      window.addEventListener('keydown', handleKeyDown)
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, loading, onClose])

  if (!isOpen) return null

  const getVariantStyles = () => {
    switch (variant) {
      case 'danger':
        return {
          iconBg: 'bg-ink-100 text-ink-800 border border-ink-200',
          defaultIcon: <Trash2 className="size-5 text-ink-700" />,
          buttonVariant: 'danger' as const,
        }
      case 'warning':
        return {
          iconBg: 'bg-gold-50 text-gold-800 border border-gold-200',
          defaultIcon: <AlertTriangle className="size-5 text-gold-700" />,
          buttonVariant: 'gold' as const,
        }
      case 'primary':
      default:
        return {
          iconBg: 'bg-moss-50 text-moss-800 border border-moss-200',
          defaultIcon: <ShieldAlert className="size-5 text-moss-800" />,
          buttonVariant: 'primary' as const,
        }
    }
  }

  const { iconBg, defaultIcon, buttonVariant } = getVariantStyles()

  return (
    <div className="fixed inset-0 z-150 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-ink-950/60 backdrop-blur-xs transition-opacity"
        onClick={loading ? undefined : onClose}
        aria-hidden="true"
      />

      {/* Modal Card */}
      <div
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="confirm-dialog-title"
        aria-describedby="confirm-dialog-desc"
        className="relative w-full max-w-lg overflow-hidden rounded-3xl border border-ink-100 bg-white p-6 shadow-2xl transition-all sm:p-7"
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          disabled={loading}
          className="absolute right-5 top-5 rounded-full p-2 text-ink-400 transition hover:bg-ink-100 hover:text-ink-700 disabled:opacity-50"
          aria-label="Close"
        >
          <X className="size-5" />
        </button>

        <div className="flex items-start gap-4">
          <div className={`flex size-11 shrink-0 items-center justify-center rounded-2xl ${iconBg}`}>
            {icon ?? defaultIcon}
          </div>

          <div className="flex-1 pr-6">
            <h3 id="confirm-dialog-title" className="text-xl font-semibold text-ink-900">
              {title}
            </h3>
            {description && (
              <p id="confirm-dialog-desc" className="mt-2 text-sm leading-relaxed text-ink-600">
                {description}
              </p>
            )}
          </div>
        </div>

        {itemSummary && (
          <div className="mt-4 rounded-2xl border border-ink-100 bg-ink-50/80 px-4 py-3">
            {itemSummary.label && (
              <p className="text-xs font-semibold uppercase tracking-wider text-ink-400">
                {itemSummary.label}
              </p>
            )}
            <p className="mt-0.5 text-sm font-semibold text-ink-900 break-words">
              {itemSummary.value}
            </p>
          </div>
        )}

        <div className="mt-6 flex flex-col-reverse justify-end gap-2.5 sm:flex-row sm:items-center">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onClose}
            disabled={loading}
            className="w-full sm:w-auto"
          >
            {cancelText}
          </Button>

          <Button
            type="button"
            variant={buttonVariant}
            size="sm"
            onClick={onConfirm}
            loading={loading}
            className="w-full sm:w-auto"
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </div>
  )
}
