export default function Sidebar({ nav, pages, page, open, onNavigate }) {
  return (
    <aside className={`
      fixed top-14 left-0 h-[calc(100vh-3.5rem)] z-40 w-60 flex-shrink-0 flex flex-col
      bg-bg border-r border-border overflow-y-auto
      transition-transform duration-200
      ${open ? 'translate-x-0' : '-translate-x-full'}
      lg:translate-x-0 lg:sticky lg:top-14
    `}>
      <nav className="py-6 px-3 flex-1">
        {nav.map(({ group, items }) => (
          <div key={group} className="mb-6">
            <div className="px-3 mb-2 text-[10px] font-semibold uppercase tracking-[0.12em] text-muted"
              style={{ fontFamily: "'DM Sans', sans-serif" }}>
              {group}
            </div>
            {items.map(id => {
              const isActive = id === page;
              return (
                <button
                  key={id}
                  onClick={() => onNavigate(id)}
                  className={`
                    w-full text-left flex items-center gap-2 px-3 py-1.5 rounded-md text-sm mb-0.5
                    transition-all duration-150
                    ${isActive
                      ? 'bg-accent-dim text-accent font-medium'
                      : 'text-muted-fg hover:text-[#C8E8E4] hover:bg-[#0F1614]'}
                  `}
                >
                  {isActive && (
                    <span className="w-1 h-1 rounded-full bg-accent flex-shrink-0" />
                  )}
                  {pages[id]?.label}
                </button>
              );
            })}
          </div>
        ))}
      </nav>
    </aside>
  );
}
