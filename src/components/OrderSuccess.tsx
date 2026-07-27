import { motion } from 'framer-motion'
import { ArrowRight, Check, Flame, X } from 'lucide-react'
import { useTranslation } from 'react-i18next'

export function OrderSuccess({ onClose }: { onClose: () => void }) {
  const { t } = useTranslation()
  return (
    <motion.div className="success-layer" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <div className="confetti" aria-hidden="true">{Array.from({ length: 18 }, (_, index) => <i key={index} style={{ '--i': index } as React.CSSProperties} />)}</div>
      <motion.div className="success-card" initial={{ scale: 0.86, y: 18 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0 }} transition={{ type: 'spring', damping: 20 }}>
        <button aria-label={t('orderSuccess.closeMessage')} onClick={onClose}><X size={18} /></button>
        <span className="success-check"><Check size={30} /></span>
        <small>{t('orderSuccess.orderConfirmed', { id: 'NF-2841' })}</small>
        <h2>{t('orderSuccess.title')}</h2>
        <p>{t('orderSuccess.body')}</p>
        <div><Flame size={17} fill="currentColor" /><b>{t('orderSuccess.streakUnlocked', { count: 7 })}</b><span>{t('orderSuccess.pointsNextTime')}</span></div>
        <button className="primary-button" onClick={onClose}>{t('orderSuccess.keepGoing')} <ArrowRight size={17} /></button>
      </motion.div>
    </motion.div>
  )
}
