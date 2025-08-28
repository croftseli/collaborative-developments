import './globals.css'
import { AuthProvider } from '../contexts/AuthContext'
import Layout from '../components/Layout'

export const metadata = {
  title: 'Collaborative Developments LLC',
  description: 'Foster community engagement, provide valuable resources, and facilitate collaboration.',
  icons: {
    icon: '/logo.jpg',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/logo.jpg" type="image/jpeg" />
      </head>
      <body>
        <AuthProvider>
          <Layout>
            {children}
          </Layout>
        </AuthProvider>
      </body>
    </html>
  )
}