import { NutritionFinderSection } from '../components/NutritionFinderSection'

export function NutritionFinderPage() {
  return (
    <main>
      <section className="browse-main" style={{ paddingBottom: 0 }}>
        <div className="browse-heading">
          <div className="section-kicker">Nutrition Finder</div>
          <h1>Find meals that hit your exact numbers</h1>
          <p>Tune your protein, calorie, and carb targets and we'll match chef-made meals and combos across every restaurant.</p>
        </div>
      </section>
      <NutritionFinderSection />
    </main>
  )
}
