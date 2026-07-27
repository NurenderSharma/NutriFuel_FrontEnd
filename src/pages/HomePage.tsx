import { motion } from 'framer-motion'
import gsap from 'gsap'
import {
  ArrowRight,
  Award,
  Check,
  ChevronRight,
  Clock3,
  Flame,
  History,
  ShieldCheck,
  ShoppingBag,
  SlidersHorizontal,
  Sparkles,
  Star,
  Target,
  TrendingUp,
  Zap,
} from 'lucide-react'
import { type ReactNode, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis } from 'recharts'
import { useTranslation } from 'react-i18next'
import { Link, useLocation } from 'react-router-dom'
import { FoodCard } from '../components/FoodCard'
import { NutritionFinderSection } from '../components/NutritionFinderSection'
import { BrandMark } from '../components/primitives'
import { RestaurantCard } from '../components/RestaurantCard'
import { getRewardTierStatus } from '../domain'
import type { FoodItem } from '../domain'
import { type ApiCatalogFood, mapApiFoodToFoodItem } from '../domain/foodAdapter'
import type { Restaurant } from '../domain/restaurant'
import { apiClient } from '../lib/apiClient'
import { useAuthStore } from '../store/authStore'
import { useDemoPointsStore } from '../store/demoPointsStore'
import { useRecentlyViewedStore } from '../store/recentlyViewedStore'
import { useRewardsStore } from '../store/rewardsStore'

const chartData = [
  { day: 'Mon', protein: 78 },
  { day: 'Tue', protein: 92 },
  { day: 'Wed', protein: 84 },
  { day: 'Thu', protein: 105 },
  { day: 'Fri', protein: 96 },
  { day: 'Sat', protein: 118 },
  { day: 'Sun', protein: 112 },
]

function scrollTo(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

export function HomePage() {
  const { t } = useTranslation()
  const heroRef = useRef<HTMLElement>(null)
  const location = useLocation()

  const user = useAuthStore((state) => state.user)
  const demoPoints = useDemoPointsStore((state) => state.points)
  const rewardSummary = useRewardsStore((state) => state.summary)
  const points = user ? rewardSummary?.points ?? 0 : demoPoints
  const recentlyViewed = useRecentlyViewedStore((state) => state.entries)

  const [trendingFoods, setTrendingFoods] = useState<FoodItem[]>([])
  const [popularRestaurants, setPopularRestaurants] = useState<Restaurant[]>([])

  useEffect(() => {
    apiClient
      .get<ApiCatalogFood[]>('/foods?sort=trending&limit=4')
      .then((data) => setTrendingFoods(data.map(mapApiFoodToFoodItem)))
      .catch(() => setTrendingFoods([]))
    apiClient
      .get<Restaurant[]>('/restaurants?sort=popular&limit=4')
      .then(setPopularRestaurants)
      .catch(() => setPopularRestaurants([]))
  }, [])

  useEffect(() => {
    if (!location.hash) return
    const id = location.hash.slice(1)
    window.setTimeout(() => scrollTo(id), 80)
  }, [location.hash])

  useLayoutEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const context = gsap.context(() => {
      gsap.fromTo(
        '.hero-reveal',
        { y: 28, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.85, stagger: 0.1, ease: 'power3.out' },
      )
      gsap.fromTo(
        '.hero-visual',
        { y: 30, rotate: 1.8, opacity: 0, scale: 0.97 },
        { y: 0, rotate: 0, opacity: 1, scale: 1, duration: 1.1, ease: 'power3.out' },
      )
    }, heroRef)
    return () => context.revert()
  }, [])

  const rewardStatus = user && rewardSummary
    ? {
        tier: rewardSummary.tier,
        nextTier: rewardSummary.nextTier,
        nextTierAt: rewardSummary.nextTierAt,
        progressPercent: rewardSummary.progressPercent,
        pointsToNextTier: rewardSummary.pointsToNextTier,
      }
    : getRewardTierStatus(points)

  return (
    <main>
      <section className="hero" id="top" ref={heroRef}>
        <div className="hero-copy">
          <div className="eyebrow hero-reveal">
            <span className="live-dot" />
            {t('home.eyebrow')}
          </div>
          <h1 className="hero-reveal">
            {t('home.heroTitle')}
            <span> {t('home.heroTitleAccent')}</span>
          </h1>
          <p className="hero-subtitle hero-reveal">
            {t('home.heroSubtitle')}
          </p>
          <div className="hero-cta-row hero-reveal">
            <button className="primary-button" onClick={() => scrollTo('goal-studio')}>
              {t('home.buildMeal')} <ArrowRight size={18} />
            </button>
            <button className="text-button" onClick={() => scrollTo('how-it-works')}>
              {t('home.seeHowMatching')} <ChevronRight size={17} />
            </button>
          </div>
          <div className="hero-proof hero-reveal">
            <div className="avatar-stack" aria-hidden="true">
              <span>AS</span><span>RK</span><span>MV</span>
            </div>
            <div>
              <div className="proof-stars"><Star size={13} fill="currentColor" /> 4.9</div>
              <p>{t('home.ratingLoved')}</p>
            </div>
          </div>
        </div>

        <div className="hero-visual">
          <motion.div
            className="hero-image-frame"
            animate={{ scale: [1, 1.06, 1] }}
            transition={{ duration: 16, repeat: Infinity, ease: 'easeInOut' }}
          >
            <img src="/images/nutrifuel-hero.png" alt="Protein power bowl with grilled chicken, egg, avocado, quinoa and greens" />
            <div className="hero-image-shade" />
            <span className="hero-photo-label"><Sparkles size={13} /> {t('home.topMatch')}</span>
            <div className="hero-dish-name">
              <span>01</span>
              <div>
                <p>{t('home.sampleDishName')}</p>
                <small>{t('home.sampleDishMeta')}</small>
              </div>
            </div>
          </motion.div>
          <motion.div
            className="floating-match-card"
            animate={{ y: [0, -7, 0] }}
            transition={{ duration: 4.2, repeat: Infinity, ease: 'easeInOut' }}
          >
            <div className="mini-ring"><span>94</span><small>%</small></div>
            <div><b>{t('home.nearPerfectMatch')}</b><span>{t('home.forYourProteinGoal')}</span></div>
          </motion.div>
          <motion.div
            className="floating-macro-card"
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 4.8, repeat: Infinity, ease: 'easeInOut', delay: 0.4 }}
          >
            <span><Zap size={15} fill="currentColor" /></span>
            <div><b>45g</b><small>{t('home.proteinUnit')}</small></div>
          </motion.div>
        </div>
      </section>

      <section className="trust-strip" aria-label="NutriFuel benefits">
        <div><Target size={19} /><span><b>±10%</b> {t('home.trustAccuracy')}</span></div>
        <div><Clock3 size={19} /><span><b>24 min</b> {t('home.trustDelivery')}</span></div>
        <div><ShieldCheck size={19} /><span><b>{t('home.trustVerified')}</b> {t('home.trustVerifiedSuffix')}</span></div>
        <div><Award size={19} /><span><b>2×</b> {t('home.trustPoints')}</span></div>
      </section>

      {trendingFoods.length > 0 && (
        <section className="browse-main" aria-label="Trending meals">
          <div className="discovery-strip">
            <h2><Flame size={17} /> {t('home.trendingNow')}</h2>
            <Link className="text-button" to="/trending">{t('common.seeAll')} <ChevronRight size={14} /></Link>
          </div>
          <div className="food-grid">
            {trendingFoods.map((food) => <FoodCard key={food.id} food={food} />)}
          </div>
        </section>
      )}

      {popularRestaurants.length > 0 && (
        <section className="browse-main" aria-label="Popular restaurants">
          <div className="discovery-strip">
            <h2><TrendingUp size={17} /> {t('home.popularRestaurants')}</h2>
            <Link className="text-button" to="/popular-restaurants">{t('common.seeAll')} <ChevronRight size={14} /></Link>
          </div>
          <div className="restaurant-grid">
            {popularRestaurants.map((restaurant) => <RestaurantCard key={restaurant.id} restaurant={restaurant} />)}
          </div>
        </section>
      )}

      {recentlyViewed.length > 0 && (
        <section className="browse-main" aria-label="Recently viewed">
          <div className="discovery-strip">
            <h2><History size={17} /> {t('home.recentlyViewed')}</h2>
            <Link className="text-button" to="/recently-viewed">{t('common.seeAll')} <ChevronRight size={14} /></Link>
          </div>
          <div className="recently-viewed-grid">
            {recentlyViewed.slice(0, 6).map((entry) => {
              const href = entry.restaurantSlug
                ? entry.kind === 'restaurant' ? `/restaurants/${entry.restaurantSlug}` : `/restaurants/${entry.restaurantSlug}/food/${entry.id}`
                : undefined
              return href ? (
                <Link className="recently-viewed-card" key={`${entry.kind}-${entry.id}`} to={href}>
                  {entry.imageKey && <img src={entry.imageKey} alt={entry.name} />}
                  <span>{entry.kind === 'restaurant' ? t('home.restaurantLabel') : t('home.mealLabel')}</span>
                  <b>{entry.name}</b>
                </Link>
              ) : null
            })}
          </div>
        </section>
      )}

      <NutritionFinderSection />

      <section className="rewards-section" id="rewards">
        <div className="rewards-card">
          <div className="rewards-copy">
            <div className="section-kicker light"><Flame size={15} /> {t('home.rewardsKicker')}</div>
            <h2>{t('home.rewardsTitle')}<br />{t('home.rewardsTitleLine2')}</h2>
            <p>{t('home.rewardsBody')}</p>
            <div className="points-hero">
              <span className="points-number">{points.toLocaleString('en-IN')}</span>
              <span><b>{t('home.fuelPoints')}</b><small>{t('home.toNextTier', { points: rewardStatus.pointsToNextTier, tier: rewardStatus.nextTier ?? t('home.topTier') })}</small></span>
            </div>
            <div className="tier-progress-track" aria-label={`${rewardStatus.progressPercent}% to next tier`}>
              <motion.span initial={{ width: 0 }} whileInView={{ width: `${rewardStatus.progressPercent}%` }} viewport={{ once: true }} transition={{ duration: 1, ease: 'easeOut' }} />
            </div>
            <div className="tier-labels">
              <b>{rewardStatus.tier[0]?.toUpperCase()}{rewardStatus.tier.slice(1)}</b>
              <span>{rewardStatus.nextTier ? t('home.tierAt', { tier: `${rewardStatus.nextTier[0]?.toUpperCase()}${rewardStatus.nextTier.slice(1)}`, points: rewardStatus.nextTierAt?.toLocaleString('en-IN') }) : t('home.topTierReached')}</span>
            </div>
            <Link className="light-button" to="/rewards">{t('home.exploreRewards')} <ArrowRight size={17} /></Link>
          </div>

          <div className="rewards-dashboard">
            <div className="streak-card">
              <div className="streak-top">
                <span className="flame-orb"><Flame size={22} fill="currentColor" /></span>
                <div><b>{t('home.dayStreak', { count: 6 })}</b><span>{t('home.strongestYet')}</span></div>
                <small>+1.1×</small>
              </div>
              <div className="week-dots">
                {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, index) => (
                  <div key={`${day}-${index}`} className={index < 6 ? 'complete' : ''}>
                    <span>{index < 6 ? <Check size={12} /> : day}</span><small>{day}</small>
                  </div>
                ))}
              </div>
            </div>

            <div className="trend-card">
              <div className="trend-heading">
                <div><span>{t('home.weeklyProtein')}</span><b>112g {t('home.avgSuffix')}</b></div>
                <small><ArrowRight size={12} /> 14% {t('home.vsLastWeek')}</small>
              </div>
              <div className="chart-wrap" aria-label={t('home.weeklyProteinChart')}>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData} margin={{ top: 8, right: 4, left: 4, bottom: 0 }}>
                    <defs>
                      <linearGradient id="proteinFill" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#c9f36c" stopOpacity={0.42} />
                        <stop offset="100%" stopColor="#c9f36c" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#9aa89c', fontSize: 10 }} />
                    <Tooltip contentStyle={{ borderRadius: 12, border: 0, fontSize: 11 }} />
                    <Area type="monotone" dataKey="protein" stroke="#c9f36c" strokeWidth={2.5} fill="url(#proteinFill)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="next-reward">
              <div><Award size={19} /><span><b>{t('home.nextUnlock')}</b><small>{t('home.nextUnlockBody')}</small></span></div>
              <strong>80 {t('home.points')}</strong>
            </div>
          </div>
        </div>
      </section>

      <section className="how-section" id="how-it-works">
        <div className="how-heading">
          <div className="section-kicker"><Target size={15} /> {t('home.underTheHood')}</div>
          <h2>{t('home.howTitle')}</h2>
          <p>{t('home.howBody')}</p>
        </div>
        <div className="steps-grid">
          <HowStep number="01" icon={<SlidersHorizontal />} title={t('home.step1Title')} copy={t('home.step1Body')} />
          <HowStep number="02" icon={<Zap />} title={t('home.step2Title')} copy={t('home.step2Body')} />
          <HowStep number="03" icon={<ShoppingBag />} title={t('home.step3Title')} copy={t('home.step3Body')} />
        </div>
      </section>

      <section className="closing-cta">
        <BrandMark size={54} decorative />
        <div><span>{t('home.closingTagline')}</span><h2>{t('home.closingTitle')}<br />{t('home.closingTitleLine2')}</h2></div>
        <button className="primary-button bright" onClick={() => scrollTo('goal-studio')}>{t('home.setMyTarget')} <ArrowRight size={18} /></button>
      </section>
    </main>
  )
}

function HowStep({ number, icon, title, copy }: { number: string; icon: ReactNode; title: string; copy: string }) {
  return (
    <motion.article className="how-step" initial={{ y: 20, opacity: 0 }} whileInView={{ y: 0, opacity: 1 }} viewport={{ once: true, amount: 0.4 }}>
      <span className="step-number">{number}</span>
      <span className="step-icon">{icon}</span>
      <h3>{title}</h3>
      <p>{copy}</p>
    </motion.article>
  )
}
