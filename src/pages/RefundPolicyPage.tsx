export function RefundPolicyPage() {
  return (
    <main className="browse-main">
      <div className="browse-heading">
        <div className="section-kicker">Legal</div>
        <h1>Refund & Cancellation Policy</h1>
        <p>Last updated 2026. This is a demo policy for the NutriFuel prototype.</p>
      </div>
      <div className="legal-content">
        <h2>Cancelling an order</h2>
        <p>Orders can be cancelled while still in "placed" or "preparing" status. Once a restaurant marks an order "out for delivery," it can no longer be cancelled.</p>
        <h2>Refund eligibility</h2>
        <p>Cancelled orders and orders that fail payment are eligible for a full refund. Orders flagged as incorrect or incomplete by the customer are reviewed case-by-case with the restaurant.</p>
        <h2>Refund timing</h2>
        <p>Refunds are issued back to your original Stripe payment method. Processing time depends on your bank or card issuer, typically 5-10 business days.</p>
        <h2>Coupons and reward points on refunded orders</h2>
        <p>Any coupon used on a refunded order is not re-issued automatically. Reward points are only credited once payment is confirmed, so a refunded or cancelled order never earns points in the first place.</p>
      </div>
    </main>
  )
}
