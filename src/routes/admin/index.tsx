import { createFileRoute, useNavigate, Link } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import { Plus, Trash2, Edit3, Package, ShoppingCart, Users, CheckCircle, XCircle, Star, LogOut, Save, X, Upload } from 'lucide-react'

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

interface Order {
  id: number
  customerName: string
  phone: string
  address: string
  pincode: string
  email: string
  items: Array<{ id: number; name: string; price: number; qty: number }>
  total: number
  status: string
  paymentRef: string | null
  createdAt: string
}

export const Route = createFileRoute('/admin/')({
  component: AdminDashboard,
})

function AdminDashboard() {
  const navigate = useNavigate()
  const [authed, setAuthed] = useState(false)
  const [tab, setTab] = useState<'products' | 'orders'>('products')
  const [products, setProducts] = useState<Product[]>([])
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [toast, setToast] = useState('')

  const showMsg = (msg: string) => {
    setToast(msg)
    setTimeout(() => setToast(''), 3000)
  }

  useEffect(() => {
    const token = sessionStorage.getItem('admin_token')
    if (!token) {
      navigate({ to: '/admin/login' })
      return
    }
    setAuthed(true)
    loadData()
  }, [])

  const loadData = () => {
    Promise.all([
      fetch('/api/products').then((r) => r.json()),
      fetch('/api/orders').then((r) => r.json()),
    ]).then(([prods, ords]) => {
      setProducts(Array.isArray(prods) ? prods : [])
      setOrders(Array.isArray(ords) ? ords : [])
      setLoading(false)
    }).catch(() => setLoading(false))
  }

  const deleteProduct = async (id: number) => {
    if (!confirm('Delete this product?')) return
    await fetch(`/api/products?id=${id}`, { method: 'DELETE' })
    setProducts((p) => p.filter((x) => x.id !== id))
    showMsg('Product deleted.')
  }

  const logout = () => {
    sessionStorage.removeItem('admin_token')
    navigate({ to: '/' })
  }

  if (!authed) return null

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)' }}>
      {/* Admin navbar */}
      <div
        style={{
          background: 'rgba(10,10,15,0.97)',
          backdropFilter: 'blur(20px)',
          borderBottom: '1px solid var(--border-color)',
          position: 'sticky',
          top: 0,
          zIndex: 100,
          padding: '0 1.5rem',
          height: '64px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <Link to="/" style={{ textDecoration: 'none', fontSize: '1.2rem', fontWeight: '800', background: 'linear-gradient(135deg, #8b5cf6, #d4af37)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            LuxStore
          </Link>
          <span style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', background: 'rgba(139,92,246,0.15)', padding: '0.2rem 0.6rem', borderRadius: '999px', border: '1px solid rgba(139,92,246,0.3)', color: '#a78bfa' }}>
            Admin
          </span>
        </div>
        <button
          onClick={logout}
          style={{ background: 'transparent', border: '1px solid var(--border-color)', color: 'var(--text-secondary)', padding: '0.4rem 0.9rem', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem' }}
        >
          <LogOut size={14} /> Logout
        </button>
      </div>

      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '2rem 1.5rem' }}>
        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
          {[
            { icon: <Package size={20} />, label: 'Products', value: products.length, color: '#8b5cf6' },
            { icon: <ShoppingCart size={20} />, label: 'Total Orders', value: orders.length, color: '#d4af37' },
            { icon: <CheckCircle size={20} />, label: 'Revenue', value: `₹${orders.reduce((s, o) => s + o.total, 0).toLocaleString()}`, color: '#4ade80' },
            { icon: <Users size={20} />, label: 'Customers', value: new Set(orders.map((o) => o.email)).size, color: '#60a5fa' },
          ].map((stat) => (
            <div
              key={stat.label}
              className="card-dark"
              style={{ padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '1rem' }}
            >
              <div style={{ width: '44px', height: '44px', borderRadius: '10px', background: `${stat.color}20`, border: `1px solid ${stat.color}40`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: stat.color, flexShrink: 0 }}>
                {stat.icon}
              </div>
              <div>
                <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: '600', textTransform: 'uppercase' }}>{stat.label}</p>
                <p style={{ margin: '0.1rem 0 0', fontSize: '1.3rem', fontWeight: '800' }}>{stat.value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', background: 'var(--bg-card)', padding: '0.3rem', borderRadius: '10px', width: 'fit-content', border: '1px solid var(--border-color)' }}>
          {[
            { key: 'products', label: 'Products', icon: <Package size={15} /> },
            { key: 'orders', label: 'Orders', icon: <ShoppingCart size={15} /> },
          ].map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key as typeof tab)}
              style={{
                background: tab === t.key ? 'var(--accent-purple)' : 'transparent',
                color: tab === t.key ? 'white' : 'var(--text-secondary)',
                border: 'none',
                padding: '0.5rem 1rem',
                borderRadius: '7px',
                cursor: 'pointer',
                fontWeight: '600',
                fontSize: '0.9rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
              }}
            >
              {t.icon} {t.label}
            </button>
          ))}
        </div>

        {/* Products Tab */}
        {tab === 'products' && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
              <h2 style={{ margin: 0, fontSize: '1.2rem', fontWeight: '700' }}>Product Management</h2>
              <button
                className="btn-primary"
                onClick={() => { setShowAddForm(true); setEditingProduct(null) }}
                style={{ fontSize: '0.9rem' }}
              >
                <Plus size={16} /> Add Product
              </button>
            </div>

            {(showAddForm || editingProduct) && (
              <ProductForm
                product={editingProduct}
                onSave={(p) => {
                  if (editingProduct) {
                    setProducts((prev) => prev.map((x) => (x.id === p.id ? p : x)))
                    showMsg('Product updated!')
                  } else {
                    setProducts((prev) => [p, ...prev])
                    showMsg('Product added!')
                  }
                  setShowAddForm(false)
                  setEditingProduct(null)
                }}
                onCancel={() => { setShowAddForm(false); setEditingProduct(null) }}
              />
            )}

            {loading ? (
              <div style={{ color: 'var(--text-secondary)', padding: '2rem', textAlign: 'center' }}>Loading...</div>
            ) : products.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>No products yet.</div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1rem' }}>
                {products.map((p) => (
                  <div key={p.id} className="card-dark" style={{ overflow: 'hidden' }}>
                    <div style={{ position: 'relative', aspectRatio: '16/9' }}>
                      <img src={p.image} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      <div style={{ position: 'absolute', top: '0.5rem', right: '0.5rem', display: 'flex', gap: '0.4rem' }}>
                        {p.featured && (
                          <span style={{ background: 'rgba(212,175,55,0.9)', color: '#0a0a0f', fontSize: '0.65rem', fontWeight: '800', padding: '0.2rem 0.5rem', borderRadius: '999px' }}>
                            ★ FEATURED
                          </span>
                        )}
                        {!p.inStock && (
                          <span style={{ background: 'rgba(239,68,68,0.9)', color: 'white', fontSize: '0.65rem', fontWeight: '800', padding: '0.2rem 0.5rem', borderRadius: '999px' }}>
                            OUT OF STOCK
                          </span>
                        )}
                      </div>
                    </div>
                    <div style={{ padding: '1rem' }}>
                      <p style={{ margin: '0 0 0.2rem', fontSize: '0.7rem', color: 'var(--accent-purple)', fontWeight: '700', textTransform: 'uppercase' }}>{p.category}</p>
                      <h3 style={{ margin: '0 0 0.25rem', fontWeight: '700', fontSize: '1rem' }}>{p.name}</h3>
                      <p style={{ margin: '0 0 0.75rem', color: 'var(--text-secondary)', fontSize: '0.8rem' }}>{p.shortDescription}</p>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <span style={{ fontWeight: '800', fontSize: '1.1rem', background: 'linear-gradient(135deg, #d4af37, #f0c83a)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                          ₹{p.price.toLocaleString()}
                        </span>
                        <div style={{ display: 'flex', gap: '0.4rem' }}>
                          <button
                            onClick={() => { setEditingProduct(p); setShowAddForm(false) }}
                            style={{ padding: '0.4rem 0.7rem', borderRadius: '6px', border: '1px solid var(--border-color)', background: 'transparent', color: 'var(--text-secondary)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.8rem' }}
                          >
                            <Edit3 size={13} /> Edit
                          </button>
                          <button
                            onClick={() => deleteProduct(p.id)}
                            style={{ padding: '0.4rem 0.7rem', borderRadius: '6px', border: '1px solid rgba(239,68,68,0.3)', background: 'transparent', color: '#f87171', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.8rem' }}
                          >
                            <Trash2 size={13} /> Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Orders Tab */}
        {tab === 'orders' && (
          <div>
            <h2 style={{ margin: '0 0 1.25rem', fontSize: '1.2rem', fontWeight: '700' }}>Customer Orders</h2>
            {loading ? (
              <div style={{ color: 'var(--text-secondary)', padding: '2rem', textAlign: 'center' }}>Loading...</div>
            ) : orders.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>No orders yet.</div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {orders.map((order) => (
                  <div key={order.id} className="card-dark" style={{ padding: '1.25rem' }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '1rem' }}>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                          <span style={{ fontWeight: '700', fontSize: '0.95rem' }}>{order.customerName}</span>
                          <span
                            style={{
                              fontSize: '0.7rem',
                              fontWeight: '700',
                              padding: '0.15rem 0.5rem',
                              borderRadius: '999px',
                              background: order.status === 'completed' ? 'rgba(74,222,128,0.15)' : 'rgba(251,191,36,0.15)',
                              color: order.status === 'completed' ? '#4ade80' : '#fbbf24',
                              border: `1px solid ${order.status === 'completed' ? 'rgba(74,222,128,0.3)' : 'rgba(251,191,36,0.3)'}`,
                              textTransform: 'uppercase',
                            }}
                          >
                            {order.status}
                          </span>
                        </div>
                        <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                          Order #{order.id} · {order.email} · {order.phone}
                        </p>
                        <p style={{ margin: '0.2rem 0 0', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                          {order.address}, {order.pincode}
                        </p>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <p
                          style={{
                            margin: 0,
                            fontSize: '1.3rem',
                            fontWeight: '900',
                            background: 'linear-gradient(135deg, #d4af37, #f0c83a)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                          }}
                        >
                          ₹{order.total.toLocaleString()}
                        </p>
                        <p style={{ margin: '0.1rem 0 0', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                          {new Date(order.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                        </p>
                        {order.paymentRef && (
                          <p style={{ margin: '0.2rem 0 0', fontSize: '0.75rem', color: '#a78bfa' }}>
                            Ref: {order.paymentRef}
                          </p>
                        )}
                      </div>
                    </div>
                    <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '0.75rem' }}>
                      <p style={{ margin: '0 0 0.4rem', fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase', fontWeight: '600', letterSpacing: '0.04em' }}>Items</p>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                        {Array.isArray(order.items) && order.items.map((item, i) => (
                          <span key={i} style={{ fontSize: '0.8rem', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', padding: '0.2rem 0.6rem', borderRadius: '6px' }}>
                            {item.name} ×{item.qty}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {toast && <div className="toast">✓ {toast}</div>}
    </div>
  )
}

function ProductForm({
  product,
  onSave,
  onCancel,
}: {
  product: Product | null
  onSave: (p: Product) => void
  onCancel: () => void
}) {
  const [form, setForm] = useState({
    name: product?.name || '',
    description: product?.description || '',
    shortDescription: product?.shortDescription || '',
    price: product?.price?.toString() || '',
    image: product?.image || '/placeholder.png',
    category: product?.category || 'General',
    inStock: product?.inStock ?? true,
    featured: product?.featured ?? false,
  })
  const [saving, setSaving] = useState(false)

  const update = (k: string, v: unknown) => setForm((p) => ({ ...p, [k]: v }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      const body = { ...form, price: Number(form.price) }
      let res: Response
      if (product) {
        res = await fetch(`/api/products?id=${product.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        })
      } else {
        res = await fetch('/api/products', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        })
      }
      const data = await res.json()
      onSave(data)
    } finally {
      setSaving(false)
    }
  }

  const inputStyle = { marginBottom: '1rem' }

  return (
    <div
      className="card-dark"
      style={{ padding: '1.75rem', marginBottom: '1.5rem', border: '1px solid rgba(139,92,246,0.3)' }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
        <h3 style={{ margin: 0, fontWeight: '700', fontSize: '1rem' }}>
          {product ? 'Edit Product' : 'Add New Product'}
        </h3>
        <button onClick={onCancel} style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}>
          <X size={18} />
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
          <div style={inputStyle}>
            <label style={labelStyle}>Product Name *</label>
            <input className="input-dark" value={form.name} onChange={(e) => update('name', e.target.value)} required placeholder="Product name" />
          </div>
          <div style={inputStyle}>
            <label style={labelStyle}>Price (₹) *</label>
            <input className="input-dark" type="number" value={form.price} onChange={(e) => update('price', e.target.value)} required placeholder="0" min="0" />
          </div>
          <div style={inputStyle}>
            <label style={labelStyle}>Category</label>
            <input className="input-dark" value={form.category} onChange={(e) => update('category', e.target.value)} placeholder="e.g. Electronics" />
          </div>
          <div style={inputStyle}>
            <label style={labelStyle}>Image URL</label>
            <input className="input-dark" value={form.image} onChange={(e) => update('image', e.target.value)} placeholder="/placeholder.png" />
          </div>
        </div>

        <div style={inputStyle}>
          <label style={labelStyle}>Short Description</label>
          <input className="input-dark" value={form.shortDescription} onChange={(e) => update('shortDescription', e.target.value)} placeholder="Brief product summary" />
        </div>

        <div style={inputStyle}>
          <label style={labelStyle}>Full Description</label>
          <textarea className="input-dark" value={form.description} onChange={(e) => update('description', e.target.value)} rows={3} placeholder="Full product description" style={{ resize: 'vertical' }} />
        </div>

        <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '1.5rem' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.9rem', fontWeight: '600' }}>
            <input type="checkbox" checked={form.inStock} onChange={(e) => update('inStock', e.target.checked)} style={{ width: '16px', height: '16px', accentColor: 'var(--accent-purple)' }} />
            In Stock
          </label>
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.9rem', fontWeight: '600' }}>
            <input type="checkbox" checked={form.featured} onChange={(e) => update('featured', e.target.checked)} style={{ width: '16px', height: '16px', accentColor: '#d4af37' }} />
            <Star size={14} style={{ color: '#d4af37' }} /> Featured
          </label>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button type="button" className="btn-outline" onClick={onCancel}>Cancel</button>
          <button type="submit" className="btn-primary" disabled={saving}>
            <Save size={15} /> {saving ? 'Saving...' : product ? 'Update Product' : 'Add Product'}
          </button>
        </div>
      </form>
    </div>
  )
}

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontSize: '0.78rem',
  fontWeight: '600',
  color: 'var(--text-secondary)',
  marginBottom: '0.35rem',
  textTransform: 'uppercase',
  letterSpacing: '0.04em',
}
