import { create } from 'zustand'

export type ToastTone = 'success' | 'error' | 'info'

export interface Toast {
  id: number
  tone: ToastTone
  message: string
}

interface ToastState {
  toasts: Toast[]
  push: (message: string, tone?: ToastTone) => void
  dismiss: (id: number) => void
}

let counter = 0

export const useToastStore = create<ToastState>((set) => ({
  toasts: [],
  push: (message, tone = 'info') => {
    counter += 1
    const id = counter
    set((state) => ({ toasts: [...state.toasts, { id, tone, message }] }))
    setTimeout(() => set((state) => ({ toasts: state.toasts.filter((toast) => toast.id !== id) })), 4200)
  },
  dismiss: (id) => set((state) => ({ toasts: state.toasts.filter((toast) => toast.id !== id) })),
}))

export const toast = {
  success: (message: string) => useToastStore.getState().push(message, 'success'),
  error: (message: string) => useToastStore.getState().push(message, 'error'),
  info: (message: string) => useToastStore.getState().push(message, 'info'),
}
