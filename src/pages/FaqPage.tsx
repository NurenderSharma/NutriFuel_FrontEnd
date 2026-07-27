import { ChevronDown } from 'lucide-react'
import { useState } from 'react'

const FAQS = [
  {
    question: 'How does goal matching work?',
    answer: 'Set your protein, calorie, and carb targets in the Nutrition Finder and we score every eligible meal (and two-item combo) against them, weighting protein most heavily.',
  },
  {
    question: 'Are the nutrition numbers accurate?',
    answer: 'Every restaurant publishes its own kitchen-verified nutrition data per item — the same numbers power both search filters and the matching engine.',
  },
  {
    question: 'How do Fuel points work?',
    answer: 'You earn roughly 1 point per ₹10 spent, plus a +20 bonus when an order lands within your goal tolerance. Points unlock discount and free-meal rewards as you climb tiers.',
  },
  {
    question: 'Can I order from multiple restaurants at once?',
    answer: "Not in a single order — each cart is tied to one restaurant, matching how delivery and payouts work in practice. You'll be prompted to clear your cart if you add from a different kitchen.",
  },
  {
    question: 'How do I become a restaurant owner on NutriFuel?',
    answer: 'Register an account, then create your restaurant from the restaurant dashboard. An admin reviews and approves new restaurants before they go live.',
  },
  {
    question: "What happens if I don't verify my email?",
    answer: "You can still browse, order, and use the app — verification just adds a checkmark to your profile. You can resend the link any time.",
  },
]

export function FaqPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  return (
    <main className="browse-main">
      <div className="browse-heading">
        <div className="section-kicker">FAQ</div>
        <h1>Frequently asked questions</h1>
      </div>

      <div className="faq-list">
        {FAQS.map((faq, index) => (
          <div className={openIndex === index ? 'faq-item open' : 'faq-item'} key={faq.question}>
            <button className="faq-question" onClick={() => setOpenIndex(openIndex === index ? null : index)}>
              {faq.question}
              <ChevronDown size={16} />
            </button>
            {openIndex === index && <p className="faq-answer">{faq.answer}</p>}
          </div>
        ))}
      </div>
    </main>
  )
}
