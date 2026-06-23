import { Layout, Navbar } from 'nextra-theme-docs'
import { getPageMap } from 'nextra/page-map'
import './globals.css'

export const metadata = {
  title: {
    template: '%s – Cronstream Docs',
    default: 'Cronstream Docs',
  },
  description: 'Cronstream Protocol — Uniswap v4 hook for automated yield distribution on RWA and rebasing stablecoin pools.',
  metadataBase: new URL('https://docs.cronstream.xyz'),
  icons: {
    icon: '/favicon.png',
    shortcut: '/favicon.png',
    apple: '/favicon.png',
  },
  openGraph: {
    title: 'Cronstream Docs',
    description: 'Uniswap v4 hook for automated yield distribution on RWA and rebasing stablecoin pools.',
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
                    alt="CronStream"
                  />
                  <span style={{ fontWeight: 700, letterSpacing: '-0.02em' }}>
                    CronStream{' '}
                    <span style={{ fontWeight: 400, opacity: 0.5 }}>Docs</span>
                  </span>
                </div>
              }
            />
          }
          footer={<p>CronStream Protocol · Business Source License 1.1</p>}
          feedback={{ content: null }}
          editLink={null}
        >
          {children}
        </Layout>
      </body>
    </html>
  )
}
