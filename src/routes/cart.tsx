import { createFileRoute, Link } from '@tanstack/react-router'
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight } from 'lucide-react'
import { useCart } from '@/context/CartContext'
import { Layout } from '@/components/Layout'

export const Route = createFileRoute('/cart')({
  component: CartPage,
})

function CartPage() {
  const { items, removeFromCart, updateQty, total, clearCart } = useCart()

  if (items.length === 0) {
    return (
      <Layout>
        <div
          style={{
            maxWidth: '600px',
            margin: '6rem auto',
            padding: '0 1.5rem',
            textAlign: 'center',
          }}
        >
          <div
            style={{
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              background: 'var(--bg-card)',
              border: '1px solid var(--border-color)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.5rem',
            }}
          >
            <ShoppingBag size={32} style={{ color: 'var(--text-secondary)' }} />
          </div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: '800', marginBottom: '0.75rem' }}>
            Your cart is empty
          </h1>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
            Add some products to get started.
          </p>
          <Link to="/" className="btn-primary" style={{ textDecoration: 'none', display: 'inline-flex' }}>
            <ShoppingBag size={16} /> Continue Shopping
          </Link>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '2.5rem 1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '1.75rem', fontWeight: '800', margin: 0 }}>Shopping Cart</h1>
          <button
            onClick={clearCart}
            style={{
              background: 'transparent',
              border: '1px solid rgba(239,68,68,0.3)',
              color: '#f87171',
              padding: '0.4rem 0.9rem',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '0.85rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
            }}
          >
            <Trash2 size={14} /> Clear All
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
          {items.map((item) => (
            <div
              key={item.id}
              className="card-dark"
              style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', padding: '1rem 1.25rem' }}
            >
              <img
                src={item.image}
                alt={item.name}
                style={{
                  width: '80px',
                  height: '80px',
                  objectFit: 'cover',
                  borderRadius: '10px',
                  border: '1px solid var(--border-color)',
                  flexShrink: 0,
                }}
              />
              <div style={{ flex: 1 }}>
                <h3 style={{ margin: '0 0 0.25rem', fontWeight: '700', fontSize: '1rem' }}>{item.name}</h3>
                <span
                  style={{
                    fontSize: '1.1rem',
                    fontWeight: '700',
                    background: 'linear-gradient(135deg, #d4af37, #f0c83a)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  ₹{item.price.toLocaleString()}
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <button
                  onClick={() => updateQty(item.id, item.qty - 1)}
                  style={{
                    width: '30px',
                    height: '30px',
                    borderRadius: '6px',
                    border: '1px solid var(--border-color)',
                    background: 'var(--bg-secondary)',
                    color: 'var(--text-primary)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Minus size={14} />
                </button>
                <span style={{ minWidth: '28px', textAlign: 'center', fontWeight: '700' }}>{item.qty}</span>
                <button
                  onClick={() => updateQty(item.id, item.qty + 1)}
                  style={{
                    width: '30px',
                    height: '30px',
                    borderRadius: '6px',
                    border: '1px solid var(--border-color)',
                    background: 'var(--bg-secondary)',
                    color: 'var(--text-primary)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Plus size={14} />
                </button>
              </div>
              <div style={{ minWidth: '90px', textAlign: 'right', fontWeight: '700' }}>
                ₹{(item.price * item.qty).toLocaleString()}
              </div>
              <button
                onClick={() => removeFromCart(item.id)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#f87171',
                  cursor: 'pointer',
                  padding: '0.25rem',
                }}
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div
          className="card-dark gold-border"
          style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}
        >
          <div>
            <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Order Total</p>
            <p
              style={{
                margin: '0.25rem 0 0',
                fontSize: '2rem',
                fontWeight: '900',
                background: 'linear-gradient(135deg, #d4af37, #f0c83a)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              ₹{total.toLocaleString()}
            </p>
          </div>
          <Link
            to="/checkout"
            className="btn-gold"
            style={{ textDecoration: 'none', fontSize: '1rem', padding: '0.9rem 2rem', borderRadius: '8px', display: 'inline-flex', alignItems: 'center', gap: '0.5rem', fontWeight: '700', color: '#0a0a0f' }}
          >
            Proceed to Checkout <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    </Layout>
  )
}
