import type { Block } from "@/lib/builder";

export function BlockView({ block }: { block: Block }) {
  const p = block.props;
  switch (block.type) {
    case "hero":
      return (
        <section className="px-8 py-24 text-center" style={{ background: "var(--site-soft)" }}>
          <h1 className="font-display text-4xl md:text-6xl font-bold">{p.title}</h1>
          <p className="mx-auto mt-4 max-w-xl text-lg opacity-75">{p.subtitle}</p>
          <span className="mt-8 inline-block rounded-full px-6 py-3 font-semibold" style={{ background: "var(--site-accent)", color: "var(--site-accent-fg)" }}>{p.button}</span>
        </section>
      );
    case "features":
      return (
        <section className="px-8 py-16">
          <h2 className="font-display text-center text-3xl font-bold">{p.title}</h2>
          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {[p.f1, p.f2, p.f3].map((f, i) => (
              <div key={i} className="rounded-xl p-6 text-center font-semibold" style={{ background: "var(--site-soft)" }}>{f}</div>
            ))}
          </div>
        </section>
      );
    case "text":
      return (
        <section className="mx-auto max-w-2xl px-8 py-16">
          <h2 className="font-display text-3xl font-bold">{p.title}</h2>
          <p className="mt-4 leading-relaxed opacity-80">{p.body}</p>
        </section>
      );
    case "image":
      return (
        <figure className="px-8 py-10">
          <img src={p.url} alt={p.caption} className="h-80 w-full rounded-2xl object-cover" />
          <figcaption className="mt-2 text-center text-sm opacity-60">{p.caption}</figcaption>
        </figure>
      );
    case "cta":
      return (
        <section className="px-8 py-20 text-center" style={{ background: "var(--site-accent)", color: "var(--site-accent-fg)" }}>
          <h2 className="font-display text-3xl font-bold">{p.title}</h2>
          <span className="mt-6 inline-block rounded-full px-6 py-3 font-semibold" style={{ background: "var(--site-bg)", color: "var(--site-fg)" }}>{p.button}</span>
        </section>
      );
    case "footer":
      return <footer className="px-8 py-8 text-center text-sm opacity-60">{p.body}</footer>;
  }
}

export function SiteFrame({ theme, children }: { theme: "claro" | "escuro"; children: React.ReactNode }) {
  return (
    <div className={theme === "escuro" ? "site-dark" : "site-light"} style={{ background: "var(--site-bg)", color: "var(--site-fg)" }}>
      {children}
    </div>
  );
}
