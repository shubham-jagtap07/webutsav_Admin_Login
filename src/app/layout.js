import Layout from './component/Layout'
import './globals.css'

export const metadata = {
  title: 'ShopApp',
  description: 'Modern e-commerce application',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Layout>
          {children}
        </Layout>
      </body>
    </html>
  )
}