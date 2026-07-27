import { ChevronDown } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'

const HELP_CATEGORIES = [
  {
    category: 'Orders & delivery',
    items: [
      { question: 'Where is my order?', answer: 'Open Order History from your profile and select the order — the tracker shows placed, preparing, out for delivery, and delivered status in real time.' },
      { question: 'Can I cancel an order after placing it?', answer: 'Orders can be cancelled by the restaurant while still in "placed" or "preparing" status. Contact the restaurant or reach out to us if you need help.' },
      { question: 'My order arrived incorrect or incomplete', answer: 'Reach out via Contact with your order ID and we\'ll follow up with the restaurant directly.' },
    ],
  },
  {
    category: 'Payments & refunds',
    items: [
      { question: 'What payment methods are supported?', answer: 'Checkout runs through Stripe\'s hosted payment page, supporting cards and other methods Stripe enables for your region.' },
      { question: 'How do refunds work?', answer: 'Refunds for cancelled or failed orders are processed back to your original payment method. See our Refund & Cancellation Policy for full details.' },
      { question: 'A coupon code isn\'t applying at checkout', answer: 'Double check the minimum order value and expiry date on the coupon — the checkout page will show a specific reason if it can\'t be applied.' },
    ],
  },
  {
    category: 'Account & rewards',
    items: [
      { question: 'How do I verify my email?', answer: 'Check your inbox for the verification link sent at signup, or resend it from your Profile page.' },
      { question: 'How do Fuel points and tiers work?', answer: 'You earn roughly 1 point per ₹10 spent, plus a +20 bonus when an order lands within your nutrition goal. Points and tiers are visible on the Rewards page.' },
      { question: 'How do I delete my saved addresses?', answer: 'Go to Saved Addresses from your profile — each address has a delete option, and deleting your default promotes the next one automatically.' },
    ],
  },
  {
    category: 'Restaurant partners',
    items: [
      { question: 'How do I list my restaurant?', answer: 'Register an account, then create your restaurant from the restaurant dashboard. See Become a Partner for the full pitch.' },
      { question: 'How long does approval take?', answer: 'An admin reviews every new restaurant before it goes live publicly — most reviews happen within a business day in production.' },
    ],
  },
]

export function HelpCenterPage() {
  const [openKey, setOpenKey] = useState<string | null>(`${HELP_CATEGORIES[0]?.category}-0`)

  return (
    <main className="browse-main">
      <div className="browse-heading">
        <div className="section-kicker">Help Center</div>
        <h1>How can we help?</h1>
        <p>Browse answers by topic, or reach out directly if you can't find what you need.</p>
      </div>

      {HELP_CATEGORIES.map((group) => (
        <section key={group.category} className="help-category">
          <h2>{group.category}</h2>
          <div className="faq-list">
            {group.items.map((item, index) => {
              const key = `${group.category}-${index}`
              const isOpen = openKey === key
              return (
                <div className={isOpen ? 'faq-item open' : 'faq-item'} key={key}>
                  <button className="faq-question" onClick={() => setOpenKey(isOpen ? null : key)}>
                    {item.question}
                    <ChevronDown size={16} />
                  </button>
                  {isOpen && <p className="faq-answer">{item.answer}</p>}
                </div>
              )
            })}
          </div>
        </section>
      ))}

      <div className="empty-cart help-cta">
        <h3>Still need help?</h3>
        <p>Send us a note and we'll get back to you directly.</p>
        <Link className="primary-button bright" to="/contact">Contact us</Link>
      </div>
    </main>
  )
}
