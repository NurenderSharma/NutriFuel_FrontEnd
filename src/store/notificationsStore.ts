import { create } from 'zustand'
import { apiClient } from '../lib/apiClient'

export interface NotificationItem {
  id: string
  type: 'order_status' | 'reward_tier' | 'restaurant_status'
  title: string
  message: string
  link: string | null
  read: boolean
  createdAt: string
}

interface NotificationsStore {
  items: NotificationItem[]
  unreadCount: number
  fetchNotifications: () => Promise<void>
  markRead: (id: string) => Promise<void>
  markAllRead: () => Promise<void>
  clear: () => void
}

export const useNotificationsStore = create<NotificationsStore>((set, get) => ({
  items: [],
  unreadCount: 0,

  fetchNotifications: async () => {
    try {
      const response = await apiClient.getPage<NotificationItem>('/notifications/me?limit=20')
      set({ items: response.data, unreadCount: (response.meta as { unreadCount?: number }).unreadCount ?? 0 })
    } catch {
      // leave existing state as-is on a transient failure
    }
  },

  markRead: async (id: string) => {
    set({
      items: get().items.map((item) => (item.id === id ? { ...item, read: true } : item)),
      unreadCount: Math.max(0, get().unreadCount - 1),
    })
    await apiClient.patch(`/notifications/${id}/read`).catch(() => undefined)
  },

  markAllRead: async () => {
    set({ items: get().items.map((item) => ({ ...item, read: true })), unreadCount: 0 })
    await apiClient.patch('/notifications/read-all').catch(() => undefined)
  },

  clear: () => set({ items: [], unreadCount: 0 }),
}))
