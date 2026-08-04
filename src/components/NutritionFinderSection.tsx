import { motion } from 'framer-motion'
import { Check, Leaf, Search, Sparkles, SlidersHorizontal, Target, Zap } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { RangeControl } from './RangeControl'
import { RecommendationCard } from './RecommendationCard'
import { MacroRing } from './primitives'
import { goalPresets, type GoalPresetId } from '../data'
import {
  getRecommendations,
  type DietaryPreference,
  type FoodItem,
  type KnownAllergen,
  type NutritionGoal,
} from '../domain'
import { type ApiCatalogFood, mapApiFoodToFoodItem } from '../domain/foodAdapter'
import { apiClient } from '../lib/apiClient'
import { useCartStore } from '../store/cartStore'

type DietFilter = DietaryPreference | 'all'

const PRESET_NAME_KEYS: Record<GoalPresetId, string> = {
  'post-workout': 'goalStudio.presetPostWorkout',
  'lean-and-light': 'goalStudio.presetLeanLight',
  'fiber-boost': 'goalStudio.presetFiberBoost',
  'balanced-dinner': 'goalStudio.presetBalancedDinner',
}

function scrollTo(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

export function NutritionFinderSection() {
  const { t } = useTranslation()
  const allergyOptions: { value: KnownAllergen; label: string }[] = [
    { value: 'dairy', label: t('goalStudio.allergenDairy') },
    { value: 'eggs', label: t('goalStudio.allergenEggs') },
    { value: 'peanuts', label: t('goalStudio.allergenPeanuts') },
    { value: 'gluten', label: t('goalStudio.allergenGluten') },
  ]

  const [catalog, setCatalog] = useState<FoodItem[]>([])
  const [protein, setProtein] = useState(40)
  const [calories, setCalories] = useState(500)
  const [carbs, setCarbs] = useState(50)
  const [diet, setDiet] = useState<DietFilter>('all')
  const [allergens, setAllergens] = useState<KnownAllergen[]>([])
  const [activePreset, setActivePreset] = useState('post-workout')
  const [resultsVersion, setResultsVersion] = useState(0)

  const addRecommendation = useCartStore((state) => state.addRecommendation)

  useEffect(() => {
    apiClient
      .get<ApiCatalogFood[]>('/foods?limit=50')
      .then((foods) => setCatalog(foods.map(mapApiFoodToFoodItem)))
      .catch(() => setCatalog([]))
  }, [])

  const goal = useMemo<NutritionGoal>(
    () => ({
      id: 'custom-goal',
      name: 'Your live target',
      targets: { calories, protein, carbs },
      weights: { protein: 0.5, calories: 0.35, carbs: 0.15 },
      defaultTolerance: 0.15,
      calorieCeiling: Math.round(calories * 1.18),
    }),
    [calories, carbs, protein],
  )

  const result = useMemo(
    () =>
      getRecommendations({
        items: catalog,
        goal,
        filters: {
          dietaryPreference: diet === 'all' ? undefined : diet,
          excludedAllergens: allergens,
        },
        includeCombos: true,
        comboPoolSize: 15,
        limit: 6,
      }),
    [allergens, catalog, diet, goal],
  )

  const applyPreset = (presetId: string) => {
    const preset = goalPresets.find((item) => item.id === presetId)
    if (!preset) return
    const targets: NutritionGoal['targets'] = preset.targets
    setActivePreset(presetId)
    setProtein(targets.protein ?? 30)
    setCalories(targets.calories ?? 500)
    setCarbs(targets.carbs ?? 45)
  }

  const toggleAllergen = (allergen: KnownAllergen) => {
    setAllergens((current) =>
      current.includes(allergen)
        ? current.filter((item) => item !== allergen)
        : [...current, allergen],
    )
  }

  const showMatches = () => {
    setResultsVersion((value) => value + 1)
    window.setTimeout(() => scrollTo('matches'), 50)
  }

  const dietLabel = (value: DietFilter) => {
    if (value === 'all') return t('goalStudio.everything')
    if (value === 'non-vegetarian') return t('goalStudio.nonVeg')
    if (value === 'vegetarian') return t('goalStudio.vegetarian')
    return t('goalStudio.vegan')
  }

  return (
    <>
      <section className="goal-section" id="goal-studio">
        <div className="section-kicker"><SlidersHorizontal size={15} /> {t('goalStudio.kicker')}</div>
        <div className="goal-heading-row">
          <div>
            <h2>{t('goalStudio.title')}</h2>
            <p>{t('goalStudio.subtitle')}</p>
          </div>
          <div className="goal-helper"><Sparkles size={17} /> {t('goalStudio.liveMatches')}</div>
        </div>

        <div className="goal-layout">
          <div className="preset-panel">
            <p className="panel-label">{t('goalStudio.chooseMode')}</p>
            <div className="preset-list">
              {goalPresets.map((preset, index) => (
                <button
                  key={preset.id}
                  className={activePreset === preset.id ? 'preset-card active' : 'preset-card'}
                  onClick={() => applyPreset(preset.id)}
                >
                  <span className="preset-index">0{index + 1}</span>
                  <span className="preset-copy">
                    <b>{t(PRESET_NAME_KEYS[preset.id])}</b>
                    <small>
                      {preset.targets.protein ? t('goalStudio.proteinCalories', { protein: preset.targets.protein }) : ''}
                      {t('goalStudio.kcal', { count: preset.targets.calories })}
                    </small>
                  </span>
                  <span className="preset-check"><Check size={14} /></span>
                </button>
              ))}
            </div>
            <div className="studio-note">
              <Zap size={17} />
              <p><b>{t('goalStudio.goalBonusReady')}</b><span>{t('goalStudio.goalBonusBody')}</span></p>
            </div>
          </div>

          <div className="goal-builder">
            <div className="goal-builder-top">
              <div>
                <p className="panel-label">{t('goalStudio.tuneTarget')}</p>
                <h3>{t('goalStudio.targetSummary', { protein, calories })}</h3>
              </div>
              <span className="accuracy-pill"><span /> {t('goalStudio.tolerance')}</span>
            </div>

            <div className="sliders-grid">
              <RangeControl
                label={t('goalStudio.protein')}
                value={protein}
                min={15}
                max={70}
                step={1}
                unit="g"
                color="#167650"
                onChange={(value) => { setProtein(value); setActivePreset('custom') }}
              />
              <RangeControl
                label={t('goalStudio.calories')}
                value={calories}
                min={280}
                max={850}
                step={10}
                unit=" kcal"
                color="#ef9d39"
                onChange={(value) => { setCalories(value); setActivePreset('custom') }}
              />
              <RangeControl
                label={t('goalStudio.carbohydrates')}
                value={carbs}
                min={15}
                max={100}
                step={1}
                unit="g"
                color="#73804a"
                onChange={(value) => { setCarbs(value); setActivePreset('custom') }}
              />
            </div>

            <div className="preference-row">
              <div>
                <span className="filter-label"><Leaf size={14} /> {t('goalStudio.iEat')}</span>
                <div className="segmented-control">
                  {(['all', 'vegetarian', 'vegan', 'non-vegetarian'] as DietFilter[]).map((value) => (
                    <button
                      key={value}
                      className={diet === value ? 'active' : ''}
                      onClick={() => setDiet(value)}
                    >
                      {dietLabel(value)}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <span className="filter-label">{t('goalStudio.excludeAllergens')}</span>
                <div className="allergy-chips">
                  {allergyOptions.map((option) => (
                    <button
                      key={option.value}
                      aria-pressed={allergens.includes(option.value)}
                      className={allergens.includes(option.value) ? 'active' : ''}
                      onClick={() => toggleAllergen(option.value)}
                    >
                      {allergens.includes(option.value) && <Check size={12} />}{option.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="goal-builder-footer">
              <div className="eligible-count">
                <span>{result.eligibleItemCount}</span>
                <p><b>{t('goalStudio.kitchenOptions')}</b><small>{t('goalStudio.fitPreferences')}</small></p>
              </div>
              <button className="primary-button bright" onClick={showMatches}>
                {t('goalStudio.findMatches')} <Search size={17} />
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="matches-section" id="matches">
        <div className="results-heading">
          <div>
            <div className="section-kicker"><Sparkles size={15} /> {t('matches.kicker')}</div>
            <h2>{t('matches.closestTo', { protein })}</h2>
            <p>{t('matches.subtitle')}</p>
          </div>
          <div className="results-summary">
            <MacroRing value={protein} max={70} label={t('matches.proteinLabel')} unit="g" size={86} strokeWidth={7} color="var(--green)" />
            <MacroRing value={calories} max={850} label={t('matches.energyLabel')} unit="" size={86} strokeWidth={7} color="var(--orange)" formatValue={(value) => `${value}`} />
            <div className="summary-copy"><b>{t('matches.liveTarget')}</b><span>{t('matches.carbsTolerance', { carbs })}</span></div>
          </div>
        </div>

        <motion.div
          className="recommendation-grid"
          key={`${resultsVersion}-${diet}-${allergens.join('-')}`}
          initial="hidden"
          animate="show"
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.09 } } }}
        >
          {result.recommendations.slice(0, 3).map((recommendation, index) => (
            <RecommendationCard
              key={recommendation.id}
              recommendation={recommendation}
              featured={index === 0}
              index={index}
              onAdd={() => addRecommendation(recommendation)}
            />
          ))}
        </motion.div>

        <div className="results-footer-note">
          <div className="engine-mark"><Target size={19} /></div>
          <p><b>{t('matches.whyTheseMeals')}</b><span>{t('matches.whyBody')}</span></p>
        </div>
      </section>
    </>
  )
}
