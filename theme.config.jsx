export default {
  logo: (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      <img src="/logo.png" width={22} height={22} style={{ borderRadius: 4 }} alt="CronStream" />
      <span style={{ fontWeight: 700, letterSpacing: '-0.02em' }}>
        CronStream <span style={{ fontWeight: 400, opacity: 0.5 }}>Docs</span>
      </span>
    </div>
  ),
  project: {
    link: 'https://github.com/thecronstream/CronStream',
  },
  docsRepositoryBase: 'https://github.com/thecronstream/CronStream/tree/main',
  useNextSeoProps() {
    return {
      titleTemplate: '%s – CronStream Docs',
    }
  },
  head: (
    <>
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta name="description" content="CronStream API reference and integration guides. Milestone-verified payment streams for contractors and teams." />
      <meta property="og:title" content="CronStream Docs" />
      <meta property="og:description" content="CronStream API reference and integration guides." />
      <meta property="og:image" content="https://docs.cronstream.xyz/og-image.svg" />
      <link rel="icon" href="/favicon.png" type="image/png" />
    </>
  ),
  sidebar: {
    defaultMenuCollapseLevel: 1,
    toggleButton: true,
  },
  toc: {
    backToTop: true,
  },
  footer: {
    text: 'CronStream Protocol · Business Source License 1.1',
  },
  primaryHue: 168,
}
