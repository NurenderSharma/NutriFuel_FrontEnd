import { motion } from 'framer-motion'
import { Check, Clock3, Plus, Sparkles, Star } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import type { FoodRecommendation } from '../domain'
import { ScoreBadge } from './primitives'
import { MacroStat } from './MacroStat'

function titleForRecommendation(recommendation: FoodRecommendation) {
  return recommendation.items.map((item) => item.name).join(' + ')
}

export function RecommendationCard({
  recommendation,
  featured,
  index,
  onAdd,
}: {
  recommendation: FoodRecommendation
  featured: boolean
  index: number
  onAdd: () => void
}) {
  const { t } = useTranslation()
  const firstItem = recommendation.items[0]
  const topReason = recommendation.reasons[0]
  return (
    <motion.article
      className={featured ? 'meal-card featured' : 'meal-card'}
      variants={{ hidden: { y: 24, opacity: 0 }, show: { y: 0, opacity: 1 } }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="meal-image-wrap">
        <img src={firstItem.imageKey} alt={titleForRecommendation(recommendation)} />
        <div className="image-top-row">
          <span className="rank-pill">{t('recommendation.rankMatch', { rank: index + 1 })}</span>
          {recommendation.kind === 'combo' && <span className="combo-pill"><Sparkles size={12} /> {t('recommendation.smartCombo')}</span>}
        </div>
        <div className="image-bottom-row">
          <span><Clock3 size={13} /> {Math.max(...recommendation.items.map((item) => item.prepTimeMinutes))} {t('common.min')}</span>
          <span><Star size={12} fill="currentColor" /> {firstItem.rating}</span>
        </div>
      </div>
      <div className="meal-card-body">
        <div className="meal-title-row">
          <div>
            <span className="diet-label"><i className={firstItem.diet === 'non-vegetarian' ? 'nonveg' : ''} /> {firstItem.cuisine}</span>
            <h3>{titleForRecommendation(recommendation)}</h3>
          </div>
          <ScoreBadge score={recommendation.score} size={featured ? 'md' : 'sm'} />
        </div>
        {featured && <p className="meal-description">{recommendation.items.map((item) => item.description).join(t('recommendation.pairedWith'))}</p>}
        <div className="macro-row">
          <MacroStat value={`${recommendation.nutrition.protein}g`} label={t('nutrition.protein')} emphasis />
          <MacroStat value={`${recommendation.nutrition.calories}`} label={t('nutrition.calories')} />
          <MacroStat value={`${recommendation.nutrition.carbs}g`} label={t('nutrition.carbs')} />
          <MacroStat value={`${recommendation.nutrition.fiber}g`} label={t('nutrition.fiber')} />
        </div>
        <div className="match-reason"><Check size={14} /><span>{topReason}</span></div>
        <div className="meal-card-footer">
          <div className="meal-price"><small>{t('recommendation.from')}</small><strong>₹{recommendation.price}</strong></div>
          <button onClick={onAdd}>
            {recommendation.kind === 'combo' ? t('recommendation.addCombo') : t('recommendation.addMeal')} <Plus size={16} />
          </button>
        </div>
      </div>
    </motion.article>
  )
}
