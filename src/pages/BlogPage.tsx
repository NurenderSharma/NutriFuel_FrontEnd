import { Clock3 } from 'lucide-react'
import { Link } from 'react-router-dom'
import { blogArticles } from '../data/blogArticles'

export function BlogPage() {
  return (
    <main className="browse-main">
      <div className="browse-heading">
        <div className="section-kicker">Blog</div>
        <h1>Nutrition, explained without the hype</h1>
        <p>Short, practical reads on protein, macros, and building meals that actually match your goal.</p>
      </div>

      <div className="blog-grid">
        {blogArticles.map((article) => (
          <Link className="blog-card" key={article.slug} to={`/blog/${article.slug}`}>
            <div className="blog-card-image"><img src={article.image} alt={article.title} /></div>
            <div className="blog-card-body">
              <span className="blog-card-category">{article.category}</span>
              <h3>{article.title}</h3>
              <p>{article.excerpt}</p>
              <span className="blog-card-meta"><Clock3 size={12} /> {article.readMinutes} min read</span>
            </div>
          </Link>
        ))}
      </div>
    </main>
  )
}
