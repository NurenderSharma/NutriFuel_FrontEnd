export function TermsPage() {
  return (
    <main className="browse-main">
      <div className="browse-heading">
        <div className="section-kicker">Legal</div>
        <h1>Terms &amp; Conditions</h1>
        <p>Last updated 2026. This is a demo terms page for the NutriFuel prototype.</p>
      </div>
      <div className="legal-content">
        <h2>Using NutriFuel</h2>
        <p>By creating an account you agree to order responsibly and provide accurate delivery information.</p>
        <h2>Restaurant listings</h2>
        <p>Restaurants are independently owned and operated. Nutrition information is provided by each kitchen and reviewed by our admin team before a restaurant goes live.</p>
        <h2>Payments</h2>
        <p>All payments are processed by Stripe. Refunds for undelivered or incorrect orders are handled on a case-by-case basis by the restaurant.</p>
        <h2>Rewards</h2>
        <p>Fuel points have no cash value, are non-transferable, and may be adjusted if we detect abuse.</p>
      </div>
    </main>
  )
}
