import Layout from './component/Layout'
import './globals.css'

export const metadata = {
  title: 'WebUtsav Admin',
  description: 'WebUtsav Admin Dashboard - Manage your platform efficiently',
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