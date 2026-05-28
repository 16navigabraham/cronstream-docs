export default function Toc({ items }) {
  if (!items.length) return <div className="w-52 flex-shrink-0 hidden xl:block" />;

  return (
    <aside className="w-52 flex-shrink-0 hidden xl:block">
      <div className="sticky top-20 py-6 pr-4">
        <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-muted mb-3 px-1"
          style={{ fontFamily: "'DM Sans', sans-serif" }}>
          On this page
        </p>
        <nav className="flex flex-col gap-0.5">
          {items.map(({ id, label, level }) => (
            <a
              key={id}
              href={`#${id}`}
              className={`
                text-xs leading-relaxed py-0.5 transition-colors hover:text-accent
                ${level === 3 ? 'pl-3 text-muted' : 'text-muted-fg'}
              `}
              onClick={e => {
                e.preventDefault();
                document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }}
            >
              {label}
            </a>
          ))}
        </nav>
      </div>
    </aside>
  );
}
