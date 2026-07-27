import { Award, Leaf, Target, Users } from 'lucide-react'

export function AboutPage() {
  return (
    <main className="browse-main">
      <div className="static-hero">
        <img src="https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=1200" alt="Chefs preparing fresh, healthy meals in a kitchen" />
      </div>
      <div className="browse-heading">
        <div className="section-kicker">About NutriFuel</div>
        <h1>Food that hits your numbers, made by people who care</h1>
        <p>
          NutriFuel started with a simple frustration: eating for a goal — muscle, energy, recovery — shouldn't mean
          guessing at nutrition labels or settling for bland "diet food." We built a platform where every kitchen
          publishes real macros, and our matching engine finds meals that actually fit your target.
        </p>
      </div>

      <div className="about-grid">
        <div className="about-card">
          <Target size={22} />
          <h3>Goal-first matching</h3>
          <p>Tell us your protein, calorie, and carb targets — we rank every eligible meal and combo against them.</p>
        </div>
        <div className="about-card">
          <Leaf size={22} />
          <h3>Verified nutrition</h3>
          <p>Every restaurant on NutriFuel publishes kitchen-verified nutrition data, not estimates.</p>
        </div>
        <div className="about-card">
          <Award size={22} />
          <h3>Rewards for consistency</h3>
          <p>Earn Fuel points on every order, with bonuses when your meal lands inside your target tolerance.</p>
        </div>
        <div className="about-card">
          <Users size={22} />
          <h3>A marketplace, not a menu</h3>
          <p>Independent kitchens run their own menus and dashboards; we handle discovery, ordering, and rewards.</p>
        </div>
      </div>
    </main>
  )
}
