import { useState } from 'react';
import Sidebar      from './components/Sidebar.jsx';
import Toc          from './components/Toc.jsx';
import { useToc }   from './hooks/useToc.js';
import Introduction  from './docs/Introduction.jsx';
import HowItWorks    from './docs/HowItWorks.jsx';
import X402          from './docs/X402.jsx';
import ApiReference  from './docs/ApiReference.jsx';
import Schemas       from './docs/Schemas.jsx';

const PAGES = {
  introduction:    { label: 'Introduction',     component: Introduction  },
  'how-it-works':  { label: 'How It Works',     component: HowItWorks   },
  x402:            { label: 'x402 Protocol',    component: X402          },
  'api-reference': { label: 'API Reference',    component: ApiReference  },
  schemas:         { label: 'Response Schemas', component: Schemas       },
};

const NAV = [
  { group: 'Getting Started', items: ['introduction', 'how-it-works'] },
  { group: 'Payments',        items: ['x402'] },
  { group: 'API',             items: ['api-reference', 'schemas'] },
];

export default function App() {
  const [page, setPage]             = useState('introduction');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const toc = useToc(page);

  const Page = PAGES[page]?.component ?? Introduction;

  function navigate(id) {
    setPage(id);
    setSidebarOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  const pageKeys   = Object.keys(PAGES);
  const currentIdx = pageKeys.indexOf(page);
  const prev       = pageKeys[currentIdx - 1];
  const next       = pageKeys[currentIdx + 1];

  return (
    <div className="min-h-screen bg-bg text-[#C8E8E4]" style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}>

      {/* ── Navbar ─────────────────────────────────────────── */}
      <header className="fixed top-0 left-0 right-0 z-50 h-14 border-b border-border bg-bg/90 backdrop-blur-sm flex items-center px-5 gap-4">
        {/* Mobile menu */}
        <button
          onClick={() => setSidebarOpen(true)}
          className="lg:hidden p-1.5 text-muted hover:text-accent transition-colors"
        >
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <line x1="3" y1="6"  x2="21" y2="6"/>
            <line x1="3" y1="12" x2="21" y2="12"/>
            <line x1="3" y1="18" x2="21" y2="18"/>
          </svg>
        </button>

        {/* Logo */}
        <div className="flex items-center gap-2.5 flex-shrink-0">
          <img src="/logo.png" alt="CronStream" className="w-6 h-6 rounded-md object-contain" />
          <span style={{ fontFamily: "'Outfit', system-ui", fontWeight: 700, fontSize: '1.1rem', letterSpacing: '-0.02em' }}
            className="text-[#E0F5F2]">
            CronStream <span className="text-muted font-normal">Docs</span>
          </span>
        </div>

        <div className="flex-1" />

        {/* GitHub */}
        <a
          href="https://github.com/16navigabraham/CronStream"
          target="_blank"
          rel="noopener noreferrer"
          className="text-muted hover:text-accent transition-colors p-1.5"
          aria-label="GitHub"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
          </svg>
        </a>
      </header>

      {/* ── Body ───────────────────────────────────────────── */}
      <div className="flex pt-14">

        {/* Mobile overlay */}
        {sidebarOpen && (
          <div className="fixed inset-0 bg-black/50 z-30 lg:hidden" onClick={() => setSidebarOpen(false)} />
        )}

        {/* Sidebar */}
        <Sidebar nav={NAV} pages={PAGES} page={page} open={sidebarOpen} onNavigate={navigate} />

        {/* Main */}
        <main className="flex-1 min-w-0 flex">
          {/* Content */}
          <article className="flex-1 min-w-0 px-10 py-12">
            <div className="prose max-w-none">
              <Page />
            </div>

            {/* Prev / Next */}
            <div className="mt-16 pt-8 border-t border-border flex gap-4 justify-between">
              {prev ? (
                <button onClick={() => navigate(prev)}
                  className="flex items-center gap-2 text-sm text-muted hover:text-accent transition-colors group">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:-translate-x-0.5 transition-transform">
                    <polyline points="15 18 9 12 15 6"/>
                  </svg>
                  {PAGES[prev]?.label}
                </button>
              ) : <div />}
              {next ? (
                <button onClick={() => navigate(next)}
                  className="flex items-center gap-2 text-sm text-muted hover:text-accent transition-colors group ml-auto">
                  {PAGES[next]?.label}
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:translate-x-0.5 transition-transform">
                    <polyline points="9 18 15 12 9 6"/>
                  </svg>
                </button>
              ) : <div />}
            </div>
          </article>

          {/* Right TOC */}
          <Toc items={toc} />
        </main>
      </div>

      {/* ── Footer ─────────────────────────────────────────── */}
      <footer className="border-t border-border py-6 text-center text-xs text-muted">
        CronStream Protocol ·{' '}
        <a href="https://github.com/16navigabraham/CronStream" target="_blank" rel="noopener noreferrer"
          className="hover:text-accent transition-colors">GitHub</a>
      </footer>
    </div>
  );
}
