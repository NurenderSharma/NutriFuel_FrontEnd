import { Bell, Check } from 'lucide-react'
import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useNotificationsStore } from '../store/notificationsStore'

export function NotificationsPage() {
  const items = useNotificationsStore((state) => state.items)
  const fetchNotifications = useNotificationsStore((state) => state.fetchNotifications)
  const markRead = useNotificationsStore((state) => state.markRead)
  const markAllRead = useNotificationsStore((state) => state.markAllRead)

  useEffect(() => {
    void fetchNotifications()
  }, [fetchNotifications])

  return (
    <main className="browse-main">
      <div className="browse-heading">
        <div className="section-kicker">Notifications</div>
        <h1>What's new</h1>
      </div>

      {items.length > 0 && (
        <button className="text-button" onClick={() => markAllRead()}>Mark all as read</button>
      )}

      {items.length === 0 && (
        <div className="empty-cart">
          <span><Bell size={28} /></span>
          <h3>No notifications yet.</h3>
          <p>Order updates, tier upgrades, and restaurant status changes will show up here.</p>
        </div>
      )}

      <div className="order-history-list">
        {items.map((item) => (
          <div className={item.read ? 'notification-row' : 'notification-row unread'} key={item.id}>
            {item.link ? (
              <Link to={item.link} onClick={() => !item.read && markRead(item.id)}>
                <b>{item.title}</b>
                <span>{item.message}</span>
              </Link>
            ) : (
              <div><b>{item.title}</b><span>{item.message}</span></div>
            )}
            <small>{new Date(item.createdAt).toLocaleDateString()}</small>
            {!item.read && (
              <button className="icon-button" aria-label="Mark as read" onClick={() => markRead(item.id)}>
                <Check size={14} />
              </button>
            )}
          </div>
        ))}
      </div>
    </main>
  )
}
