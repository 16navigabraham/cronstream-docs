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

        {/* GitHub */}
        <a
          href="https://github.com/thecronstream/CronStream"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 text-sm text-muted hover:text-accent transition-colors flex-shrink-0"
          aria-label="CronStream on GitHub"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M12 .5C5.73.5.5 5.73.5 12c0 5.08 3.29 9.39 7.86 10.91.58.11.79-.25.79-.56 0-.28-.01-1.02-.02-2-3.2.7-3.88-1.54-3.88-1.54-.52-1.33-1.28-1.69-1.28-1.69-1.05-.72.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.73-1.55-2.55-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.29 1.19-3.1-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.18 1.18a11.1 11.1 0 0 1 2.9-.39c.98 0 1.97.13 2.9.39 2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.12 3.05.74.81 1.18 1.84 1.18 3.1 0 4.42-2.69 5.39-5.25 5.68.41.36.78 1.06.78 2.14 0 1.55-.01 2.8-.01 3.18 0 .31.21.68.8.56A10.94 10.94 0 0 0 23.5 12C23.5 5.73 18.27.5 12 .5Z"/>
          </svg>
          <span className="hidden sm:inline">GitHub</span>
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
        CronStream Protocol · Business Source License 1.1
      </footer>
    </div>
  );
}
