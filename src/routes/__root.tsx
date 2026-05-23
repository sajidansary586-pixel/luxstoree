import { HeadContent, Scripts, createRootRoute } from '@tanstack/react-router'
import { CartProvider } from '@/context/CartContext'
import '../styles.css'

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { title: 'LuxStore — Premium Products' },
      { name: 'description', content: 'Discover premium products with fast delivery and secure payment.' },
    ],
  }),
  shellComponent: RootDocument,
})

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body style={{ background: 'var(--bg-primary)', color: 'var(--text-primary)', margin: 0 }}>
        <CartProvider>
          {children}
        </CartProvider>

        {/* Netlify Forms skeleton for order email notifications */}
        <form
          name="order-notification"
          data-netlify="true"
          data-netlify-honeypot="bot-field"
          hidden
        >
          <input type="hidden" name="form-name" value="order-notification" />
          <input name="bot-field" />
          <input name="order-id" />
          <input name="customer-name" />
          <input name="phone" />
          <input name="email" />
          <input name="address" />
          <input name="items" />
          <input name="total" />
          <input name="payment-ref" />
        </form>

        <Scripts />
      </body>
    </html>
  )
}
