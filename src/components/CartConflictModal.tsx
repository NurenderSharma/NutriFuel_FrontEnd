import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { useCartStore } from '../store/cartStore'

export function CartConflictModal() {
  const { t } = useTranslation()
  const pendingConflict = useCartStore((state) => state.pendingConflict)
  const resolveConflict = useCartStore((state) => state.resolveConflict)

  if (!pendingConflict) return null

  return (
    <motion.div className="success-layer" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <motion.div className="success-card conflict-card" initial={{ scale: 0.9, y: 12 }} animate={{ scale: 1, y: 0 }}>
        <h2>{t('cartConflict.title')}</h2>
        <p>{t('cartConflict.body')}</p>
        <div className="conflict-actions">
          <button className="text-button" onClick={() => resolveConflict('cancel')}>{t('cartConflict.keepCurrent')}</button>
          <button className="primary-button bright" onClick={() => resolveConflict('replace')}>{t('cartConflict.clearAndAdd')}</button>
        </div>
      </motion.div>
    </motion.div>
  )
}
