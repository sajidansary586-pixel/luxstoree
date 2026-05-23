import { Link, createFileRoute } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { ShoppingBag, Star, ArrowRight, Sparkles } from 'lucide-react'
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

export const Route = createFileRoute('/')({
  component: ProductsIndex,
})

function ProductsIndex() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [toast, setToast] = useState('')
  const { addToCart } = useCart()

  useEffect(() => {
    // Seed on first load, then fetch products
    fetch('/api/seed', { method: 'POST' })
      .then(() => fetch('/api/products'))
      .then((r) => r.json())
      .then((data) => {
        setProducts(Array.isArray(data) ? data : [])
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  const showToast = (msg: string) => {
    setToast(msg)
    setTimeout(() => setToast(''), 2500)
  }

  const featured = products.filter((p) => p.featured)
  const all = products

  return (
    <Layout>
      {/* Hero */}
      <section
        style={{
          background: 'linear-gradient(135deg, rgba(139,92,246,0.08) 0%, rgba(212,175,55,0.05) 100%)',
          borderBottom: '1px solid var(--border-color)',
          padding: '5rem 1.5rem',
          textAlign: 'center',
        }}
      >
        <div style={{ maxWidth: '700px', margin: '0 auto' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              background: 'rgba(139,92,246,0.15)',
              border: '1px solid rgba(139,92,246,0.3)',
              padding: '0.3rem 0.9rem',
              borderRadius: '999px',
              fontSize: '0.8rem',
              fontWeight: '600',
              color: '#a78bfa',
              marginBottom: '1.5rem',
            }}
          >
            <Sparkles size={12} /> Premium Collection 2025
          </div>
          <h1
            style={{
              fontSize: 'clamp(2.2rem, 5vw, 3.5rem)',
              fontWeight: '900',
              margin: '0 0 1rem',
              lineHeight: '1.1',
              background: 'linear-gradient(135deg, #f1f0ff 30%, #d4af37 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Discover Luxury Products
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', marginBottom: '2rem', lineHeight: '1.7' }}>
            Curated premium products with secure QR bank payment and fast delivery to your doorstep.
          </p>
          <a href="#products" className="btn-gold" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none', borderRadius: '8px', padding: '0.85rem 2rem', fontSize: '1rem' }}>
            <ShoppingBag size={18} /> Shop Now
          </a>
        </div>
      </section>

      {/* Products Grid */}
      <section id="products" style={{ maxWidth: '1200px', margin: '0 auto', padding: '4rem 1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2.5rem' }}>
          <h2 style={{ fontSize: '1.75rem', fontWeight: '800', margin: 0 }}>
            All Products
          </h2>
          <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            {products.length} items
          </span>
        </div>

        {loading ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                style={{
                  background: 'var(--bg-card)',
                  borderRadius: '16px',
                  border: '1px solid var(--border-color)',
                  height: '400px',
                  animation: 'pulse 1.5s infinite',
                }}
              />
            ))}
          </div>
        ) : all.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-secondary)' }}>
            <ShoppingBag size={48} style={{ margin: '0 auto 1rem', opacity: 0.3 }} />
            <p>No products available yet.</p>
          </div>
        ) : (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: '1.5rem',
            }}
          >
            {all.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={() => {
                  addToCart({ id: product.id, name: product.name, price: product.price, image: product.image })
                  showToast(`"${product.name}" added to cart!`)
                }}
              />
            ))}
          </div>
        )}
      </section>

      {/* Toast */}
      {toast && (
        <div className="toast">
          ✓ {toast}
        </div>
      )}
    </Layout>
  )
}

function ProductCard({ product, onAddToCart }: { product: Product; onAddToCart: () => void }) {
  return (
    <div
      className="card-dark"
      style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column' }}
    >
      <Link
        to="/products/$productId"
        params={{ productId: product.id.toString() }}
        style={{ textDecoration: 'none', display: 'block' }}
      >
        <div style={{ position: 'relative', aspectRatio: '4/3', overflow: 'hidden' }}>
          <img
            src={product.image}
            alt={product.name}
            style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.4s' }}
            onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
            onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
          />
          {product.featured && (
            <div
              style={{
                position: 'absolute',
                top: '0.75rem',
                left: '0.75rem',
                background: 'linear-gradient(135deg, #d4af37, #b8960c)',
                color: '#0a0a0f',
                fontSize: '0.7rem',
                fontWeight: '700',
                padding: '0.25rem 0.6rem',
                borderRadius: '999px',
                display: 'flex',
                alignItems: 'center',
                gap: '0.25rem',
              }}
            >
              <Star size={10} fill="currentColor" /> FEATURED
            </div>
          )}
          {!product.inStock && (
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background: 'rgba(0,0,0,0.6)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.9rem',
                fontWeight: '700',
                color: '#aaa',
              }}
            >
              OUT OF STOCK
            </div>
          )}
        </div>
      </Link>

      <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.75rem', flex: 1 }}>
        <div>
          <span
            style={{
              fontSize: '0.7rem',
              fontWeight: '600',
              color: 'var(--accent-purple)',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
            }}
          >
            {product.category}
          </span>
          <Link
            to="/products/$productId"
            params={{ productId: product.id.toString() }}
            style={{ textDecoration: 'none' }}
          >
            <h3 style={{ margin: '0.25rem 0 0', fontSize: '1.05rem', fontWeight: '700', color: 'var(--text-primary)' }}>
              {product.name}
            </h3>
          </Link>
          <p style={{ margin: '0.5rem 0 0', fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
            {product.shortDescription}
          </p>
        </div>

        <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '0.75rem', borderTop: '1px solid var(--border-color)' }}>
          <span
            style={{
              fontSize: '1.3rem',
              fontWeight: '800',
              background: 'linear-gradient(135deg, #d4af37, #f0c83a)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            ₹{product.price.toLocaleString()}
          </span>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <Link
              to="/products/$productId"
              params={{ productId: product.id.toString() }}
              style={{
                padding: '0.5rem',
                borderRadius: '8px',
                border: '1px solid var(--border-color)',
                color: 'var(--text-secondary)',
                display: 'flex',
                alignItems: 'center',
                textDecoration: 'none',
              }}
            >
              <ArrowRight size={15} />
            </Link>
            <button
              className="btn-primary"
              style={{ padding: '0.5rem 0.9rem', fontSize: '0.8rem' }}
              onClick={onAddToCart}
              disabled={!product.inStock}
            >
              <ShoppingBag size={14} /> Add
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
