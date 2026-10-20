import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import {
  ArrowDownRight, ArrowRight, ArrowUpRight, Bell, Blocks, BriefcaseBusiness,
  Check, ChevronDown, CircleHelp, Command, CreditCard, Globe2, LayoutDashboard,
  MessageSquareText, Plus, Radar, Search, Settings2, Sparkles, Target, Users,
  WandSparkles, Workflow, Zap,
} from "lucide-react";
import { Logo } from "@/components/Logo";

const SITE_KEY = "nextage-site-v1";
const LEADS_KEY = "nextage-prospects-v1";

type LeadStatus = "Novo" | "Contatado" | "Interessado" | "Convertido" | "Descartado";
type Lead = { id: string; business: string; city?: string; niche?: string; status: LeadStatus; createdAt?: string };

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard — Nextage.AI" },
      { name: "description", content: "Sua central de criação de sites, prospecção e oportunidades comerciais." },
    ],
  }),
  component: Dashboard,
});

function readLeads(): Lead[] {
  try {
    const raw = localStorage.getItem(LEADS_KEY);
    const parsed: unknown = raw ? JSON.parse(raw) : [];
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((item): item is Lead =>
      Boolean(item && typeof item.id === "string" && typeof item.business === "string" &&
      ["Novo", "Contatado", "Interessado", "Convertido", "Descartado"].includes(item.status)),
    );
  } catch {
    return [];
  }
}

function Dashboard() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [hasSite, setHasSite] = useState(false);
  const [search, setSearch] = useState("");
  const [mobileMenu, setMobileMenu] = useState(false);

  useEffect(() => {
    setLeads(readLeads());
    try {
      setHasSite(Boolean(localStorage.getItem(SITE_KEY)));
    } catch {
      setHasSite(false);
    }
  }, []);

  const activeLeads = useMemo(
    () => leads.filter((lead) => lead.status !== "Descartado" && lead.status !== "Convertido").length,
    [leads],
  );
  const converted = useMemo(() => leads.filter((lead) => lead.status === "Convertido").length, [leads]);
  const filteredLeads = useMemo(() => {
    const query = search.trim().toLocaleLowerCase("pt-BR");
    return leads.filter((lead) => !query || [lead.business, lead.city ?? "", lead.niche ?? ""].join(" ").toLocaleLowerCase("pt-BR").includes(query));
  }, [leads, search]);

  const navItems = [
    { label: "Visão geral", icon: LayoutDashboard, href: "/dashboard", active: true },
    { label: "Criador de sites", icon: Blocks, href: "/editor" },
    { label: "Prospecção", icon: Radar, href: "/prospecting", badge: "Leads" },
  ];

  return (
    <div className="min-h-screen bg-[#080914] text-white">
      <div className="pointer-events-none fixed inset-0 overflow-hidden" aria-hidden="true">
        <div className="absolute -left-40 top-20 h-96 w-96 rounded-full bg-violet-600/10 blur-[120px]" />
        <div className="absolute right-0 top-0 h-80 w-80 rounded-full bg-cyan-500/[0.07] blur-[110px]" />
      </div>
      <div className="relative flex min-h-screen">
        <aside className={`fixed inset-y-0 left-0 z-30 flex w-[260px] flex-col border-r border-white/[0.08] bg-[#0b0c18] px-4 py-5 transition-transform duration-200 lg:sticky lg:top-0 lg:h-screen lg:translate-x-0 ${mobileMenu ? "translate-x-0" : "-translate-x-full"}`}>
          <div className="flex items-center justify-between px-2">
            <div className="[&_a]:text-white"><Logo /></div>
            <button onClick={() => setMobileMenu(false)} className="rounded-lg p-2 text-white/55 hover:bg-white/5 lg:hidden" aria-label="Fechar menu">×</button>
          </div>
          <div className="mt-8 rounded-2xl border border-violet-300/15 bg-gradient-to-br from-violet-500/[0.14] to-cyan-400/[0.04] p-3.5">
            <div className="flex items-center gap-2.5">
              <div className="flex size-9 items-center justify-center rounded-xl bg-violet-400/15 text-violet-200"><Command size={17} /></div>
              <div className="min-w-0"><p className="truncate text-sm font-semibold">Workspace principal</p><p className="mt-0.5 text-[11px] text-white/45">Plano por assinatura</p></div>
              <ChevronDown size={15} className="ml-auto shrink-0 text-white/40" />
            </div>
          </div>
          <p className="mb-2 mt-8 px-3 text-[10px] font-semibold uppercase tracking-[.18em] text-white/35">Workspace</p>
          <nav aria-label="Navegação do workspace" className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return <Link key={item.href} to={item.href} onClick={() => setMobileMenu(false)} className={`group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition ${item.active ? "border border-violet-300/10 bg-violet-400/[0.12] font-medium text-violet-100" : "text-white/60 hover:bg-white/[0.045] hover:text-white"}`}>
                <Icon size={17} className={item.active ? "text-violet-200" : "text-white/40 group-hover:text-white/75"} />{item.label}
                {item.badge && <span className="ml-auto rounded-md bg-white/[0.07] px-1.5 py-0.5 text-[10px] text-white/55">{leads.length}</span>}
              </Link>;
            })}
          </nav>
          <p className="mb-2 mt-8 px-3 text-[10px] font-semibold uppercase tracking-[.18em] text-white/35">Gestão</p>
          <div className="space-y-1">
            <a href="#pipeline" onClick={() => setMobileMenu(false)} className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-white/60 transition hover:bg-white/[0.045] hover:text-white"><Workflow size={17} className="text-white/40" />Pipeline de leads</a>
            <a href="#assinatura" onClick={() => setMobileMenu(false)} className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-white/60 transition hover:bg-white/[0.045] hover:text-white"><CreditCard size={17} className="text-white/40" />Assinatura</a>
          </div>
          <div className="mt-auto space-y-1 border-t border-white/[0.08] pt-4">
            <a href="#ajuda" className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-white/55 hover:bg-white/[0.045] hover:text-white"><CircleHelp size={17} />Central de ajuda</a>
            <div className="mt-3 flex items-center gap-3 rounded-xl bg-white/[0.035] p-3">
              <div className="flex size-9 items-center justify-center rounded-full border border-cyan-200/20 bg-cyan-300/10 text-xs font-semibold text-cyan-100">NX</div>
              <div className="min-w-0"><p className="truncate text-sm font-medium">Meu workspace</p><p className="truncate text-[11px] text-white/40">Conta pessoal</p></div>
              <Settings2 size={16} className="ml-auto text-white/35" />
            </div>
          </div>
        </aside>
        {mobileMenu && <button aria-label="Fechar menu" onClick={() => setMobileMenu(false)} className="fixed inset-0 z-20 bg-black/60 lg:hidden" />}
        <main className="min-w-0 flex-1">
          <header className="sticky top-0 z-10 flex h-[72px] items-center justify-between gap-3 border-b border-white/[0.08] bg-[#080914]/90 px-4 backdrop-blur-xl sm:px-7 lg:px-10">
            <div className="flex min-w-0 items-center gap-3">
              <button onClick={() => setMobileMenu(true)} className="rounded-lg border border-white/10 p-2 text-white/70 lg:hidden" aria-label="Abrir menu"><span className="block space-y-1"><span className="block h-px w-4 bg-current" /><span className="block h-px w-4 bg-current" /><span className="block h-px w-4 bg-current" /></span></button>
              <div className="min-w-0"><p className="text-xs text-white/40">Workspace / <span className="text-white/75">Visão geral</span></p><h1 className="mt-0.5 truncate text-lg font-semibold tracking-tight sm:text-xl">Visão geral</h1></div>
            </div>
            <div className="flex items-center gap-2 sm:gap-3">
              <label className="hidden items-center gap-2 rounded-xl border border-white/10 bg-white/[0.025] px-3 py-2 text-white/40 md:flex"><Search size={15} /><span className="sr-only">Buscar leads</span><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Buscar leads..." className="w-32 bg-transparent text-xs text-white outline-none placeholder:text-white/35 lg:w-44" /></label>
              <button className="relative rounded-xl border border-white/10 bg-white/[0.025] p-2.5 text-white/55 transition hover:bg-white/[0.06] hover:text-white" aria-label="Notificações"><Bell size={17} /><span className="absolute right-2 top-2 size-1.5 rounded-full bg-cyan-300" /></button>
              <div className="hidden h-8 w-px bg-white/10 sm:block" />
              <div className="hidden items-center gap-2 sm:flex"><div className="flex size-8 items-center justify-center rounded-full bg-gradient-to-br from-violet-400 to-cyan-300 text-xs font-bold text-[#10101b]">N</div><ChevronDown size={14} className="text-white/40" /></div>
            </div>
          </header>

          <div className="mx-auto max-w-[1500px] px-4 py-7 sm:px-7 sm:py-9 lg:px-10">
            <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
              <div><div className="mb-3 inline-flex items-center gap-2 rounded-full border border-emerald-300/15 bg-emerald-300/[0.06] px-3 py-1.5 text-[11px] font-medium text-emerald-200"><span className="size-1.5 rounded-full bg-emerald-300" />Seu espaço de trabalho</div><h2 className="font-display text-2xl font-semibold tracking-tight sm:text-3xl">Bom ter você por aqui.</h2><p className="mt-2 max-w-2xl text-sm leading-6 text-white/50">Tudo o que você precisa para criar sites, encontrar oportunidades e acompanhar o crescimento do seu negócio.</p></div>
              <div className="flex flex-wrap gap-2"><Link to="/prospecting" className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl border border-white/12 bg-white/[0.035] px-4 text-sm font-medium text-white/80 transition hover:bg-white/[0.07]"><Radar size={16} />Encontrar leads</Link><Link to="/editor" className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-500 to-indigo-500 px-4 text-sm font-semibold shadow-[0_8px_28px_rgba(124,58,237,.2)] transition hover:-translate-y-0.5 hover:shadow-[0_12px_34px_rgba(124,58,237,.3)]"><Plus size={16} />Criar site <ArrowUpRight size={15} /></Link></div>
            </div>

            <section aria-label="Indicadores do workspace" className="mt-8 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              <Metric title="Projetos salvos" value={hasSite ? "1" : "0"} note={hasSite ? "Rascunho disponível no editor" : "Crie seu primeiro projeto"} icon={Globe2} tone="violet" />
              <Metric title="Leads registrados" value={String(leads.length)} note={leads.length ? "Salvos na sua lista de prospecção" : "Sua lista começa aqui"} icon={Users} tone="cyan" />
              <Metric title="Em andamento" value={String(activeLeads)} note="Leads ainda não concluídos" icon={Target} tone="blue" />
              <Metric title="Convertidos" value={String(converted)} note="Marcados como convertidos" icon={Check} tone="green" />
            </section>

            <section className="mt-7 grid gap-5 xl:grid-cols-[minmax(0,1.5fr)_minmax(320px,.85fr)]">
              <div className="overflow-hidden rounded-2xl border border-white/[0.09] bg-[#0e1020]/85">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/[0.08] px-5 py-4 sm:px-6"><div><h3 className="font-semibold">Seu próximo passo</h3><p className="mt-1 text-xs text-white/45">Atalhos para manter sua operação em movimento.</p></div><span className="rounded-lg border border-white/10 p-2 text-white/45"><Sparkles size={16} /></span></div>
                <div className="grid gap-3 p-4 sm:grid-cols-2 sm:p-5">
                  <ActionCard icon={WandSparkles} eyebrow="CRIAR" title="Construa seu próximo site" description="Comece com um modelo e personalize cada seção no editor visual." href="/editor" cta="Abrir criador" accent="violet" />
                  <ActionCard icon={Radar} eyebrow="DESCOBRIR" title="Encontre novas oportunidades" description="Organize empresas, registre contatos e acompanhe cada conversa." href="/prospecting" cta="Abrir prospecção" accent="cyan" />
                </div>
                <div className="mx-4 mb-4 flex items-start gap-3 rounded-xl border border-cyan-200/10 bg-cyan-300/[0.045] p-4 sm:mx-5 sm:mb-5">
                  <div className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg bg-cyan-300/10 text-cyan-200"><Zap size={16} /></div><div><p className="text-sm font-medium">Crie sem contador de créditos</p><p className="mt-1 text-xs leading-5 text-white/50">O modelo do Nextage é baseado em assinatura. Você não precisa comprar créditos por site criado.</p></div>
                </div>
              </div>

              <div id="assinatura" className="rounded-2xl border border-violet-300/15 bg-gradient-to-br from-[#17132c] via-[#111226] to-[#0e1020] p-5 sm:p-6">
                <div className="flex items-center justify-between"><span className="inline-flex items-center gap-2 text-xs font-medium text-violet-200"><Sparkles size={14} /> PLANO POR ASSINATURA</span><span className="rounded-md border border-emerald-300/20 bg-emerald-300/[0.07] px-2 py-1 text-[10px] text-emerald-200">Sem créditos</span></div>
                <h3 className="mt-5 font-display text-xl font-semibold">Sua criatividade, sem limites por criação.</h3>
                <p className="mt-2 text-sm leading-6 text-white/55">Um modelo simples: acesso às ferramentas conforme seu plano, sem descontar créditos a cada geração de site.</p>
                <div className="my-5 space-y-3 border-y border-white/10 py-5">
                  {["Editor visual de sites", "Workspace de prospecção", "Organização de oportunidades"].map((feature) => <div key={feature} className="flex items-center gap-2.5 text-sm text-white/75"><Check size={15} className="text-emerald-300" />{feature}</div>)}
                </div>
                <p className="text-xs leading-5 text-white/40">A situação da cobrança e os valores do plano ainda não estão conectados a um sistema de pagamentos.</p>
              </div>
            </section>

            <section id="pipeline" className="mt-7 overflow-hidden rounded-2xl border border-white/[0.09] bg-[#0e1020]/85">
              <div className="flex flex-col gap-3 border-b border-white/[0.08] px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6"><div><h3 className="font-semibold">Pipeline de oportunidades</h3><p className="mt-1 text-xs text-white/45">Resumo dos leads que você já registrou.</p></div><Link to="/prospecting" className="inline-flex items-center gap-1.5 text-sm font-medium text-violet-200 transition hover:text-violet-100">Gerenciar leads <ArrowRight size={15} /></Link></div>
              <div className="grid gap-0 md:grid-cols-[minmax(0,1fr)_260px]">
                <div className="overflow-x-auto p-4 sm:p-5">
                  <div className="grid min-w-[460px] grid-cols-4 gap-2">
                    {[
                      { label: "Novos", count: leads.filter((lead) => lead.status === "Novo").length, color: "bg-violet-300" },
                      { label: "Contatados", count: leads.filter((lead) => lead.status === "Contatado").length, color: "bg-cyan-300" },
                      { label: "Interessados", count: leads.filter((lead) => lead.status === "Interessado").length, color: "bg-blue-300" },
                      { label: "Convertidos", count: converted, color: "bg-emerald-300" },
                    ].map((stage) => <div key={stage.label} className="rounded-xl border border-white/[0.08] bg-white/[0.02] p-3"><div className="flex items-center gap-2 text-[11px] text-white/50"><span className={`size-1.5 rounded-full ${stage.color}`} />{stage.label}</div><p className="mt-3 text-2xl font-semibold tabular-nums">{stage.count}</p><div className="mt-3 h-1 overflow-hidden rounded-full bg-white/[0.07]"><div className={`h-full rounded-full ${stage.color}`} style={{ width: leads.length ? `${Math.min(100, stage.count / leads.length * 100)}%` : "0%" }} /></div></div>)}
                  </div>
                  {leads.length === 0 && <p className="mt-4 text-xs text-white/40">Quando você registrar empresas na prospecção, os indicadores serão atualizados aqui.</p>}
                </div>
                <div className="border-t border-white/[0.08] p-4 sm:p-5 md:border-l md:border-t-0">
                  <div className="mb-3 flex items-center justify-between"><h4 className="text-sm font-medium">Últimos leads</h4><span className="text-[10px] text-white/35">{filteredLeads.length} registros</span></div>
                  {filteredLeads.length ? <div className="space-y-1.5">{filteredLeads.slice(0, 4).map((lead) => <div key={lead.id} className="flex items-center gap-2.5 rounded-lg px-2 py-2"><div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-white/[0.06] text-xs font-semibold text-white/70">{lead.business.slice(0, 1).toLocaleUpperCase("pt-BR")}</div><div className="min-w-0 flex-1"><p className="truncate text-xs font-medium">{lead.business}</p><p className="mt-0.5 truncate text-[10px] text-white/40">{lead.city || lead.niche || "Empresa"}</p></div><span className="max-w-24 truncate rounded-md border border-white/10 px-1.5 py-1 text-[9px] text-white/50">{lead.status}</span></div>)}</div> : <div className="rounded-xl border border-dashed border-white/10 px-3 py-6 text-center"><BriefcaseBusiness size={20} className="mx-auto text-white/25" /><p className="mt-2 text-xs text-white/55">Nenhum lead encontrado</p><p className="mt-1 text-[10px] text-white/35">Adicione sua primeira oportunidade.</p></div>}
                  <Link to="/prospecting" className="mt-3 flex items-center justify-center gap-2 rounded-lg border border-white/10 px-3 py-2.5 text-xs font-medium text-white/70 transition hover:bg-white/[0.04]">Abrir prospecção <ArrowUpRight size={13} /></Link>
                </div>
              </div>
            </section>

            <section id="ajuda" className="mt-7 grid gap-3 sm:grid-cols-3">
              <ModuleCard icon={MessageSquareText} title="Mensagens e follow-up" description="Organize os próximos contatos com seus potenciais clientes." status="Em planejamento" />
              <ModuleCard icon={CreditCard} title="Orçamentos e propostas" description="Estruture propostas comerciais para seus projetos de sites." status="Em planejamento" />
              <ModuleCard icon={Globe2} title="Vitrine de estilos" description="Explore direções visuais para diferentes tipos de negócio." status="Em planejamento" />
            </section>
            <footer className="mt-9 flex flex-col gap-2 border-t border-white/[0.08] py-5 text-[11px] text-white/35 sm:flex-row sm:items-center sm:justify-between"><span>© 2026 Nextage.AI · Workspace de criação digital</span><span className="inline-flex items-center gap-1.5"><ArrowDownRight size={13} /> Assinatura, não créditos por criação</span></footer>
          </div>
        </main>
      </div>
    </div>
  );
}

function Metric({ title, value, note, icon: Icon, tone }: { title: string; value: string; note: string; icon: typeof Globe2; tone: "violet" | "cyan" | "blue" | "green" }) {
  const styles = {
    violet: "bg-violet-300/10 text-violet-200 border-violet-300/10",
    cyan: "bg-cyan-300/10 text-cyan-200 border-cyan-300/10",
    blue: "bg-blue-300/10 text-blue-200 border-blue-300/10",
    green: "bg-emerald-300/10 text-emerald-200 border-emerald-300/10",
  };
  return <article className="rounded-2xl border border-white/[0.09] bg-[#0e1020]/85 p-4 sm:p-5"><div className="flex items-start justify-between gap-3"><p className="text-xs font-medium text-white/50">{title}</p><div className={`flex size-9 items-center justify-center rounded-xl border ${styles[tone]}`}><Icon size={17} /></div></div><p className="mt-4 text-3xl font-semibold tracking-tight tabular-nums">{value}</p><p className="mt-2 text-[11px] leading-5 text-white/40">{note}</p></article>;
}

function ActionCard({ icon: Icon, eyebrow, title, description, href, cta, accent }: { icon: typeof Radar; eyebrow: string; title: string; description: string; href: "/editor" | "/prospecting"; cta: string; accent: "violet" | "cyan" }) {
  return <article className="flex min-w-0 flex-col rounded-xl border border-white/[0.08] bg-white/[0.02] p-4 transition hover:border-white/[0.15] hover:bg-white/[0.035]"><div className={`mb-4 flex size-9 items-center justify-center rounded-xl ${accent === "violet" ? "bg-violet-300/10 text-violet-200" : "bg-cyan-300/10 text-cyan-200"}`}><Icon size={17} /></div><p className="text-[9px] font-semibold tracking-[.16em] text-white/35">{eyebrow}</p><h4 className="mt-1.5 text-sm font-semibold">{title}</h4><p className="mt-2 flex-1 text-xs leading-5 text-white/45">{description}</p><Link to={href} className="mt-5 inline-flex items-center gap-2 text-xs font-semibold text-white/80 transition hover:text-white">{cta}<ArrowRight size={14} /></Link></article>;
}

function ModuleCard({ icon: Icon, title, description, status }: { icon: typeof MessageSquareText; title: string; description: string; status: string }) {
  return <article className="rounded-2xl border border-white/[0.08] bg-[#0e1020]/70 p-4"><div className="flex items-center justify-between gap-3"><div className="flex size-9 items-center justify-center rounded-xl bg-white/[0.05] text-white/55"><Icon size={17} /></div><span className="rounded-md border border-white/10 px-2 py-1 text-[9px] text-white/40">{status}</span></div><h3 className="mt-4 text-sm font-semibold">{title}</h3><p className="mt-1.5 text-xs leading-5 text-white/45">{description}</p></article>;
}
