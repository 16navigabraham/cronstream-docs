import { Layout, Navbar } from 'nextra-theme-docs'
import { getPageMap } from 'nextra/page-map'
import 'nextra-theme-docs/style.css'

export const metadata = {
  title: {
    template: '%s – CronStream Docs',
    default: 'CronStream Docs',
  },
  description: 'CronStream API reference and integration guides. Milestone-verified payment streams for contractors and teams.',
  metadataBase: new URL('https://docs.cronstream.xyz'),
  openGraph: {
    title: 'CronStream Docs',
    description: 'CronStream API reference and integration guides.',
    images: '/og-image.svg',
  },
}

export default async function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Layout
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
          pageMap={await getPageMap()}
          docsRepositoryBase="https://github.com/thecronstream/CronStream/tree/main"
          sidebar={{ defaultMenuCollapseLevel: 1 }}
          toc={{ backToTop: true }}
          footer={<p>CronStream Protocol · Business Source License 1.1</p>}
          primaryHue={168}
        >
          {children}
        </Layout>
      </body>
    </html>
  )
}
