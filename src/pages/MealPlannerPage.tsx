import { Plus, X } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { MacroStat } from '../components/MacroStat'
import { ZERO_NUTRITION, addNutrition } from '../domain'
import type { NutritionFacts } from '../domain'
import { apiClient } from '../lib/apiClient'

const DAYS = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'] as const
const SLOTS = ['breakfast', 'lunch', 'dinner', 'snack'] as const
const DAY_LABELS: Record<(typeof DAYS)[number], string> = {
  mon: 'Mon', tue: 'Tue', wed: 'Wed', thu: 'Thu', fri: 'Fri', sat: 'Sat', sun: 'Sun',
}

interface PlanEntryFood {
  id: string
  name: string
  images?: string[]
  price?: number
  nutrition?: NutritionFacts
}

interface PlanEntry {
  day: (typeof DAYS)[number]
  mealSlot: (typeof SLOTS)[number]
  food: PlanEntryFood
}

interface FoodSearchResult {
  id: string
  name: string
  nutrition: NutritionFacts
}

export function MealPlannerPage() {
  const [entries, setEntries] = useState<PlanEntry[]>([])
  const [pickerFor, setPickerFor] = useState<{ day: string; slot: string } | null>(null)
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<FoodSearchResult[]>([])

  const loadPlan = () => {
    apiClient.get<{ entries: PlanEntry[] }>('/meal-plan/mine').then((plan) => setEntries(plan.entries))
  }

  useEffect(loadPlan, [])

  useEffect(() => {
    if (!pickerFor || query.trim().length < 2) {
      setResults([])
      return
    }
    const timeout = window.setTimeout(() => {
      apiClient
        .getPage<FoodSearchResult>(`/foods?search=${encodeURIComponent(query)}&limit=6`)
        .then((response) => setResults(response.data))
    }, 250)
    return () => window.clearTimeout(timeout)
  }, [pickerFor, query])

  const entryFor = (day: string, slot: string) => entries.find((entry) => entry.day === day && entry.mealSlot === slot)

  const assign = async (foodId: string) => {
    if (!pickerFor) return
    await apiClient.put('/meal-plan/mine/entries', { day: pickerFor.day, mealSlot: pickerFor.slot, foodId })
    setPickerFor(null)
    setQuery('')
    loadPlan()
  }

  const remove = async (day: string, slot: string) => {
    await apiClient.del(`/meal-plan/mine/entries/${day}/${slot}`)
    loadPlan()
  }

  const weekTotal = useMemo(
    () => entries.reduce((total, entry) => (entry.food.nutrition ? addNutrition(total, entry.food.nutrition) : total), ZERO_NUTRITION),
    [entries],
  )

  return (
    <main className="browse-main">
      <div className="browse-heading">
        <div className="section-kicker">Meal Planner</div>
        <h1>Plan your week</h1>
        <p>Assign a meal to each slot — we'll total the week's nutrition as you go.</p>
      </div>

      <div className="meal-planner-summary">
        <MacroStat value={`${Math.round(weekTotal.protein)}g`} label="Protein" emphasis />
        <MacroStat value={`${Math.round(weekTotal.calories)}`} label="Calories" />
        <MacroStat value={`${Math.round(weekTotal.carbs)}g`} label="Carbs" />
        <MacroStat value={`${Math.round(weekTotal.fat)}g`} label="Fat" />
      </div>

      <div className="meal-planner-grid">
        <div className="meal-planner-corner" />
        {DAYS.map((day) => <div className="meal-planner-day-head" key={day}>{DAY_LABELS[day]}</div>)}

        {SLOTS.map((slot) => (
          <div className="meal-planner-row" key={slot}>
            <div className="meal-planner-slot-head">{slot}</div>
            {DAYS.map((day) => {
              const entry = entryFor(day, slot)
              const isPicking = pickerFor?.day === day && pickerFor?.slot === slot
              return (
                <div className="meal-planner-cell" key={`${day}-${slot}`}>
                  {entry ? (
                    <div className="meal-planner-entry">
                      <span>{entry.food.name}</span>
                      <button aria-label="Remove" onClick={() => remove(day, slot)}><X size={12} /></button>
                    </div>
                  ) : isPicking ? (
                    <div className="meal-planner-picker">
                      <input
                        autoFocus
                        placeholder="Search meals…"
                        value={query}
                        onChange={(event) => setQuery(event.target.value)}
                      />
                      <div className="meal-planner-picker-results">
                        {results.map((food) => (
                          <button key={food.id} onClick={() => assign(food.id)}>{food.name}</button>
                        ))}
                      </div>
                      <button className="text-button" onClick={() => { setPickerFor(null); setQuery('') }}>Cancel</button>
                    </div>
                  ) : (
                    <button className="meal-planner-add" onClick={() => setPickerFor({ day, slot })}>
                      <Plus size={14} />
                    </button>
                  )}
                </div>
              )
            })}
          </div>
        ))}
      </div>
    </main>
  )
}
