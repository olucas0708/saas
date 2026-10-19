import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { niches } from "@/lib/builder";
import { Logo } from "@/components/Logo";

const STORAGE_KEY = "nextage-site-v1";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "nextage.ai — Crie sites profissionais sem programar" },
      { name: "description", content: "Escolha um modelo, personalize seu site em um editor visual e acompanhe seus rascunhos." },
      { property: "og:title", content: "nextage.ai — Crie sites profissionais sem programar" },
      { property: "og:description", content: "Comece com um modelo e personalize seu site sem escrever código." },
    ],
  }),
  component: Index,
});

function Index() {
  const navigate = useNavigate();
  const start = (templateId: string) => {
    const template = niches.find((item) => item.id === templateId);
    if (!template) return;
    try {
      const site = { ...template.build(templateId === "branco" ? "Meu site" : template.name), name: templateId === "branco" ? "Meu site" : template.name };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(site));
      void navigate({ to: "/editor" });
    } catch {
      window.alert("Não foi possível iniciar o editor. Verifique se o navegador permite salvar dados neste site.");
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-5 py-5 sm:px-6">
        <Logo />
        <button onClick={() => start("branco")} className="rounded-full bg-foreground px-5 py-2.5 text-sm font-semibold text-background transition hover:opacity-85 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary">Criar site</button>
      </header>
      <main>
        <section className="mx-auto max-w-5xl px-5 pb-16 pt-16 text-center sm:px-6 sm:pb-24 sm:pt-24">
          <p className="mb-5 inline-flex rounded-full border bg-card px-4 py-1.5 text-sm text-muted-foreground">Seu próximo projeto começa aqui</p>
          <h1 className="font-display text-4xl font-bold tracking-tight sm:text-6xl md:text-7xl">Sua ideia merece um site <span className="text-primary">extraordinário.</span></h1>
          <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">Monte páginas profissionais sem programar. Escolha um ponto de partida, personalize os detalhes e acompanhe o resultado em tempo real.</p>
          <button onClick={() => start("branco")} className="mt-8 rounded-full bg-primary px-7 py-3.5 font-semibold text-primary-foreground shadow-sm transition hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary">Começar do zero <span aria-hidden="true">→</span></button>
        </section>
        <section className="mx-auto max-w-6xl px-5 pb-20 sm:px-6">
          <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
            <div><p className="text-sm font-semibold uppercase tracking-wider text-primary">Modelos iniciais</p><h2 className="mt-2 font-display text-2xl font-bold sm:text-3xl">Escolha seu ponto de partida</h2></div>
            <p className="max-w-sm text-sm text-muted-foreground">Cada modelo pode ser personalizado no editor visual.</p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {niches.map((n, index) => (
              <button key={n.id} onClick={() => start(n.id)} className="group rounded-2xl border bg-card p-5 text-left transition duration-200 hover:-translate-y-0.5 hover:border-primary/60 hover:shadow-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary">
                <div className="mb-5 flex h-28 items-end justify-between overflow-hidden rounded-xl p-4" style={{ background: ["linear-gradient(135deg,#e8e5df,#c7c0b4)","linear-gradient(135deg,#171717,#4b4033)","linear-gradient(135deg,#dbeafe,#93c5fd)","linear-gradient(135deg,#ffedd5,#fdba74)","linear-gradient(135deg,#ccfbf1,#5eead4)","linear-gradient(135deg,#ede9fe,#c4b5fd)"][index % 6] }}>
                  <span className="rounded-full bg-white/85 px-3 py-1 text-xs font-semibold text-zinc-800">{String(index + 1).padStart(2, "0")}</span><span className="text-3xl font-semibold text-zinc-800 transition-transform group-hover:translate-x-1" aria-hidden="true">↗</span>
                </div>
                <h3 className="font-display text-lg font-bold">{n.name}</h3>
                <p className="mt-1 text-sm leading-6 text-muted-foreground">{n.description}</p>
                <span className="mt-4 inline-flex text-sm font-semibold text-primary">Usar modelo <span className="ml-1 transition-transform group-hover:translate-x-1" aria-hidden="true">→</span></span>
              </button>
            ))}
          </div>
        </section>
      </main>
      <footer className="border-t"><div className="mx-auto flex max-w-6xl flex-wrap justify-between gap-2 px-5 py-6 text-sm text-muted-foreground sm:px-6"><span>nextage.ai</span><span>Crie com liberdade. Personalize com facilidade.</span></div></footer>
    </div>
  );
}
