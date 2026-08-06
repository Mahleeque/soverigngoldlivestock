const nairaFormatter = new Intl.NumberFormat('en-NG', {
  style: 'currency',
  currency: 'NGN',
  maximumFractionDigits: 0,
})

export const formatNaira = (value: number | undefined | null): string => nairaFormatter.format(value ?? 0)

export const formatDate = (value?: string | Date): string =>
  value
    ? new Date(value).toLocaleDateString('en-NG', { day: 'numeric', month: 'short', year: 'numeric' })
    : '—'

export const formatDateTime = (value?: string | Date): string =>
  value
    ? new Date(value).toLocaleString('en-NG', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    : '—'

export const formatAge = (months: number): string => {
  if (months < 12) return `${months} month${months === 1 ? '' : 's'}`
  const years = Math.floor(months / 12)
  const rest = months % 12
  return rest ? `${years}y ${rest}m` : `${years} year${years === 1 ? '' : 's'}`
}

export const titleCase = (value: string): string =>
  value
    .replace(/[_-]/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase())

export const initials = (first?: string, last?: string): string =>
  `${first?.[0] ?? ''}${last?.[0] ?? ''}`.toUpperCase() || 'SG'

export const timeUntil = (value: string): string => {
  const diff = new Date(value).getTime() - Date.now()
  if (diff <= 0) return 'expired'
  const hours = Math.floor(diff / 3_600_000)
  if (hours < 24) return `${hours}h left`
  return `${Math.floor(hours / 24)}d ${hours % 24}h left`
}

export const cleanName = (value: string): string =>
  value
    .replace(/\s*[—–-]\s*Demo\s*\d*$/i, '')
    .replace(/\bDemo\s*\d*$/i, '')
    .replace(/^\s*Demo[:\-\s]*/i, '')
    .trim()
