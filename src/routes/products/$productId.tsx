import { Link, createFileRoute } from '@tanstack/react-router'
import { ShoppingBag, ArrowLeft, Star, Package } from 'lucide-react'
import { useState } from 'react'
import { useCart } from '@/context/CartContext'
import { Layout } from '@/components/Layout'

interface Product {
  id: number
  name: string
  description: string
  shortDescription: string
  price: number
  image: string
  category: string
  inStock: boolean
  featured: boolean
}

export const Route = createFileRoute('/products/$productId')({
  component: RouteComponent,
  loader: async ({ params }) => {
    const res = await fetch('/api/products')
    const products: Product[] = await res.json()
    const product = products.find((p) => p.id === +params.productId)
    if (!product) throw new Error('Product not found')
    return product
  },
})

function RouteComponent() {
  const product = Route.useLoaderData()
  const { addToCart, items } = useCart()
  const [toast, setToast] = useState('')
  const inCart = items.find((i) => i.id === product.id)

  const handleAdd = () => {
    addToCart({ id: product.id, name: product.name, price: product.price, image: product.image })
    setToast('Added to cart!')
    setTimeout(() => setToast(''), 2500)
  }

  return (
    <Layout>
      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '2rem 1.5rem' }}>
        <Link
          to="/"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            color: 'var(--text-secondary)',
            textDecoration: 'none',
            fontSize: '0.9rem',
            marginBottom: '2rem',
          }}
        >
          <ArrowLeft size={16} /> Back to Shop
        </Link>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }} className="md:flex-row">
          {/* Image */}
          <div style={{ flex: '0 0 55%' }}>
            <div
              style={{
                borderRadius: '20px',
                overflow: 'hidden',
                border: '1px solid var(--border-color)',
                aspectRatio: '4/3',
              }}
            >
              <img
                src={product.image}
                alt={product.name}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>
          </div>

          {/* Details */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div>
              <span
                style={{
                  fontSize: '0.75rem',
                  fontWeight: '700',
                  color: 'var(--accent-purple)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                }}
              >
                {product.category}
              </span>
              {product.featured && (
                <span
                  style={{
                    marginLeft: '0.75rem',
                    fontSize: '0.7rem',
                    fontWeight: '700',
                    background: 'linear-gradient(135deg, #d4af37, #b8960c)',
                    color: '#0a0a0f',
                    padding: '0.2rem 0.55rem',
                    borderRadius: '999px',
                  }}
                >
                  <Star size={9} style={{ display: 'inline', marginRight: '2px' }} fill="currentColor" />
                  FEATURED
                </span>
              )}
              <h1 style={{ fontSize: 'clamp(1.5rem, 3vw, 2.2rem)', fontWeight: '900', margin: '0.5rem 0', lineHeight: 1.2 }}>
                {product.name}
              </h1>
            </div>

            <p style={{ color: 'var(--text-secondary)', lineHeight: '1.75', margin: 0 }}>
              {product.description}
            </p>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.6rem 0.9rem',
                borderRadius: '8px',
                background: product.inStock ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)',
                border: `1px solid ${product.inStock ? 'rgba(34,197,94,0.3)' : 'rgba(239,68,68,0.3)'}`,
                width: 'fit-content',
                fontSize: '0.85rem',
                fontWeight: '600',
                color: product.inStock ? '#4ade80' : '#f87171',
              }}
            >
              <Package size={14} />
              {product.inStock ? 'In Stock — Ready to Ship' : 'Out of Stock'}
            </div>

            <div
              style={{
                fontSize: '2.5rem',
                fontWeight: '900',
                background: 'linear-gradient(135deg, #d4af37, #f0c83a)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              ₹{product.price.toLocaleString()}
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
              <button
                className="btn-primary"
                onClick={handleAdd}
                disabled={!product.inStock}
                style={{ fontSize: '1rem', padding: '0.85rem 1.75rem' }}
              >
                <ShoppingBag size={18} />
                {inCart ? `In Cart (${inCart.qty})` : 'Add to Cart'}
              </button>
              {inCart && (
                <Link
                  to="/cart"
                  className="btn-gold"
                  style={{ textDecoration: 'none', fontSize: '1rem', padding: '0.85rem 1.75rem', borderRadius: '8px', display: 'inline-flex', alignItems: 'center', gap: '0.5rem', fontWeight: '700', color: '#0a0a0f' }}
                >
                  View Cart →
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      {toast && <div className="toast">✓ {toast}</div>}
    </Layout>
  )
}
