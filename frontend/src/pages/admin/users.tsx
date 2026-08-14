import { Ban, CheckCircle2, ShieldAlert, ShieldCheck, Trash2, UserRound } from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Badge, ConfirmDialog, EmptyState, ErrorState, Input, Select, Skeleton } from '@/components/ui'
import { errorMessage } from '@/lib/api'
import { formatDateTime, titleCase } from '@/lib/format'
import { useAdminUserMutations, useAdminUsers } from '@/lib/queries'
import { toast } from '@/store/toast'
import type { AdminUser } from '@/types'

const ROLE_TONE = { admin: 'gold', sales: 'info', customer: 'neutral' } as const

export const AdminUsersPage = () => {
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('')
  const [role, setRole] = useState('')
  const users = useAdminUsers({ search, status, role, limit: 100 })
  const { setRole: setRoleMutation, setBlocked, remove } = useAdminUserMutations()

  // Confirmation Modal States
  const [userToDelete, setUserToDelete] = useState<AdminUser | null>(null)
  const [userToBlock, setUserToBlock] = useState<AdminUser | null>(null)
  const [actionLoading, setActionLoading] = useState(false)

  const changeRole = async (user: AdminUser, nextRole: string) => {
    try {
      await setRoleMutation.mutateAsync({ id: user._id, role: nextRole })
      toast.success(`${user.firstName} is now ${nextRole}`)
    } catch (error) {
      toast.error(errorMessage(error))
    }
  }

  const handleConfirmBlock = async () => {
    if (!userToBlock) return
    setActionLoading(true)
    try {
      await setBlocked.mutateAsync({ id: userToBlock._id, blocked: !userToBlock.isBlocked })
      toast.success(userToBlock.isBlocked ? `${userToBlock.firstName} unblocked` : `${userToBlock.firstName} blocked`)
      setUserToBlock(null)
    } catch (error) {
      toast.error(errorMessage(error))
    } finally {
      setActionLoading(false)
    }
  }

  const handleConfirmDelete = async () => {
    if (!userToDelete) return
    setActionLoading(true)
    try {
      await remove.mutateAsync(userToDelete._id)
      toast.success(`User ${userToDelete.firstName} ${userToDelete.lastName} removed permanently`)
      setUserToDelete(null)
    } catch (error) {
      toast.error(errorMessage(error))
    } finally {
      setActionLoading(false)
    }
  }

  const items = users.data?.items ?? []
  const activeCount = items.filter((user) => !user.isBlocked).length

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="card-surface p-5">
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-ink-400">Accounts</p>
          <p className="mt-3 font-display text-3xl font-semibold">{users.data?.meta.total ?? items.length}</p>
        </div>
        <div className="card-surface p-5">
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-ink-400">Active</p>
          <p className="mt-3 font-display text-3xl font-semibold text-moss-600">{activeCount}</p>
        </div>
        <div className="card-surface p-5">
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-ink-400">Blocked</p>
          <p className="mt-3 font-display text-3xl font-semibold text-red-600">{items.length - activeCount}</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        <Input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search name, email or phone…"
          className="max-w-xs"
        />
        <Select value={role} onChange={(event) => setRole(event.target.value)} className="max-w-44">
          <option value="">All roles</option>
          <option value="customer">Customers</option>
          <option value="sales">Sales managers</option>
          <option value="admin">Admins</option>
        </Select>
        <Select value={status} onChange={(event) => setStatus(event.target.value)} className="max-w-44">
          <option value="">All accounts</option>
          <option value="active">Active only</option>
          <option value="blocked">Blocked only</option>
        </Select>
      </div>

      {users.isLoading ? <Skeleton className="h-72 w-full" /> : null}
      {users.isError ? <ErrorState message={errorMessage(users.error)} onRetry={users.refetch} /> : null}

      {!users.isLoading && !users.isError ? (
        <div className="card-surface overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-ink-50 text-sm uppercase tracking-wide text-ink-400">
                <tr>
                  <th className="px-5 py-4 font-semibold">User</th>
                  <th className="px-5 py-4 font-semibold">Role</th>
                  <th className="px-5 py-4 font-semibold">Last seen</th>
                  <th className="px-5 py-4 font-semibold">State</th>
                  <th className="px-5 py-4 text-right font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ink-100 text-[0.95rem]">
                {items.map((user) => (
                  <tr key={user._id} className="transition hover:bg-ink-50/60">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <span className="flex size-11 items-center justify-center rounded-2xl bg-ink-50 text-ink-500">
                          <UserRound className="size-5" />
                        </span>
                        <div>
                          <p className="font-semibold">
                            {user.firstName} {user.lastName}
                          </p>
                          <p className="text-sm text-ink-400">
                            {user.email} · {user.phone}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <Select
                        value={user.role}
                        onChange={(event) => changeRole(user, event.target.value)}
                        className="h-10 w-44 py-0 text-base"
                      >
                        <option value="customer">Customer</option>
                        <option value="sales">Sales manager</option>
                        <option value="admin">Administrator</option>
                      </Select>
                    </td>
                    <td className="px-5 py-4 text-ink-500">
                      {user.lastLoginAt ? formatDateTime(user.lastLoginAt) : 'Never signed in'}
                    </td>
                    <td className="px-5 py-4">
                      <Badge tone={user.isBlocked ? 'danger' : ROLE_TONE[user.role]}>
                        {user.isBlocked ? 'Blocked' : titleCase(user.role)}
                      </Badge>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setUserToBlock(user)}
                          disabled={user.role === 'admin'}
                          icon={
                            user.isBlocked ? <CheckCircle2 className="size-3.5" /> : <Ban className="size-3.5" />
                          }
                        >
                          {user.isBlocked ? 'Unblock' : 'Block'}
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-red-600 hover:bg-red-50"
                          onClick={() => setUserToDelete(user)}
                          disabled={user.role === 'admin'}
                          icon={<Trash2 className="size-3.5 text-red-500" />}
                        >
                          Delete
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {!items.length ? (
            <div className="p-8">
              <EmptyState
                title="No users match this filter"
                description="Try a different search term or clear the filters."
                icon={<ShieldCheck className="size-5" />}
              />
            </div>
          ) : null}
        </div>
      ) : null}

      {/* Delete User Confirmation Dialog */}
      <ConfirmDialog
        isOpen={Boolean(userToDelete)}
        onClose={() => setUserToDelete(null)}
        onConfirm={handleConfirmDelete}
        title="Delete User Account"
        description="Are you sure you want to permanently delete this user? Their account access will be revoked immediately and this action cannot be undone."
        confirmText="Yes, Delete Account"
        cancelText="Cancel"
        variant="danger"
        loading={actionLoading}
        itemSummary={
          userToDelete
            ? {
                label: 'Selected Account',
                value: `${userToDelete.firstName} ${userToDelete.lastName} (${userToDelete.email})`,
              }
            : undefined
        }
      />

      {/* Block / Unblock User Confirmation Dialog */}
      <ConfirmDialog
        isOpen={Boolean(userToBlock)}
        onClose={() => setUserToBlock(null)}
        onConfirm={handleConfirmBlock}
        title={userToBlock?.isBlocked ? 'Unblock User Account' : 'Block User Account'}
        description={
          userToBlock?.isBlocked
            ? 'This will restore the user\'s access to login, make orders and manage their livestock reservations.'
            : 'Blocking this user will prevent them from signing in, placing orders or reserving livestock on the platform.'
        }
        confirmText={userToBlock?.isBlocked ? 'Yes, Unblock' : 'Yes, Block User'}
        cancelText="Cancel"
        variant={userToBlock?.isBlocked ? 'primary' : 'warning'}
        icon={userToBlock?.isBlocked ? <CheckCircle2 className="size-6 text-moss-600" /> : <ShieldAlert className="size-6 text-amber-600" />}
        loading={actionLoading}
        itemSummary={
          userToBlock
            ? {
                label: 'User Account',
                value: `${userToBlock.firstName} ${userToBlock.lastName} (${userToBlock.email})`,
              }
            : undefined
        }
      />
    </div>
  )
}
