import { ArrowRight, Lock, Mail } from 'lucide-react'
import { useState, type FormEvent, type ReactNode } from 'react'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import { Logo } from '@/components/Logo'
import { Button } from '@/components/ui/Button'
import { Field, Input } from '@/components/ui'
import { errorMessage, http, unwrap } from '@/lib/api'
import { HERO_IMAGE } from '@/lib/media'
import { isStaff, useAuthStore } from '@/store/auth'
import { toast } from '@/store/toast'

const AuthShell = ({ title, subtitle, children, footer }: { title: string; subtitle: string; children: ReactNode; footer: ReactNode }) => (
  <div className="grid min-h-[calc(100vh-4.5rem)] lg:grid-cols-2">
    <div className="relative hidden lg:block">
      <img src={HERO_IMAGE} alt="" className="absolute inset-0 size-full object-cover" />
      <div className="absolute inset-0 bg-linear-to-t from-ink-950 via-ink-950/70 to-ink-950/30" />
      <div className="relative flex h-full flex-col justify-between p-12">
        <Logo tone="light" />
        <div>
          <h2 className="max-w-md font-display text-3xl font-semibold text-white">
            Livestock you can trace, from pen to plate.
          </h2>
          <p className="mt-4 max-w-md text-ink-200">
            Track orders, save favourites and reserve animals ahead of the festive rush.
          </p>
        </div>
      </div>
    </div>

    <div className="flex items-center justify-center px-6 py-14">
      <div className="w-full max-w-md">
        <h1 className="text-3xl font-semibold">{title}</h1>
        <p className="mt-2 text-ink-500">{subtitle}</p>
        {children}
        <div className="mt-8 text-center text-base text-ink-500">{footer}</div>
      </div>
    </div>
  </div>
)

export const LoginPage = () => {
  const login = useAuthStore((state) => state.login)
  const user = useAuthStore((state) => state.user)
  const navigate = useNavigate()
  const location = useLocation()
  const [form, setForm] = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)

  const submit = async (event: FormEvent) => {
    event.preventDefault()
    setLoading(true)
    try {
      const user = await login(form)
      toast.success(`Welcome back, ${user.firstName}`)
      const from = (location.state as { from?: string } | null)?.from
      navigate(from ?? (isStaff(user.role) ? '/admin' : '/account'))
    } catch (error) {
      toast.error(errorMessage(error, 'Invalid email or password'))
    } finally {
      setLoading(false)
    }
  }

  if (user) return <Navigate to={isStaff(user.role) ? '/admin' : '/account'} replace />

  return (
    <AuthShell
      title="Welcome back"
      subtitle="Sign in to manage your orders and reservations."
      footer={
        <>
          New here?{' '}
          <Link to="/register" className="font-semibold text-moss-600 hover:underline">
            Create an account
          </Link>
        </>
      }
    >
      <form className="mt-8 space-y-4" onSubmit={submit}>
        <Field label="Email address">
          <div className="relative">
            <Mail className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-ink-300" />
            <Input
              required
              type="email"
              autoComplete="email"
              className="pl-11"
              value={form.email}
              onChange={(event) => setForm({ ...form, email: event.target.value })}
              placeholder="you@example.com"
            />
          </div>
        </Field>
        <Field label="Password">
          <div className="relative">
            <Lock className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-ink-300" />
            <Input
              required
              type="password"
              autoComplete="current-password"
              className="pl-11"
              value={form.password}
              onChange={(event) => setForm({ ...form, password: event.target.value })}
              placeholder="••••••••"
            />
          </div>
        </Field>
        <div className="flex justify-end">
          <Link to="/forgot-password" className="text-base font-medium text-ink-500 hover:text-ink-800">
            Forgot password?
          </Link>
        </div>
        <Button type="submit" size="lg" className="w-full" loading={loading} icon={<ArrowRight className="size-4" />}>
          Sign in
        </Button>
      </form>
    </AuthShell>
  )
}

export const RegisterPage = () => {
  const register = useAuthStore((state) => state.register)
  const user = useAuthStore((state) => state.user)
  const navigate = useNavigate()
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', phone: '', password: '' })
  const [loading, setLoading] = useState(false)

  const submit = async (event: FormEvent) => {
    event.preventDefault()
    setLoading(true)
    try {
      const user = await register(form)
      toast.success(`Account created — welcome, ${user.firstName}`)
      navigate('/account')
    } catch (error) {
      toast.error(errorMessage(error, 'Could not create your account'))
    } finally {
      setLoading(false)
    }
  }

  if (user) return <Navigate to={isStaff(user.role) ? '/admin' : '/account'} replace />

  return (
    <AuthShell
      title="Create your account"
      subtitle="Save favourites, reserve livestock and track deliveries."
      footer={
        <>
          Already registered?{' '}
          <Link to="/login" className="font-semibold text-moss-600 hover:underline">
            Sign in
          </Link>
        </>
      }
    >
      <form className="mt-8 space-y-4" onSubmit={submit}>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="First name">
            <Input
              required
              value={form.firstName}
              onChange={(event) => setForm({ ...form, firstName: event.target.value })}
              placeholder="Amina"
            />
          </Field>
          <Field label="Last name">
            <Input
              required
              value={form.lastName}
              onChange={(event) => setForm({ ...form, lastName: event.target.value })}
              placeholder="Yusuf"
            />
          </Field>
        </div>
        <Field label="Email address">
          <Input
            required
            type="email"
            autoComplete="email"
            value={form.email}
            onChange={(event) => setForm({ ...form, email: event.target.value })}
            placeholder="you@example.com"
          />
        </Field>
        <Field label="Phone number">
          <Input
            required
            value={form.phone}
            onChange={(event) => setForm({ ...form, phone: event.target.value })}
            placeholder="+2348012345678"
          />
        </Field>
        <Field label="Password" hint="At least 8 characters with a number.">
          <Input
            required
            type="password"
            minLength={8}
            autoComplete="new-password"
            value={form.password}
            onChange={(event) => setForm({ ...form, password: event.target.value })}
            placeholder="••••••••"
          />
        </Field>
        <Button type="submit" size="lg" className="w-full" loading={loading} icon={<ArrowRight className="size-4" />}>
          Create account
        </Button>
      </form>
    </AuthShell>
  )
}

export const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)

  const submit = async (event: FormEvent) => {
    event.preventDefault()
    setLoading(true)
    try {
      await unwrap(http.post('/auth/forgot-password', { email }))
      setSent(true)
    } catch (error) {
      toast.error(errorMessage(error))
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthShell
      title="Reset your password"
      subtitle="We'll email you a secure reset link."
      footer={
        <Link to="/login" className="font-semibold text-moss-600 hover:underline">
          Back to sign in
        </Link>
      }
    >
      {sent ? (
        <p className="mt-8 rounded-2xl bg-moss-50 px-5 py-4 text-base text-moss-700">
          If an account exists for {email}, a reset link is on its way.
        </p>
      ) : (
        <form className="mt-8 space-y-4" onSubmit={submit}>
          <Field label="Email address">
            <Input
              required
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@example.com"
            />
          </Field>
          <Button type="submit" size="lg" className="w-full" loading={loading}>
            Send reset link
          </Button>
        </form>
      )}
    </AuthShell>
  )
}
