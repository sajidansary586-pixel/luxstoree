import { Link, createFileRoute } from '@tanstack/react-router'
import { CheckCircle, ShoppingBag, Package, Mail } from 'lucide-react'
import { Layout } from '@/components/Layout'
import { z } from 'zod'

export const Route = createFileRoute('/checkout/success')({
  validateSearch: z.object({ orderId: z.number().optional() }),
  component: CheckoutSuccess,
})

function CheckoutSuccess() {
  const { orderId } = Route.useSearch()

  return (
    <Layout>
      <div
        style={{
          minHeight: '70vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '2rem 1.5rem',
        }}
      >
        <div
          style={{
            maxWidth: '500px',
            width: '100%',
            background: 'var(--bg-card)',
            border: '1px solid rgba(74,222,128,0.3)',
            borderRadius: '24px',
            padding: '3rem 2.5rem',
            textAlign: 'center',
            boxShadow: '0 0 50px rgba(74,222,128,0.08)',
          }}
        >
          <div
            style={{
              width: '72px',
              height: '72px',
              borderRadius: '50%',
              background: 'rgba(74,222,128,0.1)',
              border: '2px solid rgba(74,222,128,0.4)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.5rem',
            }}
          >
            <CheckCircle size={36} style={{ color: '#4ade80' }} />
          </div>

          <h1 style={{ fontSize: '1.75rem', fontWeight: '900', marginBottom: '0.75rem', color: '#4ade80' }}>
            Order Placed!
          </h1>

          {orderId && (
            <div
              style={{
                background: 'rgba(139,92,246,0.1)',
                border: '1px solid rgba(139,92,246,0.25)',
                borderRadius: '10px',
                padding: '0.6rem 1rem',
                marginBottom: '1.25rem',
                fontSize: '0.85rem',
                color: 'var(--text-secondary)',
              }}
            >
              Order #{orderId}
            </div>
          )}

          <p style={{ color: 'var(--text-secondary)', lineHeight: '1.7', marginBottom: '1.5rem' }}>
            Thank you for your purchase! Your order has been received. We will verify your payment and process the delivery shortly.
          </p>

          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '0.75rem',
              marginBottom: '2rem',
              textAlign: 'left',
            }}
          >
            {[
              { icon: <CheckCircle size={15} />, text: 'Order saved to our system' },
              { icon: <Mail size={15} />, text: 'Confirmation sent to your email' },
              { icon: <Package size={15} />, text: 'Delivery will be arranged within 2-3 days' },
            ].map((item, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                <span style={{ color: '#4ade80' }}>{item.icon}</span>
                {item.text}
              </div>
            ))}
          </div>

          <Link
            to="/"
            className="btn-primary"
            style={{ textDecoration: 'none', display: 'inline-flex', justifyContent: 'center', width: '100%', padding: '0.9rem' }}
          >
            <ShoppingBag size={16} /> Continue Shopping
          </Link>
        </div>
      </div>
    </Layout>
  )
}
