import { useState } from 'react';
import Sidebar      from './components/Sidebar.jsx';
import Toc          from './components/Toc.jsx';
import { useToc }   from './hooks/useToc.js';
import Introduction  from './docs/Introduction.jsx';
import HowItWorks    from './docs/HowItWorks.jsx';
import X402          from './docs/X402.jsx';
import PublicApi     from './docs/PublicApi.jsx';
import DeveloperApi  from './docs/DeveloperApi.jsx';
import Schemas       from './docs/Schemas.jsx';
import Roadmap       from './docs/Roadmap.jsx';

const PAGES = {
  introduction:    { label: 'Introduction',     component: Introduction  },
  'how-it-works':  { label: 'How It Works',     component: HowItWorks   },
  x402:            { label: 'x402 Protocol',    component: X402          },
  'public-api':    { label: 'Public API',       component: PublicApi     },
  'developer-api': { label: 'Company API',      component: DeveloperApi  },
  schemas:         { label: 'Response Schemas', component: Schemas       },
  roadmap:         { label: 'Roadmap',          component: Roadmap       },
};

const NAV = [
  { group: 'Getting Started', items: ['introduction', 'how-it-works'] },
  { group: 'Payments',        items: ['x402'] },
  { group: 'API',             items: ['public-api', 'developer-api', 'schemas'] },
  { group: 'Project',         items: ['roadmap'] },
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
    <div className="min-h-screen bg-bg text-[#C0E4EC]" style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}>

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
            className="text-[#DCF2F7]">
            CronStream <span className="text-muted font-normal">Docs</span>
          </span>
        </div>

        <div className="flex-1" />
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
        CronStream Protocol · Business Source License 1.1
      </footer>
    </div>
  );
}
