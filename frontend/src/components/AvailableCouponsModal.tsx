import { Check, Copy, Gift, Sparkles, Tag, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Badge, Skeleton } from '@/components/ui'
import { Button } from '@/components/ui/Button'
import { formatDate, formatNaira } from '@/lib/format'
import { useActiveCoupons } from '@/lib/queries'
import { toast } from '@/store/toast'
import type { Coupon } from '@/types'

interface AvailableCouponsModalProps {
  isOpen: boolean
  onClose: () => void
  onApply?: (code: string) => void
  subtotal?: number
}

export const AvailableCouponsModal = ({
  isOpen,
  onClose,
  onApply,
  subtotal,
}: AvailableCouponsModalProps) => {
  const { data: coupons, isLoading } = useActiveCoupons()
  const [copiedCode, setCopiedCode] = useState<string | null>(null)

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) onClose()
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
  }, [isOpen, onClose])

  if (!isOpen) return null

  const handleCopy = async (code: string) => {
    try {
      await navigator.clipboard.writeText(code)
      setCopiedCode(code)
      toast.success(`Coupon code ${code} copied to clipboard!`)
      setTimeout(() => setCopiedCode(null), 2500)
    } catch {
      toast.info(`Code: ${code}`)
    }
  }

  const handleSelect = (code: string) => {
    if (onApply) {
      onApply(code)
      onClose()
    } else {
      handleCopy(code)
    }
  }

  return (
    <div className="fixed inset-0 z-150 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-ink-950/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Card */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="coupons-modal-title"
        className="relative max-h-[85vh] w-full max-w-lg overflow-y-auto rounded-3xl border border-ink-100 bg-white p-6 shadow-2xl transition-all sm:p-7"
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-5 top-5 rounded-full p-2 text-ink-400 transition hover:bg-ink-100 hover:text-ink-700"
          aria-label="Close"
        >
          <X className="size-5" />
        </button>

        <div className="flex items-center gap-3">
          <div className="flex size-12 items-center justify-center rounded-2xl bg-gold-100 text-gold-700 border border-gold-200">
            <Gift className="size-6 text-gold-600" />
          </div>
          <div>
            <h3 id="coupons-modal-title" className="text-xl font-semibold text-ink-900">
              Active Promo Deals &amp; Coupons
            </h3>
            <p className="text-sm text-ink-500">
              Save more on livestock purchases and delivery.
            </p>
          </div>
        </div>

        <div className="mt-6 space-y-3">
          {isLoading ? (
            <div className="space-y-3">
              <Skeleton className="h-24 w-full rounded-2xl" />
              <Skeleton className="h-24 w-full rounded-2xl" />
            </div>
          ) : coupons && coupons.length > 0 ? (
            coupons.map((coupon: Coupon) => {
              const meetsMin = subtotal ? subtotal >= (coupon.minOrderAmount || 0) : true
              return (
                <div
                  key={coupon._id}
                  className={`relative overflow-hidden rounded-2xl border p-4 transition ${
                    meetsMin
                      ? 'border-gold-300/80 bg-gradient-to-br from-gold-50/50 via-white to-moss-50/30'
                      : 'border-ink-200 bg-ink-50/40 opacity-75'
                  }`}
                >
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-base font-bold tracking-wider text-ink-950">
                          {coupon.code}
                        </span>
                        <Badge tone="gold" className="text-xs">
                          {coupon.type === 'percentage' ? `${coupon.value}% OFF` : `₦${formatNaira(coupon.value).replace('₦', '')} OFF`}
                        </Badge>
                      </div>

                      <p className="mt-1.5 text-sm text-ink-600">
                        {coupon.type === 'percentage'
                          ? `Get ${coupon.value}% off your livestock order`
                          : `Get ${formatNaira(coupon.value)} flat discount`}
                        {coupon.maxDiscountAmount
                          ? ` up to ${formatNaira(coupon.maxDiscountAmount)}`
                          : ''}
                        .
                      </p>

                      <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-ink-500">
                        {coupon.minOrderAmount ? (
                          <span>Min. order: <strong className="text-ink-700">{formatNaira(coupon.minOrderAmount)}</strong></span>
                        ) : (
                          <span>No minimum order</span>
                        )}
                        {coupon.expiresAt && (
                          <span>· Valid till {formatDate(coupon.expiresAt)}</span>
                        )}
                      </div>

                      {!meetsMin && subtotal ? (
                        <p className="mt-1 text-xs font-medium text-amber-700">
                          Add {formatNaira((coupon.minOrderAmount || 0) - subtotal)} more to qualify
                        </p>
                      ) : null}
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant={onApply && meetsMin ? 'gold' : 'outline'}
                        onClick={() => handleSelect(coupon.code)}
                        className="h-9 px-3.5 text-xs font-semibold"
                        icon={
                          copiedCode === coupon.code ? (
                            <Check className="size-3.5 text-moss-600" />
                          ) : onApply && meetsMin ? (
                            <Sparkles className="size-3.5" />
                          ) : (
                            <Copy className="size-3.5" />
                          )
                        }
                      >
                        {copiedCode === coupon.code
                          ? 'Copied!'
                          : onApply && meetsMin
                            ? 'Apply'
                            : 'Copy code'}
                      </Button>
                    </div>
                  </div>
                </div>
              )
            })
          ) : (
            <div className="rounded-2xl border border-ink-100 bg-ink-50 p-6 text-center">
              <Tag className="mx-auto size-6 text-ink-400" />
              <p className="mt-2 text-base font-medium text-ink-800">No active coupons right now</p>
              <p className="mt-1 text-sm text-ink-500">
                Check back during festive seasons like Eid-el-Kabir and Christmas for exclusive promotional discounts.
              </p>
            </div>
          )}
        </div>

        <div className="mt-6 flex justify-end">
          <Button variant="outline" size="sm" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </div>
  )
}
