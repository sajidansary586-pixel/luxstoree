import { Link } from "@tanstack/react-router";
import { ShoppingCart, Menu, X, Store } from "lucide-react";
import { useState } from "react";
import { useCart } from "@/context/CartContext";

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-primary)" }}>
      <Navbar />
      <main>{children}</main>
      <Footer />
    </div>
  );
}

function Navbar() {
  const { count } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav
      style={{
        background: "rgba(10,10,15,0.97)",
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
              fontSize: "1.3rem",
              fontWeight: "800",
              background: "linear-gradient(135deg, #8b5cf6, #d4af37)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            LuxStore
          </span>
        </Link>

        <div
          style={{ display: "flex", alignItems: "center", gap: "2rem" }}
          className="hidden md:flex"
        >
          <NavLink to="/">Shop</NavLink>
          <NavLink to="/cart">Cart</NavLink>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <Link to="/cart" style={{ textDecoration: "none" }}>
            <div
              style={{
                padding: "0.5rem 0.75rem",
                borderRadius: "8px",
                border: "1px solid var(--border-color)",
                background: "var(--bg-card)",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "0.4rem",
                color: "var(--text-primary)",
              }}
            >
              <ShoppingCart size={18} />
              {count > 0 && (
                <span
                  style={{
                    background: "linear-gradient(135deg, #8b5cf6, #7c3aed)",
                    color: "white",
                    fontSize: "0.72rem",
                    fontWeight: "700",
                    padding: "1px 7px",
                    borderRadius: "999px",
                  }}
                >
                  {count}
                </span>
              )}
            </div>
          </Link>

          <button
            className="flex md:hidden"
            onClick={() => setMenuOpen(!menuOpen)}
            style={{ background: "transparent", border: "none", color: "var(--text-primary)", cursor: "pointer" }}
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div
          className="md:hidden"
          style={{
            background: "var(--bg-card)",
            borderTop: "1px solid var(--border-color)",
            padding: "1rem 1.5rem",
          }}
        >
          <MobileNavLink to="/" onClick={() => setMenuOpen(false)}>Shop</MobileNavLink>
          <MobileNavLink to="/cart" onClick={() => setMenuOpen(false)}>Cart</MobileNavLink>
        </div>
      )}
    </nav>
  );
}

function NavLink({ to, children }: { to: string; children: React.ReactNode }) {
  return (
    <Link
      to={to}
      style={{ color: "var(--text-secondary)", textDecoration: "none", fontSize: "0.95rem", fontWeight: "500" }}
      activeProps={{ style: { color: "var(--accent-purple)", textDecoration: "none", fontSize: "0.95rem", fontWeight: "600" } }}
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
        display: "block",
        color: "var(--text-secondary)",
        textDecoration: "none",
        fontSize: "1rem",
        fontWeight: "500",
        padding: "0.75rem 0",
        borderBottom: "1px solid var(--border-color)",
      }}
    >
      {children}
    </Link>
  );
}

function Footer() {
  return (
    <footer
      style={{
        borderTop: "1px solid var(--border-color)",
        padding: "2rem 1.5rem",
        textAlign: "center",
        color: "var(--text-secondary)",
        fontSize: "0.85rem",
        marginTop: "4rem",
      }}
    >
      <p style={{ margin: 0 }}>
        &copy; {new Date().getFullYear()} LuxStore. All rights reserved. |{" "}
        <Link to="/admin" style={{ color: "var(--text-secondary)", textDecoration: "none" }}>
          Admin
        </Link>
      </p>
    </footer>
  );
}
