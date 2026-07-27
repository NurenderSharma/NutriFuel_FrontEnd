import { ArrowRight, Minus, Plus, ShoppingBag, X } from 'lucide-react'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { MacroStat } from '../components/MacroStat'
import { calculateCartSummary } from '../domain'
import { useCartStore } from '../store/cartStore'

export function CartPage() {
  const { t } = useTranslation()
  const lines = useCartStore((state) => state.lines)
  const decrementItem = useCartStore((state) => state.decrementItem)
  const removeItem = useCartStore((state) => state.removeItem)
  const addItem = useCartStore((state) => state.addItem)
  const summary = useMemo(() => calculateCartSummary(lines), [lines])

  return (
    <main className="browse-main">
      <div className="browse-heading">
        <div className="section-kicker">{t('cartPage.kicker')}</div>
        <h1>{t('cartPage.itemCount', { count: summary.itemCount })}</h1>
      </div>

      {lines.length === 0 ? (
        <div className="empty-cart">
          <span><ShoppingBag size={28} /></span>
          <h3>{t('cartPage.emptyTitle')}</h3>
          <p>{t('cartPage.emptyBody')}</p>
          <Link className="primary-button bright" to="/restaurants">{t('common.browseRestaurants')}</Link>
        </div>
      ) : (
        <div className="cart-page-layout">
          <div className="cart-lines">
            {lines.map((line) => (
              <div className="cart-line" key={line.item.id}>
                <img src={line.item.imageKey} alt="" />
                <div className="cart-line-copy">
                  <b>{line.item.name}</b>
                  <span>{t('cart.proteinCalories', { protein: line.item.nutrition.protein, calories: line.item.nutrition.calories })}</span>
                  <strong>₹{line.item.price}</strong>
                </div>
                <div className="quantity-control">
                  <button aria-label={t('cart.decreaseItem', { name: line.item.name })} onClick={() => decrementItem(line.item.id)}><Minus size={12} /></button>
                  <span>{line.quantity}</span>
                  <button aria-label={t('cart.increaseItem', { name: line.item.name })} onClick={() => addItem(line.item)}><Plus size={12} /></button>
                </div>
                <button className="remove-line" aria-label={t('cart.removeItem', { name: line.item.name })} onClick={() => removeItem(line.item.id)}><X size={14} /></button>
              </div>
            ))}
          </div>

          <div className="cart-summary-panel">
            <div className="cart-nutrition-card">
              <div className="cart-nutrition-heading"><b>{t('cart.orderNutrition')}</b><span>{t('cart.liveTotal')}</span></div>
              <div>
                <MacroStat value={`${summary.nutrition.protein}g`} label={t('nutrition.protein')} emphasis />
                <MacroStat value={`${summary.nutrition.calories}`} label={t('nutrition.calories')} />
                <MacroStat value={`${summary.nutrition.carbs}g`} label={t('nutrition.carbs')} />
                <MacroStat value={`${summary.nutrition.fat}g`} label={t('nutrition.fat')} />
              </div>
            </div>
            <div className="price-line"><span>{t('cart.subtotal')}</span><b>₹{summary.subtotal}</b></div>
            <div className="price-line muted"><span>{t('cart.delivery')}</span><b>{t('cart.free')}</b></div>
            <Link className="primary-button bright checkout-link" to="/checkout">
              {t('cartPage.proceedToCheckout')} <ArrowRight size={17} />
            </Link>
          </div>
        </div>
      )}
    </main>
  )
}
