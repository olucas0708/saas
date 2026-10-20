import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowDownRight, ArrowRight, ArrowUpRight, Check, Code2, Globe2, Layers3, MousePointer2, Radar, Sparkles, WandSparkles, Zap } from "lucide-react";
import { niches } from "@/lib/builder";
import { Logo } from "@/components/Logo";

const STORAGE_KEY = "nextage-site-v1";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Nextage.AI — Sua próxima ideia ganha vida na web" },
      { name: "description", content: "Crie e personalize sites profissionais, organize sua prospecção e desenvolva sua presença digital. Sem créditos por criação." },
      { property: "og:title", content: "Nextage.AI — Sua próxima ideia ganha vida na web" },
      { property: "og:description", content: "Criação de sites e prospecção em um só lugar, sem sistema de créditos por criação." },
      { name: "theme-color", content: "#080914" },
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
      const name = templateId === "branco" ? "Meu site" : template.name;
      const site = { ...template.build(name), name };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(site));
      void navigate({ to: "/editor" });
    } catch {
      window.alert("Não foi possível iniciar o editor. Verifique se o navegador permite salvar dados neste site.");
    }
  };

  return (
    <div className="nextage-home min-h-screen overflow-hidden bg-[#080914] text-white">
      <div className="pointer-events-none fixed inset-0 -z-0 opacity-60" aria-hidden="true">
        <div className="absolute -top-64 left-1/2 h-[560px] w-[850px] -translate-x-1/2 rounded-full bg-violet-600/20 blur-[130px]" />
        <div className="absolute right-[-12rem] top-[38rem] h-[360px] w-[360px] rounded-full bg-cyan-500/10 blur-[100px]" />
      </div>
      <header className="relative z-10 mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-5 sm:px-8 lg:px-10">
        <div className="[&_a]:text-white"><Logo /></div>
        <nav aria-label="Navegação principal" className="hidden items-center gap-7 text-sm text-white/65 md:flex">
          <a className="transition hover:text-white" href="#plataforma">Plataforma</a>
          <a className="transition hover:text-white" href="#fluxo">Como funciona</a>
          <a className="transition hover:text-white" href="#modelos">Modelos</a>
        </nav>
        <div className="flex items-center gap-2 sm:gap-3">
          <Link to="/dashboard" className="hidden rounded-full px-4 py-2.5 text-sm font-medium text-white/75 transition hover:bg-white/5 hover:text-white sm:inline-flex">Dashboard</Link>
          <Link to="/prospecting" className="hidden rounded-full px-4 py-2.5 text-sm font-medium text-white/75 transition hover:bg-white/5 hover:text-white sm:inline-flex">Prospecção</Link>
          <button onClick={() => start("branco")} className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2.5 text-sm font-semibold text-[#10101d] transition hover:bg-violet-100 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-violet-300 sm:px-5">Começar agora <ArrowUpRight size={16} /></button>
        </div>
      </header>

      <main className="relative z-10">
        <section className="mx-auto grid max-w-7xl items-center gap-12 px-5 pb-20 pt-14 sm:px-8 sm:pt-20 lg:grid-cols-[1.02fr_.98fr] lg:gap-14 lg:px-10 lg:pb-28 lg:pt-24">
          <div>
            <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-violet-300/20 bg-violet-300/[0.07] px-3.5 py-2 text-xs font-medium tracking-wide text-violet-100 sm:text-sm"><span className="size-1.5 rounded-full bg-emerald-300 shadow-[0_0_12px_rgba(110,231,183,.9)]" /> UM NOVO JEITO DE CONSTRUIR NA WEB</div>
            <h1 className="max-w-3xl text-4xl font-semibold leading-[1.08] tracking-[-0.055em] sm:text-6xl lg:text-[4.5rem]">Sua próxima ideia merece <span className="bg-gradient-to-r from-violet-300 via-fuchsia-200 to-cyan-200 bg-clip-text text-transparent">ir mais longe.</span></h1>
            <p className="mt-6 max-w-xl text-base leading-7 text-white/60 sm:text-lg sm:leading-8">Crie experiências digitais, personalize cada detalhe e descubra novas oportunidades de negócio em uma plataforma feita para tirar seus projetos do papel.</p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <button onClick={() => start("branco")} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-gradient-to-r from-violet-500 to-indigo-500 px-6 py-3 text-sm font-semibold shadow-[0_8px_40px_rgba(124,58,237,.25)] transition hover:-translate-y-0.5 hover:shadow-[0_12px_44px_rgba(124,58,237,.35)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-violet-300">Criar meu primeiro site <ArrowRight size={17} /></button>
              <Link to="/prospecting" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-white/15 bg-white/[0.03] px-6 py-3 text-sm font-semibold text-white/85 transition hover:border-white/30 hover:bg-white/[0.07]">Explorar prospecção <Radar size={16} /></Link>
            </div>
            <div className="mt-7 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-white/45 sm:text-sm"><span className="inline-flex items-center gap-2"><Check size={14} className="text-emerald-300" /> Sem créditos por criação</span><span className="inline-flex items-center gap-2"><Check size={14} className="text-emerald-300" /> Editor visual</span><span className="inline-flex items-center gap-2"><Check size={14} className="text-emerald-300" /> Seus projetos no seu ritmo</span></div>
          </div>

          <div className="relative mx-auto w-full max-w-[600px]">
            <div className="absolute -inset-6 rounded-[2.5rem] bg-gradient-to-br from-violet-500/15 via-transparent to-cyan-400/10 blur-2xl" />
            <div className="relative overflow-hidden rounded-[1.5rem] border border-white/15 bg-[#0d0e1c]/95 shadow-[0_35px_100px_rgba(0,0,0,.45)] sm:rounded-[1.8rem]">
              <div className="flex items-center justify-between border-b border-white/10 px-4 py-3.5 sm:px-5">
                <div className="flex items-center gap-2"><span className="size-2 rounded-full bg-rose-400/80" /><span className="size-2 rounded-full bg-amber-300/80" /><span className="size-2 rounded-full bg-emerald-300/80" /><span className="ml-2 text-xs text-white/45">workspace / meu-projeto</span></div><span className="rounded-md border border-emerald-300/20 bg-emerald-300/[0.08] px-2 py-1 text-[10px] font-medium text-emerald-200">RASCUNHO SALVO</span>
              </div>
              <div className="grid min-h-[330px] grid-cols-[100px_minmax(0,1fr)] sm:min-h-[380px] sm:grid-cols-[132px_minmax(0,1fr)]">
                <aside className="border-r border-white/10 bg-white/[0.02] p-3 sm:p-4">
                  <p className="mb-4 text-[9px] font-semibold uppercase tracking-[.18em] text-white/35 sm:text-[10px]">Workspace</p>
                  <div className="space-y-1.5 text-[10px] sm:text-xs"><div className="flex items-center gap-2 rounded-lg bg-violet-400/15 px-2 py-2 text-violet-100"><Layers3 size={13} /> Sites</div><div className="flex items-center gap-2 rounded-lg px-2 py-2 text-white/45"><Radar size={13} /> Leads</div><div className="flex items-center gap-2 rounded-lg px-2 py-2 text-white/45"><Globe2 size={13} /> Publicação</div></div>
                  <div className="mt-8 rounded-xl border border-white/10 bg-black/20 p-2.5 sm:p-3"><div className="mb-2 flex items-center gap-1.5 text-[9px] text-white/45"><Sparkles size={11} /> SEU PLANO</div><p className="text-[10px] font-semibold sm:text-xs">Liberdade criativa</p><p className="mt-1 text-[9px] leading-4 text-white/40 sm:text-[10px]">Sem créditos por geração</p></div>
                </aside>
                <div className="min-w-0 p-3 sm:p-5">
                  <div className="mb-4 flex items-start justify-between gap-2"><div><p className="text-[10px] text-white/40 sm:text-xs">VISÃO GERAL</p><h2 className="mt-1 text-sm font-semibold sm:text-lg">Seu espaço criativo</h2></div><span className="rounded-lg border border-white/10 p-2 text-white/55"><MousePointer2 size={15} /></span></div>
                  <div className="grid grid-cols-2 gap-2 sm:gap-3"><div className="rounded-xl border border-white/10 bg-white/[0.035] p-3 sm:p-4"><div className="mb-3 flex size-7 items-center justify-center rounded-lg bg-violet-400/15 text-violet-200"><Code2 size={15} /></div><p className="text-[10px] text-white/45 sm:text-xs">Criação de sites</p><p className="mt-1 text-xs font-semibold sm:text-sm">Editor visual</p></div><div className="rounded-xl border border-white/10 bg-white/[0.035] p-3 sm:p-4"><div className="mb-3 flex size-7 items-center justify-center rounded-lg bg-cyan-300/10 text-cyan-200"><Radar size={15} /></div><p className="text-[10px] text-white/45 sm:text-xs">Oportunidades</p><p className="mt-1 text-xs font-semibold sm:text-sm">Radar de leads</p></div></div>
                  <div className="mt-3 rounded-xl border border-white/10 bg-[#111426] p-3 sm:mt-4 sm:p-4">
                    <div className="mb-3 flex items-center justify-between"><p className="text-xs font-medium sm:text-sm">Prévia do projeto</p><span className="text-[9px] text-white/35 sm:text-[10px]">RESPONSIVO</span></div>
                    <div className="overflow-hidden rounded-lg border border-white/10 bg-[#f5f3ff] p-3 text-[#19172b] sm:p-4">
                      <div className="flex items-center justify-between"><div className="h-2 w-14 rounded-full bg-[#24203c] sm:w-20" /><div className="flex gap-1.5"><span className="h-1.5 w-5 rounded-full bg-[#c9c4dd] sm:w-8" /><span className="h-1.5 w-5 rounded-full bg-[#c9c4dd] sm:w-8" /><span className="h-1.5 w-5 rounded-full bg-[#c9c4dd] sm:w-8" /></div></div>
                      <div className="grid grid-cols-[1.1fr_.9fr] items-center gap-2 py-5 sm:py-7"><div><div className="h-2 w-4/5 rounded-full bg-[#24203c] sm:h-3" /><div className="mt-2 h-2 w-3/5 rounded-full bg-[#aaa5c1]" /><div className="mt-4 h-5 w-16 rounded-full bg-[#7561e8] sm:h-7 sm:w-24" /></div><div className="relative aspect-[4/3] overflow-hidden rounded-md bg-gradient-to-br from-[#c5bbff] via-[#9c8de9] to-[#6e5cd5]"><div className="absolute -right-3 -top-3 size-16 rounded-full border-[10px] border-white/30 sm:size-24" /><div className="absolute -bottom-3 left-1/4 h-3/4 w-1/2 rounded-t-full bg-[#30255e]/80" /></div></div>
                    </div>
                  </div>
                  <div className="mt-3 flex items-center justify-between gap-3 rounded-xl border border-white/10 bg-white/[0.025] px-3 py-3"><div className="flex items-center gap-2 text-[10px] text-white/55 sm:text-xs"><Zap size={13} className="text-amber-200" /> Criatividade sem contador de créditos</div><ArrowUpRight size={15} className="text-white/40" /></div>
                </div>
              </div>
            </div>
            <div className="absolute -bottom-5 -left-2 flex items-center gap-2 rounded-xl border border-white/15 bg-[#17182b] px-3 py-2.5 shadow-xl sm:-left-6 sm:px-4"><span className="flex size-7 items-center justify-center rounded-lg bg-emerald-300/10 text-emerald-200"><Check size={15} /></span><div><p className="text-[10px] font-semibold sm:text-xs">Sem sistema de créditos</p><p className="mt-0.5 text-[9px] text-white/45 sm:text-[10px]">Foco no seu projeto, não em contadores</p></div></div>
          </div>
        </section>

        <section id="plataforma" className="border-y border-white/[0.08] bg-white/[0.018]">
          <div className="mx-auto grid max-w-7xl gap-8 px-5 py-9 sm:grid-cols-3 sm:px-8 lg:px-10">
            {[{icon: Code2,title:"Criação visual",desc:"Monte páginas e ajuste textos, cores e seções pelo editor."},{icon: Radar,title:"Prospecção organizada",desc:"Registre empresas, acompanhe contatos e mantenha seu pipeline em ordem."},{icon: Globe2,title:"Feito para crescer",desc:"Uma base para desenvolver sua presença digital e organizar seus projetos."}].map((item) => <div key={item.title} className="flex gap-4"><div className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-violet-300/15 bg-violet-300/[0.07] text-violet-200"><item.icon size={18} /></div><div><h2 className="text-sm font-semibold sm:text-base">{item.title}</h2><p className="mt-1.5 max-w-sm text-sm leading-6 text-white/45">{item.desc}</p></div></div>)}
          </div>
        </section>

        <section id="fluxo" className="mx-auto max-w-7xl px-5 py-20 sm:px-8 sm:py-24 lg:px-10">
          <div className="max-w-2xl"><p className="text-xs font-semibold uppercase tracking-[.2em] text-violet-300">Simples por design</p><h2 className="mt-4 text-3xl font-semibold tracking-[-.04em] sm:text-5xl">Da primeira ideia ao próximo passo.</h2><p className="mt-4 text-base leading-7 text-white/55">Uma experiência clara para você começar rápido e continuar evoluindo sem uma contagem de créditos por criação.</p></div>
          <div className="mt-10 grid gap-4 md:grid-cols-3">{[{n:"01",title:"Escolha um ponto de partida",desc:"Comece com uma página em branco ou selecione um modelo para o seu negócio.",icon:WandSparkles},{n:"02",title:"Personalize do seu jeito",desc:"Edite seções, ajuste a identidade visual e visualize o resultado enquanto trabalha.",icon:MousePointer2},{n:"03",title:"Organize suas oportunidades",desc:"Use a área de prospecção para registrar empresas e acompanhar o andamento dos contatos.",icon:Radar}].map((item) => <article key={item.n} className="group rounded-2xl border border-white/10 bg-white/[0.025] p-5 transition hover:-translate-y-1 hover:border-violet-300/30 hover:bg-white/[0.04] sm:p-6"><div className="flex items-center justify-between"><span className="text-xs font-medium tracking-[.2em] text-white/35">{item.n}</span><item.icon size={19} className="text-violet-200 transition group-hover:scale-110" /></div><h3 className="mt-8 text-lg font-semibold">{item.title}</h3><p className="mt-2 text-sm leading-6 text-white/50">{item.desc}</p><ArrowDownRight size={17} className="mt-6 text-white/25" /></article>)}</div>
        </section>

        <section id="modelos" className="mx-auto max-w-7xl px-5 pb-20 sm:px-8 sm:pb-28 lg:px-10">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><div><p className="text-xs font-semibold uppercase tracking-[.2em] text-cyan-200">Ponto de partida</p><h2 className="mt-3 text-3xl font-semibold tracking-[-.04em] sm:text-4xl">Comece com um modelo. Faça dele seu.</h2></div><p className="max-w-md text-sm leading-6 text-white/50">Escolha uma estrutura inicial e personalize no editor. Você pode começar do zero a qualquer momento.</p></div>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{niches.map((n, index) => <button key={n.id} onClick={() => start(n.id)} className="group overflow-hidden rounded-2xl border border-white/10 bg-[#101120] text-left transition hover:-translate-y-1 hover:border-violet-300/35 hover:shadow-[0_20px_50px_rgba(0,0,0,.25)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-violet-300"><div className="relative flex h-36 items-end overflow-hidden p-4 sm:h-44" style={{ background: ["radial-gradient(circle at 75% 15%,#e0c5ff,transparent 42%),linear-gradient(135deg,#3b246a,#16152c)","radial-gradient(circle at 75% 15%,#d8b4fe,transparent 42%),linear-gradient(135deg,#28232d,#090a12)","radial-gradient(circle at 75% 15%,#a5f3fc,transparent 42%),linear-gradient(135deg,#16394a,#0b1220)","radial-gradient(circle at 75% 15%,#fed7aa,transparent 42%),linear-gradient(135deg,#633b2a,#17101a)","radial-gradient(circle at 75% 15%,#99f6e4,transparent 42%),linear-gradient(135deg,#164e63,#0a1620)","radial-gradient(circle at 75% 15%,#c4b5fd,transparent 42%),linear-gradient(135deg,#35206b,#0c1022)"][index % 6] }}><div className="absolute right-[-10%] top-[-40%] size-48 rounded-full border border-white/20 transition duration-500 group-hover:scale-110 sm:size-60" /><span className="relative rounded-full border border-white/20 bg-black/20 px-3 py-1 text-[10px] font-medium tracking-[.16em] text-white/80">MODELO {String(index + 1).padStart(2,"0")}</span><span className="relative ml-auto flex size-9 items-center justify-center rounded-full border border-white/20 bg-black/20 text-white transition group-hover:bg-white group-hover:text-black"><ArrowUpRight size={16} /></span></div><div className="p-5"><h3 className="font-semibold">{n.name}</h3><p className="mt-2 text-sm leading-6 text-white/45">{n.description}</p><span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-violet-200">Personalizar modelo <ArrowRight size={15} className="transition group-hover:translate-x-1" /></span></div></button>)}</div>
        </section>

        <section className="mx-auto max-w-7xl px-5 pb-20 sm:px-8 lg:px-10"><div className="relative overflow-hidden rounded-[1.75rem] border border-violet-300/20 bg-gradient-to-br from-[#19152e] via-[#111324] to-[#0e1b29] p-7 sm:p-10 lg:p-14"><div className="absolute -right-10 -top-24 size-72 rounded-full border border-violet-200/10 sm:size-96" /><div className="absolute -right-2 -top-16 size-56 rounded-full border border-cyan-200/10 sm:size-72" /><div className="relative max-w-2xl"><p className="text-xs font-semibold uppercase tracking-[.2em] text-violet-200">Seu próximo passo começa aqui</p><h2 className="mt-4 text-3xl font-semibold tracking-[-.04em] sm:text-5xl">Construa mais. Conte créditos, nunca.</h2><p className="mt-4 max-w-xl text-sm leading-7 text-white/55 sm:text-base">Comece com o editor visual ou organize sua próxima lista de oportunidades. Sem sistema de créditos por criação.</p><div className="mt-7 flex flex-col gap-3 sm:flex-row"><button onClick={() => start("branco")} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-[#11101f] transition hover:bg-violet-100">Começar a criar <ArrowRight size={16} /></button><Link to="/prospecting" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-white/15 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/[0.06]">Ir para prospecção <ArrowUpRight size={16} /></Link></div></div></div></section>
      </main>
      <footer className="relative z-10 border-t border-white/10"><div className="mx-auto flex max-w-7xl flex-col gap-3 px-5 py-7 text-xs text-white/40 sm:flex-row sm:items-center sm:justify-between sm:px-8 lg:px-10"><div className="[&_a]:text-white"><Logo /></div><p>Criação digital com liberdade. Sem créditos por criação.</p><a href="#topo" onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: "smooth" }); }} className="inline-flex items-center gap-1 transition hover:text-white">Voltar ao topo <ArrowUpRight size={13} /></a></div></footer>
    </div>
  );
}
