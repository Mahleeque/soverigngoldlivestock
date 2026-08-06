import { KeyRound } from 'lucide-react'
import { useState, type FormEvent } from 'react'
import { Button } from '@/components/ui/Button'
import { Field, Input } from '@/components/ui'
import { errorMessage } from '@/lib/api'
import { useChangePassword } from '@/lib/queries'
import { toast } from '@/store/toast'

const EMPTY = { currentPassword: '', newPassword: '', confirmPassword: '' }

export const ChangePasswordForm = () => {
  const [form, setForm] = useState(EMPTY)
  const changePassword = useChangePassword()

  const submit = async (event: FormEvent) => {
    event.preventDefault()
    if (form.newPassword !== form.confirmPassword) {
      toast.error('The new passwords do not match')
      return
    }
    try {
      await changePassword.mutateAsync({
        currentPassword: form.currentPassword,
        newPassword: form.newPassword,
      })
      toast.success('Password changed')
      setForm(EMPTY)
    } catch (error) {
      toast.error(errorMessage(error))
    }
  }

  return (
    <form className="grid gap-5 sm:max-w-lg" onSubmit={submit}>
      <Field label="Current password">
        <Input
          required
          type="password"
          autoComplete="current-password"
          value={form.currentPassword}
          onChange={(event) => setForm({ ...form, currentPassword: event.target.value })}
        />
      </Field>
      <Field label="New password" hint="At least 8 characters, including a letter and a number.">
        <Input
          required
          minLength={8}
          type="password"
          autoComplete="new-password"
          value={form.newPassword}
          onChange={(event) => setForm({ ...form, newPassword: event.target.value })}
        />
      </Field>
      <Field label="Confirm new password">
        <Input
          required
          minLength={8}
          type="password"
          autoComplete="new-password"
          value={form.confirmPassword}
          onChange={(event) => setForm({ ...form, confirmPassword: event.target.value })}
        />
      </Field>
      <div>
        <Button type="submit" size="lg" loading={changePassword.isPending} icon={<KeyRound className="size-4" />}>
          Update password
        </Button>
      </div>
    </form>
  )
}
