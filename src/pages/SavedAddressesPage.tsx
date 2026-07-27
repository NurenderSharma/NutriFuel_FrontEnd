import { MapPin, Star, Trash2 } from 'lucide-react'
import { type FormEvent, useEffect, useState } from 'react'
import { Skeleton } from '../components/Skeleton'
import type { Address } from '../domain/address'
import { apiClient } from '../lib/apiClient'

const emptyForm = { label: 'Home', line1: '', city: '', state: '', postalCode: '', phone: '' }

export function SavedAddressesPage() {
  const [addresses, setAddresses] = useState<Address[]>([])
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading')
  const [form, setForm] = useState(emptyForm)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const load = () => {
    apiClient
      .get<Address[]>('/addresses')
      .then((data) => {
        setAddresses(data)
        setStatus('ready')
      })
      .catch(() => setStatus('error'))
  }

  useEffect(load, [])

  const handleCreate = async (event: FormEvent) => {
    event.preventDefault()
    setError(null)
    setIsSubmitting(true)
    try {
      const updated = await apiClient.post<Address[]>('/addresses', form)
      setAddresses(updated)
      setForm(emptyForm)
    } catch {
      setError('Could not save this address. Check the fields and try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleSetDefault = async (id: string) => {
    const updated = await apiClient.patch<Address[]>(`/addresses/${id}/default`, {})
    setAddresses(updated)
  }

  const handleDelete = async (id: string) => {
    const updated = await apiClient.del<Address[]>(`/addresses/${id}`)
    setAddresses(updated)
  }

  return (
    <main className="browse-main">
      <div className="browse-heading">
        <div className="section-kicker">Account</div>
        <h1>Saved addresses</h1>
        <p>Keep your delivery details handy so checkout only takes a tap.</p>
      </div>

      {status === 'loading' && (
        <div className="address-grid">
          {Array.from({ length: 2 }, (_, index) => (
            <div className="address-card" key={index} style={{ display: 'grid', gap: 8 }}>
              <Skeleton height={13} width="40%" />
              <Skeleton height={11} width="80%" />
              <Skeleton height={11} width="60%" />
            </div>
          ))}
        </div>
      )}
      {status === 'error' && <p className="browse-status">Couldn't load your addresses right now.</p>}

      {status === 'ready' && addresses.length === 0 && (
        <div className="empty-cart">
          <span><MapPin size={28} /></span>
          <h3>No saved addresses yet.</h3>
          <p>Add one below so checkout can fill itself in next time.</p>
        </div>
      )}

      {addresses.length > 0 && (
        <div className="address-grid">
          {addresses.map((address) => (
            <div className={address.isDefault ? 'address-card default' : 'address-card'} key={address.id}>
              <div className="address-card-top">
                <b>{address.label}</b>
                {address.isDefault && <span className="status-pill status-approved">Default</span>}
              </div>
              <p>{address.line1}</p>
              <p>{address.city}{address.state ? `, ${address.state}` : ''} {address.postalCode}</p>
              <p>{address.phone}</p>
              <div className="address-card-actions">
                {!address.isDefault && (
                  <button className="text-button" onClick={() => handleSetDefault(address.id)}>
                    <Star size={13} /> Make default
                  </button>
                )}
                <button className="text-button" onClick={() => handleDelete(address.id)}>
                  <Trash2 size={13} /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <form className="auth-form checkout-form" onSubmit={handleCreate}>
        <h3>Add a new address</h3>
        <label className="form-field">
          <span>Label</span>
          <input value={form.label} onChange={(event) => setForm({ ...form, label: event.target.value })} />
        </label>
        <label className="form-field">
          <span>Address line</span>
          <input required value={form.line1} onChange={(event) => setForm({ ...form, line1: event.target.value })} />
        </label>
        <label className="form-field">
          <span>City</span>
          <input required value={form.city} onChange={(event) => setForm({ ...form, city: event.target.value })} />
        </label>
        <label className="form-field">
          <span>State</span>
          <input value={form.state} onChange={(event) => setForm({ ...form, state: event.target.value })} />
        </label>
        <label className="form-field">
          <span>Postal code</span>
          <input required value={form.postalCode} onChange={(event) => setForm({ ...form, postalCode: event.target.value })} />
        </label>
        <label className="form-field">
          <span>Phone</span>
          <input required value={form.phone} onChange={(event) => setForm({ ...form, phone: event.target.value })} />
        </label>
        {error && <p className="form-error">{error}</p>}
        <button className="primary-button bright" type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Saving…' : 'Save address'}
        </button>
      </form>
    </main>
  )
}
