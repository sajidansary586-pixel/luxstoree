import { Link } from "@tanstack/react-router";
import { ShoppingCart, Menu, X, Store } from "lucide-react";
import { useState } from "react";
import { useCart } from "@/context/CartContext";

export function Navbar() {
  const { count } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav
      style={{
        background: "rgba(10,10,15,0.95)",
        backdropFilter: "blur(20px)",
        borderBottom: "1px solid var(--border-color)",
        position: "sticky",
        top: 0,
        zIndex: 100,
      }}
    >
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "0 1.5rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          height: "64px",
        }}
      >
        {/* Logo */}
        <Link to="/" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <div
            style={{
              width: "36px",
              height: "36px",
              borderRadius: "8px",
              background: "linear-gradient(135deg, #8b5cf6, #d4af37)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Store size={18} color="white" />
          </div>
          <span
            style={{
              fontSize: "1.25rem",
              fontWeight: "800",
              background: "linear-gradient(135deg, #8b5cf6, #d4af37)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            LuxStore
          </span>
        </Link>

        {/* Desktop Nav */}
        <div style={{ display: "flex", alignItems: "center", gap: "2rem" }} className="hidden md:flex">
          <NavLink to="/">Shop</NavLink>
          <NavLink to="/cart">Cart</NavLink>
        </div>

        {/* Cart + Menu */}
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <Link to="/cart" style={{ textDecoration: "none", position: "relative" }}>
            <div
              style={{
                padding: "0.5rem",
                borderRadius: "8px",
                border: "1px solid var(--border-color)",
                background: "var(--bg-card)",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "0.4rem",
                color: "var(--text-primary)",
                transition: "border-color 0.2s",
              }}
            >
              <ShoppingCart size={18} />
              {count > 0 && (
                <span
                  style={{
                    background: "linear-gradient(135deg, #8b5cf6, #7c3aed)",
                    color: "white",
                    fontSize: "0.7rem",
                    fontWeight: "700",
                    padding: "1px 6px",
                    borderRadius: "999px",
                    minWidth: "18px",
                    textAlign: "center",
                  }}
                >
                  {count}
                </span>
              )}
            </div>
          </Link>

          {/* Mobile menu toggle */}
          <button
            className="md:hidden"
            onClick={() => setMenuOpen(!menuOpen)}
            style={{
              background: "transparent",
              border: "none",
              color: "var(--text-primary)",
              cursor: "pointer",
              padding: "0.25rem",
            }}
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div
          style={{
            background: "var(--bg-card)",
            borderTop: "1px solid var(--border-color)",
            padding: "1rem 1.5rem",
          }}
          className="md:hidden"
        >
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <MobileNavLink to="/" onClick={() => setMenuOpen(false)}>Shop</MobileNavLink>
            <MobileNavLink to="/cart" onClick={() => setMenuOpen(false)}>Cart</MobileNavLink>
          </div>
        </div>
      )}
    </nav>
  );
}

function NavLink({ to, children }: { to: string; children: React.ReactNode }) {
  return (
    <Link
      to={to}
      style={{
        color: "var(--text-secondary)",
        textDecoration: "none",
        fontSize: "0.95rem",
        fontWeight: "500",
        transition: "color 0.2s",
      }}
      activeProps={{ style: { color: "var(--accent-purple)" } }}
    >
      {children}
    </Link>
  );
}

function MobileNavLink({ to, children, onClick }: { to: string; children: React.ReactNode; onClick: () => void }) {
  return (
    <Link
      to={to}
      onClick={onClick}
      style={{
        color: "var(--text-secondary)",
        textDecoration: "none",
        fontSize: "1rem",
        fontWeight: "500",
        padding: "0.5rem 0",
        borderBottom: "1px solid var(--border-color)",
      }}
    >
      {children}
    </Link>
  );
}
