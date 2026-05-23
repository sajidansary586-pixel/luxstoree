import { Link, createFileRoute } from '@tanstack/react-router'
import { XCircle, ShoppingBag } from 'lucide-react'
import { Layout } from '@/components/Layout'

export const Route = createFileRoute('/checkout/cancel')({
  component: CheckoutCancel,
})

function CheckoutCancel() {
  return (
    <Layout>
      <div style={{ minHeight: '70vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem 1.5rem' }}>
        <div style={{ maxWidth: '450px', background: 'var(--bg-card)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '24px', padding: '3rem 2.5rem', textAlign: 'center' }}>
          <XCircle size={48} style={{ color: '#f87171', margin: '0 auto 1rem' }} />
          <h1 style={{ fontSize: '1.5rem', fontWeight: '800', marginBottom: '0.75rem' }}>Order Cancelled</h1>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>No charges were made. Your cart is still saved.</p>
          <Link to="/" className="btn-primary" style={{ textDecoration: 'none', display: 'inline-flex' }}>
            <ShoppingBag size={16} /> Continue Shopping
          </Link>
        </div>
      </div>
    </Layout>
  )
}
