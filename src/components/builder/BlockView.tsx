import type { CSSProperties, ReactNode } from "react";
import type { Block, SiteTheme } from "@/lib/builder";

const btn = "mt-8 inline-block rounded-full px-6 py-3 font-semibold";

export function BlockView({ block }: { block: Block }) {
  const p = block.props;
  switch (block.type) {
    case "header":
      return (
        <header className="flex flex-wrap items-center justify-between gap-3 px-8 py-5">
          <span className="text-xl font-bold" style={{ fontFamily: "var(--site-font)" }}>{p.brand}</span>
          <nav className="flex flex-wrap gap-5 text-sm opacity-80">
            {(p.nav ?? "").split(",").filter(Boolean).map((n) => <span key={n}>{n.trim()}</span>)}
          </nav>
        </header>
      );
    case "hero":
      return (
        <section className="px-8 py-24 text-center" style={{ background: "var(--site-soft)" }}>
          <h1 className="text-4xl font-bold md:text-6xl" style={{ fontFamily: "var(--site-font)" }}>{p.title}</h1>
          <p className="mx-auto mt-4 max-w-xl text-lg opacity-75">{p.subtitle}</p>
          <a href={p.link || "#"} className={btn} style={{ background: "var(--site-accent)", color: "#fff" }}>{p.button}</a>
        </section>
      );
    case "features":
      return (
        <section className="px-8 py-16">
          <h2 className="text-center text-3xl font-bold" style={{ fontFamily: "var(--site-font)" }}>{p.title}</h2>
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
          <h2 className="text-3xl font-bold" style={{ fontFamily: "var(--site-font)" }}>{p.title}</h2>
          <p className="mt-4 whitespace-pre-line leading-relaxed opacity-80">{p.body}</p>
        </section>
      );
    case "image":
      return (
        <figure className="px-8 py-10">
          <img src={p.url} alt={p.caption ?? ""} loading="lazy" className="h-80 w-full rounded-2xl object-cover" />
          <figcaption className="mt-2 text-center text-sm opacity-60">{p.caption}</figcaption>
        </figure>
      );
    case "cta":
      return (
        <section className="px-8 py-20 text-center" style={{ background: "var(--site-accent)", color: "#fff" }}>
          <h2 className="text-3xl font-bold" style={{ fontFamily: "var(--site-font)" }}>{p.title}</h2>
          <a href={p.link || "#"} className={btn} style={{ background: "#fff", color: "#111" }}>{p.button}</a>
        </section>
      );
    case "footer":
      return <footer className="px-8 py-8 text-center text-sm opacity-60">{p.body}</footer>;
  }
}

export function SiteFrame({ theme, children }: { theme: SiteTheme; children: ReactNode }) {
  const dark = theme.mode === "escuro";
  const style = {
    "--site-accent": theme.accent,
    "--site-font": `"${theme.font}", serif`,
    "--site-soft": dark ? "#1c1c22" : "#f4f2ee",
    background: dark ? "#111114" : "#ffffff",
    color: dark ? "#f5f5f5" : "#18181b",
    fontFamily: '"Manrope", sans-serif',
  } as CSSProperties;
  return <div style={style}>{children}</div>;
}
