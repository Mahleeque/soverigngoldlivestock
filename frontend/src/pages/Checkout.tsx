import { BadgePercent, CreditCard, Gift, Landmark, Lock, MapPin } from 'lucide-react'

import { useMemo, useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { AvailableCouponsModal } from '@/components/AvailableCouponsModal'
import { Button, ButtonLink } from '@/components/ui/Button'
import { Badge, Field, Input, Select } from '@/components/ui'
import { errorMessage } from '@/lib/api'
import { formatNaira } from '@/lib/format'
import {
  useCreateOrder,
  useDeliveryZones,
  useInitializePayment,
  useProfile,
  useValidateCoupon,
} from '@/lib/queries'
import { useAuthStore } from '@/store/auth'
import { cartSubtotal, useCartStore } from '@/store/cart'
import { toast } from '@/store/toast'

type PaymentChoice = 'paystack' | 'flutterwave' | 'bank_transfer'

const PAYMENT_OPTIONS: { value: PaymentChoice; label: string; description: string; icon: typeof CreditCard }[] = [
  { value: 'paystack', label: 'Paystack', description: 'Card, bank & USSD — instant confirmation', icon: CreditCard },
  { value: 'flutterwave', label: 'Flutterwave', description: 'Card & mobile money across Africa', icon: CreditCard },
  { value: 'bank_transfer', label: 'Bank transfer', description: 'Direct transfer to our official OPay account', icon: Landmark },
]


export const CheckoutPage = () => {
  const navigate = useNavigate()
  const user = useAuthStore((state) => state.user)
  const profile = useProfile(Boolean(user))
  const { lines, clear } = useCartStore()
  const zones = useDeliveryZones()
  const createOrder = useCreateOrder()
  const validateCoupon = useValidateCoupon()
  const initializePayment = useInitializePayment()

  const [couponCode, setCouponCode] = useState('')
  const [discount, setDiscount] = useState(0)
  const [appliedCoupon, setAppliedCoupon] = useState('')
  const [couponsModalOpen, setCouponsModalOpen] = useState(false)
  const [payment, setPayment] = useState<PaymentChoice>('paystack')
  const [form, setForm] = useState({
    fullName: '',
    phone: '',
    addressLine: '',
    city: '',
    state: '',
  })

  const subtotal = cartSubtotal(lines)
  const stateOptions = useMemo(
    () =>
      zones.data
        ?.flatMap((z) => z.states.map((s) => ({ state: s, zoneId: z._id, fee: z.baseFee, zoneName: z.name, estMin: z.estimatedDaysMin, estMax: z.estimatedDaysMax })))
        ?? [],
    [zones.data],
  )

  const selectedState = stateOptions.find((o) => o.state === form.state)
  const deliveryFee = selectedState?.fee ?? 0
  const total = Math.max(subtotal + deliveryFee - discount, 0)

  const prefill = () => {
    const address = profile.data?.addresses?.find((item) => item.isDefault) ?? profile.data?.addresses?.[0]
    setForm({
      fullName: profile.data ? `${profile.data.firstName} ${profile.data.lastName}` : '',
      phone: profile.data?.phone ?? '',
      addressLine: address?.addressLine ?? '',
      city: address?.city ?? '',
      state: address?.state ?? '',
    })
  }

  const applyCouponWithCode = async (codeToUse: string) => {
    const clean = codeToUse.trim()
    if (!clean) return
    try {
      const result = await validateCoupon.mutateAsync({ code: clean, subtotal })
      setDiscount(result.discount)
      setAppliedCoupon(result.coupon.code)
      setCouponCode(result.coupon.code)
      toast.success(`Coupon applied — you saved ${formatNaira(result.discount)}`)
    } catch (error) {
      setDiscount(0)
      setAppliedCoupon('')
      toast.error(errorMessage(error, 'That coupon is not valid.'))
    }
  }

  const applyCoupon = () => applyCouponWithCode(couponCode)

  const submit = async (event: FormEvent) => {
    event.preventDefault()
    if (!user) {
      toast.info('Sign in to complete your order')
      navigate('/login', { state: { from: '/checkout' } })
      return
    }
    if (!lines.length) {
      toast.error('Your cart is empty')
      return
    }

    try {
      const order = await createOrder.mutateAsync({
        items: lines.map((line) => ({ animal: line.animalId, quantity: line.quantity })),
        deliveryAddress: form,
        deliveryFee,
        couponCode: appliedCoupon || undefined,
      })

      if (payment === 'paystack' || payment === 'flutterwave') {
        try {
          const initialized = await initializePayment.mutateAsync({
            orderId: order._id,
            provider: payment,
            email: user.email,
          })
          clear()
          if (initialized.authorizationUrl) {
            window.location.href = initialized.authorizationUrl
            return
          }
          navigate(`/order-confirmed/${order._id}`)
          return
        } catch (paymentError) {
          clear()
          toast.info(errorMessage(paymentError, 'Order placed — online payment is unavailable right now.'))
          navigate(`/order-confirmed/${order._id}`)
          return
        }
      }

      clear()
      toast.success('Order placed successfully')
      navigate(`/order-confirmed/${order._id}`)
    } catch (error) {
      toast.error(errorMessage(error))
    }
  }

  if (!lines.length) {
    return (
      <div className="container-page py-20 text-center">
        <h1 className="text-2xl font-semibold">Nothing to check out</h1>
        <p className="mt-2 text-ink-500">Add livestock to your cart first.</p>
        <Button className="mt-6" onClick={() => navigate('/animals')}>
          Browse livestock
        </Button>
      </div>
    )
  }

  return (
    <div className="bg-ink-50 pb-20">
      <div className="container-page py-10">
        <h1 className="text-3xl font-semibold sm:text-4xl">Checkout</h1>
        <p className="mt-2 text-ink-500">Delivery details, discounts and payment — all in one step.</p>

        {!user ? (
          <div className="mt-6 flex flex-wrap items-center justify-between gap-3 rounded-3xl border border-gold-200 bg-gold-50 px-5 py-4">
            <p className="text-base text-ink-700">
              You need an account to place an order — your cart is saved while you sign in.
            </p>
            <Button type="button" size="sm" onClick={() => navigate('/login', { state: { from: '/checkout' } })}>
              Sign in to continue
            </Button>
          </div>
        ) : null}

        <form className="mt-8 grid gap-8 lg:grid-cols-[1.5fr_1fr]" onSubmit={submit}>
          <div className="space-y-6">
            <section className="card-surface p-6">
              <div className="flex items-center justify-between gap-4">
                <h2 className="flex items-center gap-2 text-lg font-semibold">
                  <MapPin className="size-4 text-ink-400" /> Delivery address
                </h2>
                {profile.data?.addresses?.length ? (
                  <Button type="button" variant="ghost" size="sm" onClick={prefill}>
                    Use saved address
                  </Button>
                ) : null}
              </div>

              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <Field label="Full name">
                  <Input
                    required
                    value={form.fullName}
                    onChange={(event) => setForm({ ...form, fullName: event.target.value })}
                    placeholder="Amina Yusuf"
                  />
                </Field>
                <Field label="Phone number">
                  <Input
                    required
                    value={form.phone}
                    onChange={(event) => setForm({ ...form, phone: event.target.value })}
                    placeholder="+234 801 234 5678"
                  />
                </Field>
                <Field label="Street address" className="sm:col-span-2">
                  <Input
                    required
                    value={form.addressLine}
                    onChange={(event) => setForm({ ...form, addressLine: event.target.value })}
                    placeholder="24 Awolowo Road, Ikoyi"
                  />
                </Field>
                <Field label="City">
                  <Input
                    required
                    value={form.city}
                    onChange={(event) => setForm({ ...form, city: event.target.value })}
                    placeholder="Lagos"
                  />
                </Field>
                <Field label="State">
                  <Select
                    required
                    value={form.state}
                    onChange={(event) => setForm({ ...form, state: event.target.value })}
                  >
                    <option value="">Select state</option>
                    {stateOptions.map((opt) => (
                      <option key={`${opt.zoneId}-${opt.state}`} value={opt.state}>
                        {opt.state} — {opt.zoneName} — {formatNaira(opt.fee)} ({opt.estMin}–{opt.estMax} days)
                      </option>
                    ))}
                  </Select>
                </Field>
              </div>
            </section>

            {/* Delivery zone is now selected by state above; fees show alongside each state in the state dropdown. */}

            <section className="card-surface p-6">
              <h2 className="flex items-center gap-2 text-lg font-semibold">
                <Lock className="size-4 text-ink-400" /> Payment method
              </h2>
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                {PAYMENT_OPTIONS.map((option) => (
                  <label
                    key={option.value}
                    className={`flex cursor-pointer gap-3 rounded-2xl border p-4 transition ${
                      payment === option.value
                        ? 'border-moss-500 bg-moss-50/60 ring-4 ring-moss-500/10'
                        : 'border-ink-200 hover:border-ink-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment"
                      value={option.value}
                      checked={payment === option.value}
                      onChange={() => setPayment(option.value)}
                      className="mt-1 size-4 text-moss-600 focus:ring-moss-500"
                    />
                    <span>
                      <span className="flex items-center gap-2 text-base font-semibold">
                        <option.icon className="size-4 text-ink-400" />
                        {option.label}
                      </span>
                      <span className="mt-1 block text-sm text-ink-500">{option.description}</span>
                    </span>
                  </label>
                ))}
              </div>
              {payment === 'bank_transfer' ? (
                user ? (
                  <div className="mt-4 rounded-2xl border border-gold-200 bg-gold-50/70 p-5">
                    <div className="flex items-center gap-2">
                      <Landmark className="size-4 text-gold-700" />
                      <h3 className="text-sm font-semibold text-ink-900">Official Bank Transfer / OPay Details</h3>
                    </div>
                    <p className="mt-2 text-xs leading-relaxed text-ink-600">
                      Transfer to the official farm account below. Your livestock order will be verified immediately upon receipt.
                    </p>
                    <div className="mt-4 grid gap-3 rounded-xl border border-gold-200/80 bg-white p-4 sm:grid-cols-2">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wider text-ink-400">Account Number</p>
                        <p className="font-mono text-lg font-bold tracking-wider text-ink-900">7069185859</p>
                        <p className="text-xs font-medium text-ink-500">OPay / PalmPay</p>
                      </div>
                      <div className="sm:text-right">
                        <p className="text-xs font-semibold uppercase tracking-wider text-ink-400">Account Name</p>
                        <p className="text-sm font-bold text-ink-900">Ibrahim Adewale Shittu</p>
                        <p className="text-xs text-ink-500">Sovereign Gold Livestock</p>
                      </div>
                    </div>
                    <div className="mt-4 flex justify-end">
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        onClick={async () => {
                          try {
                            await navigator.clipboard.writeText('7069185859')
                            toast.success('Account number copied to clipboard!')
                          } catch {
                            toast.info('Account number: 7069185859')
                          }
                        }}
                      >
                        Copy account number
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="mt-4 rounded-2xl border border-ink-200 bg-ink-50/80 p-5">
                    <div className="flex items-center gap-3">
                      <div className="flex size-10 shrink-0 items-center justify-center rounded-2xl bg-ink-200 text-ink-700">
                        <Lock className="size-5" />
                      </div>
                      <div>
                        <h3 className="text-sm font-semibold text-ink-900">Sign in required to view bank details</h3>
                        <p className="mt-0.5 text-xs leading-relaxed text-ink-600">
                          Official farm bank account &amp; OPay payment details are displayed once you are signed into your account.
                        </p>
                      </div>
                    </div>
                    <div className="mt-4 flex justify-end">
                      <ButtonLink to="/login" state={{ from: '/checkout' }} variant="outline" size="sm">
                        Sign in to view account details
                      </ButtonLink>
                    </div>
                  </div>
                )
              ) : null}
            </section>
          </div>

          <aside className="card-surface h-fit p-6 lg:sticky lg:top-24">
            <h2 className="text-lg font-semibold">Order summary</h2>

            <ul className="mt-5 space-y-3">
              {lines.map((line) => (
                <li key={line.animalId} className="flex items-center gap-3">
                  <span className="size-12 shrink-0 overflow-hidden rounded-xl bg-ink-100">
                    {line.image ? <img src={line.image} alt="" className="size-full object-cover" /> : null}
                  </span>
                  <span className="flex-1 text-base">
                    <span className="block font-medium">{line.name}</span>
                    <span className="text-sm text-ink-400">Qty {line.quantity}</span>
                  </span>
                  <span className="text-base font-semibold">{formatNaira(line.unitPrice * line.quantity)}</span>
                </li>
              ))}
            </ul>

            <div className="mt-5 border-t border-ink-100 pt-5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="field-label mb-0 flex items-center gap-2 font-semibold text-ink-800">
                  <BadgePercent className="size-4 text-ink-400" /> Coupon code
                </p>
                <button
                  type="button"
                  onClick={() => setCouponsModalOpen(true)}
                  className="inline-flex items-center gap-1.5 rounded-full border border-gold-300 bg-gold-50 px-3.5 py-1.5 text-xs font-bold text-gold-900 shadow-xs transition hover:bg-gold-100 hover:scale-102"
                >
                  <Gift className="size-3.5 text-gold-600" />
                  <span>View Available Deals</span>
                </button>
              </div>
              <div className="mt-3 flex gap-2">
                <Input
                  value={couponCode}
                  onChange={(event) => setCouponCode(event.target.value.toUpperCase())}
                  placeholder="e.g. SALLAH10"
                />
                <Button type="button" variant="outline" onClick={applyCoupon} loading={validateCoupon.isPending}>
                  Apply
                </Button>
              </div>

              {appliedCoupon ? (
                <div className="mt-2 flex items-center justify-between">
                  <Badge tone="success">
                    {appliedCoupon} applied
                  </Badge>
                  <button
                    type="button"
                    onClick={() => {
                      setAppliedCoupon('')
                      setDiscount(0)
                      setCouponCode('')
                      toast.info('Coupon removed')
                    }}
                    className="text-xs text-ink-400 hover:text-red-600"
                  >
                    Remove
                  </button>
                </div>
              ) : null}
            </div>

            <dl className="mt-5 space-y-2.5 border-t border-ink-100 pt-5 text-base">
              <div className="flex justify-between">
                <dt className="text-ink-500">Subtotal</dt>
                <dd className="font-semibold">{formatNaira(subtotal)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-ink-500">Delivery</dt>
                <dd className="font-semibold">{deliveryFee ? formatNaira(deliveryFee) : '—'}</dd>
              </div>
              {discount ? (
                <div className="flex justify-between text-moss-600">
                  <dt>Discount</dt>
                  <dd className="font-semibold">−{formatNaira(discount)}</dd>
                </div>
              ) : null}
            </dl>

            <div className="mt-4 flex items-end justify-between border-t border-ink-100 pt-4">
              <span className="font-semibold">Total</span>
              <span className="font-display text-2xl font-semibold">{formatNaira(total)}</span>
            </div>
            <p className="mt-1 text-right text-sm text-ink-400">
              Deposit today: {formatNaira(Math.round(total * 0.3))}
            </p>

            <Button
              type="submit"
              size="lg"
              className="mt-6 w-full"
              loading={createOrder.isPending || initializePayment.isPending}
            >
              Place order
            </Button>
            <p className="mt-3 flex items-center justify-center gap-1.5 text-sm text-ink-400">
              <Lock className="size-3" /> Secured by Paystack &amp; Flutterwave
            </p>
          </aside>
        </form>
      </div>

      <AvailableCouponsModal
        isOpen={couponsModalOpen}
        onClose={() => setCouponsModalOpen(false)}
        onApply={(code) => applyCouponWithCode(code)}
        subtotal={subtotal}
      />
    </div>
  )
}

