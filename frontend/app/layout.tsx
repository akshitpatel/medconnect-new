import './globals.css'
import './styles/theme.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { AuthProvider } from './contexts/AuthContext'
import { ThemeProvider } from './contexts/ThemeContext'
// Removing Header import as we'll handle navigation in page components
// import Header from './components/Header'
// Not removing Footer as we might need it on other pages
import FooterWrapper from './components/FooterWrapper'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'MedConnect - Healthcare Solutions',
  description: 'Connect with healthcare providers and manage your medical needs',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Footer will be rendered by default unless we're in the providers section 
  // where the providers layout has its own footer
  
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className={inter.className}>
        <ThemeProvider>
          <AuthProvider>
            {/* Removed Header component to avoid duplicate navigation */}
            <main>
              {children}
            </main>
            {/* FooterWrapper will conditionally render the Footer based on the current path */}
            <FooterWrapper />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
} 