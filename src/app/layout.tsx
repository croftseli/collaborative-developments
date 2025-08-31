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
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Jost:ital,wght@0,100..900;1,100..900&display=swap" rel="stylesheet" />
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