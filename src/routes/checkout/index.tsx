import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import { QrCode, ShieldCheck, CreditCard, User, Phone, MapPin, Mail, Hash } from 'lucide-react'
import { useCart } from '@/context/CartContext'
import { BankQRCode } from '@/components/BankQRCode'
import { Layout } from '@/components/Layout'

export const Route = createFileRoute('/checkout')({
  component: CheckoutPage,
})

function CheckoutPage() {
  const { items, total, clearCart } = useCart()
  const navigate = useNavigate()
  const [step, setStep] = useState<'details' | 'payment'>('details')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const [form, setForm] = useState({
    customerName: '',
    phone: '',
    address: '',
    pincode: '',
    email: '',
    paymentRef: '',
  })

  const update = (field: string, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }))

  const handleDetailsSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.customerName || !form.phone || !form.address || !form.pincode || !form.email) {
      setError('Please fill in all fields.')
      return
    }
    if (!/^\d{6}$/.test(form.pincode)) {
      setError('Please enter a valid 6-digit pincode.')
      return
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      setError('Please enter a valid email address.')
      return
    }
    setError('')
    setStep('payment')
  }

  const handlePlaceOrder = async () => {
    setLoading(true)
    setError('')
    try {
      const orderItems = items.map((i) => ({
        id: i.id,
        name: i.name,
        price: i.price,
        qty: i.qty,
      }))

      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          items: orderItems,
          total,
        }),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Order failed')
      }

      const data = await res.json()
      clearCart()
      navigate({ to: '/checkout/success', search: { orderId: data.orderId } })
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (items.length === 0) {
    return (
      <Layout>
        <div style={{ textAlign: 'center', padding: '6rem 1.5rem' }}>
          <p style={{ color: 'var(--text-secondary)' }}>Your cart is empty.</p>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '2.5rem 1.5rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: '800', marginBottom: '2rem' }}>Checkout</h1>

        {/* Steps indicator */}
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '2.5rem' }}>
          {['details', 'payment'].map((s, i) => (
            <div key={s} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div
                style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '50%',
                  background: step === s ? 'var(--accent-purple)' : step === 'payment' && s === 'details' ? '#4ade80' : 'var(--bg-card)',
                  border: `2px solid ${step === s ? 'var(--accent-purple)' : step === 'payment' && s === 'details' ? '#4ade80' : 'var(--border-color)'}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.75rem',
                  fontWeight: '700',
                  color: step === s || (step === 'payment' && s === 'details') ? 'white' : 'var(--text-secondary)',
                }}
              >
                {step === 'payment' && s === 'details' ? '✓' : i + 1}
              </div>
              <span
                style={{
                  fontWeight: step === s ? '700' : '500',
                  color: step === s ? 'var(--text-primary)' : 'var(--text-secondary)',
                  fontSize: '0.9rem',
                  textTransform: 'capitalize',
                }}
              >
                {s === 'details' ? 'Your Details' : 'Payment'}
              </span>
              {i === 0 && (
                <div style={{ width: '40px', height: '1px', background: 'var(--border-color)', marginLeft: '0.25rem' }} />
              )}
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
          {/* Form / Payment */}
          <div style={{ flex: '1 1 380px' }}>
            {step === 'details' ? (
              <form onSubmit={handleDetailsSubmit}>
                <div className="card-dark" style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  <h2 style={{ margin: 0, fontSize: '1.1rem', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <User size={18} style={{ color: 'var(--accent-purple)' }} /> Delivery Information
                  </h2>

                  <Field icon={<User size={15} />} label="Full Name">
                    <input
                      className="input-dark"
                      placeholder="Enter your full name"
                      value={form.customerName}
                      onChange={(e) => update('customerName', e.target.value)}
                      required
                    />
                  </Field>

                  <Field icon={<Phone size={15} />} label="Phone Number">
                    <input
                      className="input-dark"
                      placeholder="Enter your phone number"
                      value={form.phone}
                      onChange={(e) => update('phone', e.target.value)}
                      required
                    />
                  </Field>

                  <Field icon={<Mail size={15} />} label="Email Address">
                    <input
                      className="input-dark"
                      type="email"
                      placeholder="Enter your email address"
                      value={form.email}
                      onChange={(e) => update('email', e.target.value)}
                      required
                    />
                  </Field>

                  <Field icon={<MapPin size={15} />} label="Delivery Address">
                    <textarea
                      className="input-dark"
                      placeholder="Enter your full delivery address"
                      rows={3}
                      value={form.address}
                      onChange={(e) => update('address', e.target.value)}
                      required
                      style={{ resize: 'vertical' }}
                    />
                  </Field>

                  <Field icon={<Hash size={15} />} label="Pincode">
                    <input
                      className="input-dark"
                      placeholder="6-digit pincode"
                      maxLength={6}
                      value={form.pincode}
                      onChange={(e) => update('pincode', e.target.value.replace(/\D/g, ''))}
                      required
                    />
                  </Field>

                  {error && (
                    <div
                      style={{
                        background: 'rgba(239,68,68,0.1)',
                        border: '1px solid rgba(239,68,68,0.3)',
                        borderRadius: '8px',
                        padding: '0.75rem 1rem',
                        color: '#f87171',
                        fontSize: '0.875rem',
                      }}
                    >
                      {error}
                    </div>
                  )}

                  <button type="submit" className="btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '0.9rem' }}>
                    Continue to Payment →
                  </button>
                </div>
              </form>
            ) : (
              <div className="card-dark" style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <h2 style={{ margin: 0, fontSize: '1.1rem', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <QrCode size={18} style={{ color: 'var(--accent-gold)' }} /> Bank Payment via QR
                </h2>

                <div style={{ textAlign: 'center' }}>
                  <BankQRCode />
                  <div
                    style={{
                      marginTop: '1.25rem',
                      padding: '0.9rem',
                      background: 'rgba(139,92,246,0.08)',
                      border: '1px solid rgba(139,92,246,0.2)',
                      borderRadius: '10px',
                    }}
                  >
                    <p style={{ margin: '0 0 0.4rem', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Amount to Pay</p>
                    <p
                      style={{
                        margin: 0,
                        fontSize: '1.75rem',
                        fontWeight: '900',
                        background: 'linear-gradient(135deg, #d4af37, #f0c83a)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                      }}
                    >
                      ₹{total.toLocaleString()}
                    </p>
                  </div>
                </div>

                <ol style={{ margin: 0, padding: '0 0 0 1.25rem', color: 'var(--text-secondary)', fontSize: '0.875rem', lineHeight: '1.8' }}>
                  <li>Open your banking app or UPI app</li>
                  <li>Scan the QR code above</li>
                  <li>Pay <strong style={{ color: 'var(--text-primary)' }}>₹{total.toLocaleString()}</strong></li>
                  <li>Note the transaction / UTR number</li>
                  <li>Enter it below and place your order</li>
                </ol>

                <Field icon={<CreditCard size={15} />} label="Payment Reference / UTR Number">
                  <input
                    className="input-dark"
                    placeholder="Enter transaction reference (optional)"
                    value={form.paymentRef}
                    onChange={(e) => update('paymentRef', e.target.value)}
                  />
                </Field>

                {error && (
                  <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '8px', padding: '0.75rem 1rem', color: '#f87171', fontSize: '0.875rem' }}>
                    {error}
                  </div>
                )}

                <div style={{ display: 'flex', gap: '0.75rem' }}>
                  <button className="btn-outline" onClick={() => setStep('details')} style={{ flex: '0 0 auto' }}>
                    ← Back
                  </button>
                  <button
                    className="btn-gold"
                    onClick={handlePlaceOrder}
                    disabled={loading}
                    style={{ flex: 1, justifyContent: 'center', opacity: loading ? 0.7 : 1 }}
                  >
                    <ShieldCheck size={16} />
                    {loading ? 'Placing Order...' : 'Place Order'}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Order Summary */}
          <div style={{ flex: '0 1 320px' }}>
            <div className="card-dark" style={{ padding: '1.5rem', position: 'sticky', top: '80px' }}>
              <h3 style={{ margin: '0 0 1.25rem', fontWeight: '700', fontSize: '1rem' }}>Order Summary</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.25rem' }}>
                {items.map((item) => (
                  <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '0.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <img src={item.image} alt={item.name} style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '6px', border: '1px solid var(--border-color)' }} />
                      <div>
                        <p style={{ margin: 0, fontSize: '0.85rem', fontWeight: '600' }}>{item.name}</p>
                        <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-secondary)' }}>×{item.qty}</p>
                      </div>
                    </div>
                    <span style={{ fontWeight: '700', fontSize: '0.9rem' }}>₹{(item.price * item.qty).toLocaleString()}</span>
                  </div>
                ))}
              </div>
              <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                  <span>Subtotal</span>
                  <span>₹{total.toLocaleString()}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                  <span>Shipping</span>
                  <span style={{ color: '#4ade80' }}>Free</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: '800', fontSize: '1.1rem', marginTop: '0.75rem', paddingTop: '0.75rem', borderTop: '1px solid var(--border-color)' }}>
                  <span>Total</span>
                  <span style={{ background: 'linear-gradient(135deg, #d4af37, #f0c83a)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                    ₹{total.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}

function Field({ label, icon, children }: { label: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div>
      <label
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.4rem',
          fontSize: '0.82rem',
          fontWeight: '600',
          color: 'var(--text-secondary)',
          marginBottom: '0.4rem',
          textTransform: 'uppercase',
          letterSpacing: '0.04em',
        }}
      >
        {icon} {label}
      </label>
      {children}
    </div>
  )
}
