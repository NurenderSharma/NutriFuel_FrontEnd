import { ArrowLeft, Clock3 } from 'lucide-react'
import { Link, useParams } from 'react-router-dom'
import { blogArticles } from '../data/blogArticles'

export function BlogArticlePage() {
  const { slug } = useParams<{ slug: string }>()
  const article = blogArticles.find((entry) => entry.slug === slug)

  if (!article) {
    return (
      <main className="browse-main">
        <div className="browse-heading">
          <div className="section-kicker">Blog</div>
          <h1>Article not found</h1>
        </div>
        <Link className="primary-button bright" to="/blog">Back to blog</Link>
      </main>
    )
  }

  const related = blogArticles.filter((entry) => entry.slug !== article.slug).slice(0, 2)

  return (
    <main className="browse-main">
      <Link className="text-button" to="/blog"><ArrowLeft size={14} /> Back to blog</Link>

      <div className="static-hero">
        <img src={article.image} alt={article.title} />
      </div>

      <div className="browse-heading">
        <div className="section-kicker">{article.category}</div>
        <h1>{article.title}</h1>
        <span className="blog-card-meta"><Clock3 size={12} /> {article.readMinutes} min read</span>
      </div>

      <div className="legal-content">
        {article.content.map((paragraph, index) => <p key={index}>{paragraph}</p>)}
      </div>

      {related.length > 0 && (
        <>
          <h2 className="blog-related-heading">More from the blog</h2>
          <div className="blog-grid">
            {related.map((entry) => (
              <Link className="blog-card" key={entry.slug} to={`/blog/${entry.slug}`}>
                <div className="blog-card-image"><img src={entry.image} alt={entry.title} /></div>
                <div className="blog-card-body">
                  <span className="blog-card-category">{entry.category}</span>
                  <h3>{entry.title}</h3>
                  <p>{entry.excerpt}</p>
                </div>
              </Link>
            ))}
          </div>
        </>
      )}
    </main>
  )
}
