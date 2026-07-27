import { Mail, MapPin, Phone } from 'lucide-react'
import { type FormEvent, useState } from 'react'
import { apiClient } from '../lib/apiClient'

export function ContactPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    setStatus('sending')
    try {
      await apiClient.post('/contact', { name, email, message })
      setStatus('sent')
      setName('')
      setEmail('')
      setMessage('')
    } catch {
      setStatus('error')
    }
  }

  return (
    <main className="browse-main">
      <div className="browse-heading">
        <div className="section-kicker">Contact</div>
        <h1>We'd love to hear from you</h1>
        <p>Questions about an order, a restaurant partnership, or anything else — send us a note.</p>
      </div>

      <div className="contact-layout">
        <form className="auth-form dashboard-form" onSubmit={handleSubmit}>
          <label className="form-field"><span>Name</span><input required value={name} onChange={(e) => setName(e.target.value)} /></label>
          <label className="form-field"><span>Email</span><input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} /></label>
          <label className="form-field"><span>Message</span><textarea required value={message} onChange={(e) => setMessage(e.target.value)} /></label>
          {status === 'sent' && <p className="auth-subtitle">Thanks — we'll be in touch soon.</p>}
          {status === 'error' && <p className="form-error">Something went wrong. Please try again.</p>}
          <button className="primary-button bright" type="submit" disabled={status === 'sending'}>
            {status === 'sending' ? 'Sending…' : 'Send message'}
          </button>
        </form>

        <div className="cart-summary-panel contact-info">
          <div><Mail size={17} /><span>hello@nutrifuel.dev</span></div>
          <div><Phone size={17} /><span>+91 80000 00000</span></div>
          <div><MapPin size={17} /><span>Indiranagar, Bengaluru, India</span></div>
        </div>
      </div>
    </main>
  )
}
