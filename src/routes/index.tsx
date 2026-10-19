import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { templates, saveSite } from "@/lib/builder";
import { BlockView, SiteFrame } from "@/components/builder/BlockView";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Monta — Crie seu site sem programar" },
      { name: "description", content: "Escolha um modelo, arraste blocos e publique seu site em minutos, sem saber programar." },
      { property: "og:title", content: "Monta — Crie seu site sem programar" },
      { property: "og:description", content: "Editor visual de arrastar e soltar com modelos prontos." },
    ],
  }),
  component: Index,
});

function Index() {
  const navigate = useNavigate();
  const start = (id: string) => {
    const t = templates.find((t) => t.id === id)!;
    saveSite(t.build());
    navigate({ to: "/editor" });
  };
  return (
    <div className="min-h-screen bg-background">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
        <span className="font-display text-2xl font-bold">monta<span className="text-primary">.</span></span>
        <button onClick={() => start("branco")} className="rounded-full bg-foreground px-5 py-2 text-sm font-semibold text-background">Criar site</button>
      </header>
      <section className="mx-auto max-w-4xl px-6 py-20 text-center">
        <p className="mb-4 inline-block rounded-full bg-accent px-4 py-1 text-sm font-medium text-accent-foreground">Sem código. Sem complicação.</p>
        <h1 className="font-display text-5xl font-bold leading-tight md:text-7xl">Seu site pronto em <span className="text-primary">minutos</span>.</h1>
        <p className="mx-auto mt-6 max-w-xl text-lg text-muted-foreground">Escolha um modelo, arraste os blocos que quiser, troque os textos e pronto.</p>
      </section>
      <section className="mx-auto max-w-6xl px-6 pb-24">
        <h2 className="font-display mb-6 text-2xl font-bold">Escolha um modelo para começar</h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {templates.map((t) => {
            const site = t.build();
            return (
              <button key={t.id} onClick={() => start(t.id)} className="group overflow-hidden rounded-2xl border bg-card text-left transition hover:-translate-y-1 hover:shadow-xl">
                <div className="h-48 overflow-hidden border-b bg-muted">
                  {site.blocks.length ? (
                    <div className="pointer-events-none w-[400%] origin-top-left scale-[0.25]">
                      <SiteFrame theme={site.theme}>{site.blocks.map((b) => <BlockView key={b.id} block={b} />)}</SiteFrame>
                    </div>
                  ) : (
                    <div className="flex h-full items-center justify-center text-4xl text-muted-foreground">+</div>
                  )}
                </div>
                <div className="p-4">
                  <p className="font-semibold">{t.name}</p>
                  <p className="text-sm text-muted-foreground">{t.description}</p>
                </div>
              </button>
            );
          })}
        </div>
      </section>
    </div>
  );
}
