import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'

export function NotFoundPage() {
  return (
    <main className="browse-main">
      <div className="not-found">
        <span className="not-found-code">404</span>
        <h1>This plate's empty</h1>
        <p>We couldn't find the page you're looking for.</p>
        <Link className="primary-button bright" to="/">Back to home <ArrowRight size={17} /></Link>
      </div>
    </main>
  )
}
