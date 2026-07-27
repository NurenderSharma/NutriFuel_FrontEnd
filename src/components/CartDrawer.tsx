import { motion } from 'framer-motion'
import { ArrowRight, Minus, Plus, ShieldCheck, ShoppingBag, Target, X, Zap } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import type { calculateCartSummary, calculateRewardPoints } from '../domain'
import type { FoodItem } from '../domain'
import type { useCartStore } from '../store/cartStore'
import { MacroStat } from './MacroStat'

interface CartDrawerProps {
  lines: ReturnType<typeof useCartStore.getState>['lines']
  summary: ReturnType<typeof calculateCartSummary>
  rewardPreview: ReturnType<typeof calculateRewardPoints> | null
  onClose: () => void
  onDecrement: (id: string) => void
  onIncrement: (item: FoodItem) => void
  onRemove: (id: string) => void
}

export function CartDrawer({ lines, summary, rewardPreview, onClose, onDecrement, onIncrement, onRemove }: CartDrawerProps) {
  const { t } = useTranslation()
  const navigate = useNavigate()

  return (
    <motion.div className="drawer-layer" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <button className="drawer-backdrop" aria-label={t('cart.closeCart')} onClick={onClose} />
      <motion.aside className="cart-drawer" initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'spring', damping: 30, stiffness: 280 }} aria-label={t('nav.cart')}>
        <div className="drawer-header">
          <div>
            <span>{t('cart.yourFuel')}</span>
            <h2>{t('cart.itemCount', { count: summary.itemCount })}</h2>
          </div>
          <button className="icon-button" aria-label={t('cart.closeCart')} onClick={onClose}><X size={19} /></button>
        </div>

        <div className="drawer-content">
          {lines.length === 0 ? (
            <div className="empty-cart">
              <span><ShoppingBag size={28} /></span>
              <h3>{t('cart.emptyTitle')}</h3>
              <p>{t('cart.emptyBody')}</p>
              <button onClick={onClose}>{t('cart.exploreMatches')}</button>
            </div>
          ) : (
            <>
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
                      <button aria-label={t('cart.decreaseItem', { name: line.item.name })} onClick={() => onDecrement(line.item.id)}><Minus size={12} /></button>
                      <span>{line.quantity}</span>
                      <button aria-label={t('cart.increaseItem', { name: line.item.name })} onClick={() => onIncrement(line.item)}><Plus size={12} /></button>
                    </div>
                    <button className="remove-line" aria-label={t('cart.removeItem', { name: line.item.name })} onClick={() => onRemove(line.item.id)}><X size={14} /></button>
                  </div>
                ))}
              </div>

              <div className="cart-nutrition-card">
                <div className="cart-nutrition-heading"><Target size={16} /><b>{t('cart.orderNutrition')}</b><span>{t('cart.liveTotal')}</span></div>
                <div>
                  <MacroStat value={`${summary.nutrition.protein}g`} label={t('nutrition.protein')} emphasis />
                  <MacroStat value={`${summary.nutrition.calories}`} label={t('nutrition.calories')} />
                  <MacroStat value={`${summary.nutrition.carbs}g`} label={t('nutrition.carbs')} />
                  <MacroStat value={`${summary.nutrition.fat}g`} label={t('nutrition.fat')} />
                </div>
              </div>

              {rewardPreview && (
                <div className="points-preview"><Zap size={17} fill="currentColor" /><span><b>{t('cart.fuelPointsEarned', { points: rewardPreview.pointsEarned })}</b><small>{rewardPreview.goalMatched ? t('cart.goalBonusIncluded') : t('cart.goalBonusUnlocks')}</small></span></div>
              )}
            </>
          )}
        </div>
        {lines.length > 0 && (
          <div className="drawer-footer">
            <div className="price-line"><span>{t('cart.subtotal')}</span><b>₹{summary.subtotal}</b></div>
            <div className="price-line muted"><span>{t('cart.delivery')}</span><b>{t('cart.free')}</b></div>
            <button
              className="checkout-button"
              onClick={() => {
                onClose()
                navigate('/checkout')
              }}
            >
              {t('cart.continueToCheckout')} <ArrowRight size={17} />
            </button>
            <small><ShieldCheck size={13} /> {t('cart.secureCheckout')}</small>
          </div>
        )}
      </motion.aside>
    </motion.div>
  )
}
