import { Layout, Navbar } from 'nextra-theme-docs'
import { getPageMap } from 'nextra/page-map'
import './globals.css'

export const metadata = {
  title: {
    template: '%s – Cronstream Docs',
    default: 'Cronstream Docs',
  },
  description: 'CronStream Protocol — milestone-gated token streaming. Funds flow only when work is provably done.',
  metadataBase: new URL('https://docs.cronstream.xyz'),
  icons: {
    icon: '/favicon.png',
    shortcut: '/favicon.png',
    apple: '/favicon.png',
  },
  keywords: ['token streaming', 'milestone-gated payments', 'B2B payroll', 'Uniswap v4 hook', 'EIP-712', 'autonomous agent', 'DeFi', 'Arbitrum', 'open source'],
  openGraph: {
    title: 'Cronstream Docs',
    description: 'CronStream Protocol — milestone-gated token streaming. Funds flow only when work is provably done.',
    url: 'https://docs.cronstream.xyz',
    siteName: 'Cronstream Docs',
    type: 'website',
    images: [{ url: 'https://docs.cronstream.xyz/banner.png' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Cronstream Docs',
    description: 'CronStream Protocol — milestone-gated token streaming. Funds flow only when work is provably done.',
    images: ['https://docs.cronstream.xyz/banner.png'],
  },
}

export default async function RootLayout({ children }) {
  const pageMap = await getPageMap()

  return (
    <html lang="en" dir="ltr" suppressHydrationWarning>
      <body>
        <Layout
          pageMap={pageMap}
          docsRepositoryBase="https://github.com/thecronstream/CronStream/tree/main"
          nextThemes={{ defaultTheme: 'dark' }}
          navbar={
            <Navbar
              logo={
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <img
                    src="/logo.png"
                    width={22}
                    height={22}
                    style={{ borderRadius: 4 }}
                    alt="Cronstream"
                  />
                  <span style={{ fontWeight: 700, letterSpacing: '-0.02em' }}>
                    Cronstream{' '}
                    <span style={{ fontWeight: 400, opacity: 0.5 }}>Docs</span>
                  </span>
                </div>
              }
            />
          }
          footer={
            <p style={{ fontSize: '0.875rem', opacity: 0.6, letterSpacing: '0.01em' }}>
              Cronstream Protocol Lab · Open-source milestone-gated streaming
            </p>
          }
          feedback={{ content: null }}
          editLink={null}
        >
          {children}
        </Layout>
      </body>
    </html>
  )
}
