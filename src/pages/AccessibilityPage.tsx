export function AccessibilityPage() {
  return (
    <main className="browse-main">
      <div className="browse-heading">
        <div className="section-kicker">Legal</div>
        <h1>Accessibility Statement</h1>
        <p>Last updated 2026. This is a demo statement for the NutriFuel prototype.</p>
      </div>
      <div className="legal-content">
        <h2>Our commitment</h2>
        <p>We aim for NutriFuel to be usable by as many people as possible, including people relying on screen readers, keyboard navigation, or reduced-motion settings.</p>
        <h2>What we've built in</h2>
        <p>Semantic headings and landmarks throughout the app, visible focus states on interactive elements, alt text on food and restaurant imagery, and a reduced-motion fallback for animated elements like the food image effects and skeleton loading states.</p>
        <h2>Known limitations</h2>
        <p>As a prototype, not every third-party component (like the payment redirect flow) is fully audited for accessibility. We're actively improving coverage over time.</p>
        <h2>Feedback</h2>
        <p>If you hit an accessibility barrier anywhere in the app, please let us know via Contact — we treat these reports as priority fixes.</p>
      </div>
    </main>
  )
}
