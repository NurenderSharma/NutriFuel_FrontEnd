import { MapPin } from 'lucide-react'
import { Link } from 'react-router-dom'

const OPEN_ROLES = [
  { title: 'Senior Backend Engineer', department: 'Engineering', location: 'Bengaluru · Hybrid', type: 'Full-time' },
  { title: 'Product Designer', department: 'Design', location: 'Remote (India)', type: 'Full-time' },
  { title: 'Restaurant Partnerships Manager', department: 'Operations', location: 'Bengaluru', type: 'Full-time' },
  { title: 'Nutrition Content Writer', department: 'Content', location: 'Remote', type: 'Contract' },
  { title: 'Customer Support Associate', department: 'Support', location: 'Bengaluru', type: 'Full-time' },
]

export function CareersPage() {
  return (
    <main className="browse-main">
      <div className="browse-heading">
        <div className="section-kicker">Careers</div>
        <h1>Help build the future of goal-based eating</h1>
        <p>We're a small team obsessed with making nutrition-first ordering feel effortless. Here's what's open.</p>
      </div>

      <div className="careers-list">
        {OPEN_ROLES.map((role) => (
          <div className="career-row" key={role.title}>
            <div>
              <b>{role.title}</b>
              <span>{role.department} · {role.type}</span>
            </div>
            <span className="career-location"><MapPin size={13} /> {role.location}</span>
            <Link className="text-button" to={`/contact`}>Apply</Link>
          </div>
        ))}
      </div>

      <div className="empty-cart help-cta">
        <h3>Don't see your role?</h3>
        <p>We're always open to hearing from people who care about nutrition and good food. Reach out anyway.</p>
        <Link className="primary-button bright" to="/contact">Get in touch</Link>
      </div>
    </main>
  )
}
