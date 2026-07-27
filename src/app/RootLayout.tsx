import { AnimatePresence } from 'framer-motion'
import { Bell, Heart, Menu, Moon, ShoppingBag, Sun, User, X } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, Outlet, useLocation } from 'react-router-dom'
import { CartConflictModal } from '../components/CartConflictModal'
import { CartDrawer } from '../components/CartDrawer'
import { LanguageSwitcher } from '../components/LanguageSwitcher'
import { BrandLockup } from '../components/primitives'
import { calculateCartSummary, calculateRewardPoints } from '../domain'
import { useAuthStore } from '../store/authStore'
import { useCartStore } from '../store/cartStore'
import { useDemoPointsStore } from '../store/demoPointsStore'
import { useNotificationsStore } from '../store/notificationsStore'
import { useRewardsStore } from '../store/rewardsStore'
import { useWishlistStore } from '../store/wishlistStore'

type Theme = 'light' | 'dark'

export function RootLayout() {
  const { t } = useTranslation()
  const fetchMe = useAuthStore((state) => state.fetchMe)
  const user = useAuthStore((state) => state.user)
  const location = useLocation()

  const [theme, setTheme] = useState<Theme>(() =>
    window.localStorage.getItem('nutrifuel-theme') === 'dark' ? 'dark' : 'light',
  )
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false)
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false)
  const demoPoints = useDemoPointsStore((state) => state.points)
  const rewardSummary = useRewardsStore((state) => state.summary)
  const fetchRewardSummary = useRewardsStore((state) => state.fetchSummary)
  const clearRewardSummary = useRewardsStore((state) => state.clear)
  const points = user ? rewardSummary?.points ?? 0 : demoPoints

  const fetchWishlist = useWishlistStore((state) => state.fetchWishlist)
  const clearWishlist = useWishlistStore((state) => state.clear)

  const notifications = useNotificationsStore((state) => state.items)
  const unreadCount = useNotificationsStore((state) => state.unreadCount)
  const fetchNotifications = useNotificationsStore((state) => state.fetchNotifications)
  const markNotificationRead = useNotificationsStore((state) => state.markRead)
  const clearNotifications = useNotificationsStore((state) => state.clear)

  const lines = useCartStore((state) => state.lines)
  const isCartOpen = useCartStore((state) => state.isOpen)
  const decrementItem = useCartStore((state) => state.decrementItem)
  const removeItem = useCartStore((state) => state.removeItem)
  const openCart = useCartStore((state) => state.openCart)
  const closeCart = useCartStore((state) => state.closeCart)

  useEffect(() => {
    void fetchMe()
  }, [fetchMe])

  useEffect(() => {
    if (!user) {
      clearRewardSummary()
      clearWishlist()
      clearNotifications()
      return
    }
    void fetchRewardSummary()
    void fetchWishlist()
    void fetchNotifications()
    const interval = window.setInterval(() => void fetchNotifications(), 30_000)
    return () => window.clearInterval(interval)
  }, [user, fetchRewardSummary, clearRewardSummary, fetchWishlist, clearWishlist, fetchNotifications, clearNotifications])

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    window.localStorage.setItem('nutrifuel-theme', theme)
  }, [theme])

  useEffect(() => {
    setIsMobileNavOpen(false)
    setIsNotificationsOpen(false)
  }, [location.pathname])

  const cartSummary = useMemo(() => calculateCartSummary(lines), [lines])
  const rewardPreview = useMemo(
    () =>
      lines.length
        ? calculateRewardPoints({
            orderSubtotal: cartSummary.subtotal,
            nutrition: cartSummary.nutrition,
            streakDays: 6,
            lifetimePoints: points,
          })
        : null,
    [cartSummary, lines.length, points],
  )

  return (
    <div className="app-shell">
      <header className="site-header">
        <Link className="brand-link" to="/" aria-label="NutriFuel home">
          <BrandLockup markSize={40} wordColor="var(--ink)" wordAccent="var(--green)" />
        </Link>
        <nav className="desktop-nav" aria-label="Primary navigation">
          <Link to="/#goal-studio">{t('nav.setGoal')}</Link>
          <Link to="/restaurants">{t('nav.restaurants')}</Link>
          <Link to="/search">{t('nav.search')}</Link>
          <Link to="/#rewards">{t('nav.rewards')}</Link>
        </nav>
        <div className="header-actions">
          <LanguageSwitcher />
          <button
            className="icon-button theme-toggle"
            onClick={() => setTheme((value) => (value === 'light' ? 'dark' : 'light'))}
            aria-label={theme === 'light' ? t('nav.switchToDark') : t('nav.switchToLight')}
          >
            {theme === 'light' ? <Moon size={17} /> : <Sun size={17} />}
          </button>
          {user && (
            <Link className="icon-button" to="/wishlist" aria-label={t('nav.wishlist')}>
              <Heart size={17} />
            </Link>
          )}
          {user && (
            <div className="notification-bell-wrap">
              <button
                className="icon-button"
                aria-label={t('nav.notifications')}
                onClick={() => setIsNotificationsOpen((value) => !value)}
              >
                <Bell size={17} />
                {unreadCount > 0 && <b className="notification-badge">{unreadCount}</b>}
              </button>
              {isNotificationsOpen && (
                <div className="notification-dropdown">
                  {notifications.length === 0 && <p className="browse-status">{t('nav.noNotificationsYet')}</p>}
                  {notifications.slice(0, 6).map((notification) => (
                    <Link
                      key={notification.id}
                      to={notification.link ?? '/notifications'}
                      className={notification.read ? 'notification-dropdown-item' : 'notification-dropdown-item unread'}
                      onClick={() => !notification.read && markNotificationRead(notification.id)}
                    >
                      <b>{notification.title}</b>
                      <span>{notification.message}</span>
                    </Link>
                  ))}
                  <Link className="text-button" to="/notifications">{t('nav.viewAll')}</Link>
                </div>
              )}
            </div>
          )}
          {user?.role === 'admin' && <Link className="text-button" to="/admin">{t('nav.admin')}</Link>}
          {user?.role === 'restaurant_owner' && <Link className="text-button" to="/restaurant-admin">{t('nav.restaurantDashboard')}</Link>}
          <Link className="profile-button" to={user ? '/profile' : '/login'} aria-label={user ? t('nav.openProfile') : t('common.signIn')}>
            <User size={16} />
            <span>{user ? user.name : t('common.signIn')}</span>
          </Link>
          <button className="cart-button" onClick={openCart} aria-label={t('nav.openCart', { count: cartSummary.itemCount })}>
            <ShoppingBag size={18} />
            <span>{t('nav.cart')}</span>
            {cartSummary.itemCount > 0 && <b>{cartSummary.itemCount}</b>}
          </button>
          <button
            className="icon-button mobile-nav-toggle"
            onClick={() => setIsMobileNavOpen((value) => !value)}
            aria-label={isMobileNavOpen ? t('nav.closeMenu') : t('nav.openMenu')}
            aria-expanded={isMobileNavOpen}
          >
            {isMobileNavOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </header>

      {isMobileNavOpen && (
        <nav className="mobile-nav" aria-label="Mobile navigation">
          <Link to="/#goal-studio">{t('nav.setGoal')}</Link>
          <Link to="/restaurants">{t('nav.restaurants')}</Link>
          <Link to="/search">{t('nav.search')}</Link>
          <Link to="/#rewards">{t('nav.rewards')}</Link>
          <Link to="/trending">{t('nav.trending')}</Link>
          <Link to="/popular-restaurants">{t('nav.popularRestaurants')}</Link>
          <Link to="/recently-viewed">{t('nav.recentlyViewed')}</Link>
          {user && <Link to="/wishlist">{t('nav.wishlist')}</Link>}
          {user && <Link to="/notifications">{t('nav.notifications')}</Link>}
          {user && <Link to="/meal-planner">{t('nav.mealPlanner')}</Link>}
          {user && <Link to="/addresses">{t('nav.savedAddresses')}</Link>}
          {user?.role === 'admin' && <Link to="/admin">{t('nav.admin')}</Link>}
          {user?.role === 'restaurant_owner' && <Link to="/restaurant-admin">{t('nav.restaurantDashboard')}</Link>}
          <Link to={user ? '/profile' : '/login'}>{user ? user.name : t('common.signIn')}</Link>
        </nav>
      )}

      <Outlet />

      <footer>
        <div className="footer-brand">
          <BrandLockup markSize={38} wordColor="var(--cream)" wordAccent="var(--lime)" />
          <p>{t('footer.tagline')}</p>
        </div>

        <div className="footer-columns">
          <div>
            <b>{t('footer.company')}</b>
            <Link to="/about">{t('footer.about')}</Link>
            <Link to="/careers">{t('footer.careers')}</Link>
            <Link to="/contact">{t('footer.contact')}</Link>
          </div>
          <div>
            <b>{t('footer.discover')}</b>
            <Link to="/cuisines">{t('footer.cuisines')}</Link>
            <Link to="/trending">{t('footer.trending')}</Link>
            <Link to="/popular-restaurants">{t('footer.popularRestaurants')}</Link>
            <Link to="/blog">{t('footer.blog')}</Link>
          </div>
          <div>
            <b>{t('footer.support')}</b>
            <Link to="/help">{t('footer.helpCenter')}</Link>
            <Link to="/faq">{t('footer.faq')}</Link>
            <Link to="/refund-policy">{t('footer.refunds')}</Link>
            <Link to="/accessibility">{t('footer.accessibility')}</Link>
          </div>
          <div>
            <b>{t('footer.partners')}</b>
            <Link to="/partner-with-us">{t('footer.becomePartner')}</Link>
            <Link to="/referral">{t('footer.referralProgram')}</Link>
            <Link to="/gift-cards">{t('footer.giftCards')}</Link>
          </div>
          <div>
            <b>{t('footer.legal')}</b>
            <Link to="/privacy">{t('footer.privacy')}</Link>
            <Link to="/terms">{t('footer.terms')}</Link>
          </div>
        </div>

        <span>{t('footer.copyright')}</span>
      </footer>

      <AnimatePresence>
        {isCartOpen && (
          <CartDrawer
            lines={lines}
            summary={cartSummary}
            rewardPreview={rewardPreview}
            onClose={closeCart}
            onDecrement={decrementItem}
            onIncrement={(item) => useCartStore.getState().addItem(item)}
            onRemove={removeItem}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        <CartConflictModal />
      </AnimatePresence>
    </div>
  )
}
