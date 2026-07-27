export function PrivacyPolicyPage() {
  return (
    <main className="browse-main">
      <div className="browse-heading">
        <div className="section-kicker">Legal</div>
        <h1>Privacy Policy</h1>
        <p>Last updated 2026. This is a demo policy for the NutriFuel prototype.</p>
      </div>
      <div className="legal-content">
        <h2>What we collect</h2>
        <p>Account details (name, email), order history, delivery addresses, and nutrition preferences you provide in Settings.</p>
        <h2>How we use it</h2>
        <p>To process orders, personalize meal matching, calculate rewards, and let restaurant owners fulfill orders placed with them.</p>
        <h2>What we don't do</h2>
        <p>We don't sell your data to third parties. Payment details are handled entirely by Stripe and never touch our servers.</p>
        <h2>Your controls</h2>
        <p>You can update or delete your profile information at any time from Settings, and disable non-essential email notifications there too.</p>
      </div>
    </main>
  )
}
