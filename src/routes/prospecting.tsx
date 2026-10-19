import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState, type FormEvent } from "react";
import { supabase } from "@/integrations/supabase/client";

type LeadStatus = "Novo" | "Contatado" | "Interessado" | "Convertido" | "Descartado";
type Lead = { id: string; business: string; niche: string; city: string; website: string; contact: string; notes: string; status: LeadStatus; createdAt: string };
const KEY = "nextage-prospects-v1";
const statuses: LeadStatus[] = ["Novo", "Contatado", "Interessado", "Convertido", "Descartado"];

export const Route = createFileRoute("/prospecting")({
  head: () => ({ meta: [{ title: "Prospecção — nextage.ai" }, { name: "description", content: "Organize oportunidades comerciais e acompanhe seus contatos." }] }),
  component: Prospecting,
});

function Prospecting() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [query, setQuery] = useState("");
  const [city, setCity] = useState("");
  const [niche, setNiche] = useState("Barbearia");
  const [filter, setFilter] = useState("Todos");
  const [form, setForm] = useState({ business: "", city: "", niche: "Barbearia", website: "", contact: "", notes: "" });
  const [notice, setNotice] = useState("");
  const [user, setUser] = useState<{ id: string; email?: string } | null>(null);
  const [authReady, setAuthReady] = useState(false);
  const [authMode, setAuthMode] = useState<"signin" | "signup">("signin");
  const [authEmail, setAuthEmail] = useState("");
  const [authPassword, setAuthPassword] = useState("");
  const [authBusy, setAuthBusy] = useState(false);

  useEffect(() => {
    let active = true;
    let subscription: { unsubscribe: () => void } | undefined;
    const initializeAuth = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        if (error) throw error;
        if (!active) return;
        setUser(data.session?.user ? { id: data.session.user.id, email: data.session.user.email } : null);
        const authListener = supabase.auth.onAuthStateChange((_event, session) => {
          if (active) setUser(session?.user ? { id: session.user.id, email: session.user.email } : null);
        });
        subscription = authListener.data.subscription;
      } catch {
        if (active) setNotice("Supabase não está configurado neste ambiente. Os leads ficarão salvos apenas neste navegador.");
      } finally {
        if (active) setAuthReady(true);
      }
    };
    void initializeAuth();
    return () => { active = false; subscription?.unsubscribe(); };
  }, []);

  useEffect(() => {
    if (!authReady) return;
    let active = true;
    setLoaded(false);
    const loadLeads = async () => {
      if (user) {
        setLeads([]);
        try {
          const { data, error } = await supabase.from("prospecting_leads").select("*").order("created_at", { ascending: false });
          if (error) throw error;
          let cloudRows = data ?? [];
          if (cloudRows.length === 0) {
            const saved = localStorage.getItem(KEY);
            const parsed: unknown = saved ? JSON.parse(saved) : [];
            if (Array.isArray(parsed)) {
              const legacy = parsed.filter((item): item is Lead =>
                item && typeof item.business === "string" && item.business.trim().length > 0 &&
                typeof item.id === "string" && statuses.includes(item.status),
              );
              if (legacy.length) {
                const { data: imported, error: importError } = await supabase.from("prospecting_leads").insert(
                  legacy.map(({ business, niche, city, website, contact, notes, status, createdAt }) => ({
                    user_id: user.id, business, niche, city, website, contact, notes, status,
                    ...(createdAt ? { created_at: createdAt } : {}),
                  })),
                ).select("*");
                if (importError) throw importError;
                cloudRows = imported ?? [];
                if (active) setNotice(`Importamos ${cloudRows.length} lead(s) antigos para sua conta.`);
              }
            }
          }
          if (active) setLeads(cloudRows.map((row) => ({
            id: row.id, business: row.business, niche: row.niche, city: row.city,
            website: row.website, contact: row.contact, notes: row.notes,
            status: row.status as LeadStatus, createdAt: row.created_at,
          })));
        } catch {
          if (active) setNotice("Não foi possível carregar os leads da nuvem. Confira se a migração do banco foi aplicada.");
        }
      } else {
        try {
          const saved = localStorage.getItem(KEY);
          if (saved) {
            const parsed: unknown = JSON.parse(saved);
            if (Array.isArray(parsed)) setLeads(parsed.filter((item): item is Lead => item && typeof item.id === "string" && typeof item.business === "string" && statuses.includes(item.status)));
            else setLeads([]);
          } else setLeads([]);
        } catch {
          if (active) setNotice("Não foi possível carregar os leads salvos neste navegador.");
          setLeads([]);
        }
      }
      if (active) setLoaded(true);
    };
    void loadLeads();
    return () => { active = false; };
  }, [authReady, user?.id]);

  useEffect(() => {
    if (!authReady || !loaded || user) return;
    try { localStorage.setItem(KEY, JSON.stringify(leads)); }
    catch { setNotice("Não foi possível salvar. Exporte seus leads para não perder os dados."); }
  }, [leads, loaded, authReady, user]);

  const filtered = useMemo(() => leads.filter((lead) => {
    const text = [lead.business, lead.city, lead.niche, lead.contact].join(" ").toLocaleLowerCase("pt-BR");
    return (filter === "Todos" || lead.status === filter) && (!query || text.includes(query.toLocaleLowerCase("pt-BR")));
  }), [leads, filter, query]);

  const addLead = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const business = form.business.trim();
    if (!business) return;
    const values = { business, city: form.city.trim(), niche: form.niche, website: form.website.trim(), contact: form.contact.trim(), notes: form.notes.trim() };
    if (user) {
      try {
        const { data, error } = await supabase.from("prospecting_leads").insert({ ...values, user_id: user.id }).select("*").single();
        if (error) throw error;
        const saved: Lead = { id: data.id, ...values, status: data.status as LeadStatus, createdAt: data.created_at };
        setLeads((previous) => [saved, ...previous]);
        setNotice("Lead salvo com segurança na nuvem.");
      } catch {
        setNotice("Não foi possível salvar o lead na nuvem. Confira a conexão e as permissões do banco.");
        return;
      }
    } else {
      const lead: Lead = { ...values, id: crypto.randomUUID(), status: "Novo", createdAt: new Date().toISOString() };
      setLeads((previous) => [lead, ...previous]);
      setNotice("Lead salvo neste navegador. Entre na sua conta para sincronizar entre dispositivos.");
    }
    setForm({ business: "", city: city.trim(), niche, website: "", contact: "", notes: "" });
  };

  const changeStatus = async (lead: Lead, status: LeadStatus) => {
    if (user) {
      const { error } = await supabase.from("prospecting_leads").update({ status }).eq("id", lead.id);
      if (error) { setNotice("Não foi possível atualizar o status na nuvem."); return; }
    }
    setLeads((previous) => previous.map((item) => item.id === lead.id ? { ...item, status } : item));
    setNotice(user ? "Status atualizado na nuvem." : "Status atualizado.");
  };

  const deleteLead = async (lead: Lead) => {
    if (user) {
      const { error } = await supabase.from("prospecting_leads").delete().eq("id", lead.id);
      if (error) { setNotice("Não foi possível excluir o lead na nuvem."); return; }
    }
    setLeads((previous) => previous.filter((item) => item.id !== lead.id));
    setNotice("Lead excluído.");
  };

  const submitAuth = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setAuthBusy(true);
    setNotice("");
    try {
      const email = authEmail.trim();
      const result = authMode === "signup"
        ? await supabase.auth.signUp({ email, password: authPassword })
        : await supabase.auth.signInWithPassword({ email, password: authPassword });
      if (result.error) throw result.error;
      if (authMode === "signup" && !result.data.session) {
        setNotice("Conta criada. Confira seu e-mail para confirmar o cadastro e depois entre.");
      } else {
        setNotice(authMode === "signup" ? "Conta criada e conectada." : "Login realizado.");
      }
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "Não foi possível autenticar. Verifique os dados e a configuração do Supabase.");
    } finally {
      setAuthBusy(false);
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      setNotice("Você saiu da conta. Seus leads na nuvem continuam salvos.");
    } catch {
      setNotice("Não foi possível sair da conta.");
    }
  };

  const searchMaps = () => {
    const term = [niche, "sem site", city.trim()].filter(Boolean).join(" ");
    window.open("https://www.google.com/maps/search/" + encodeURIComponent(term), "_blank", "noopener,noreferrer");
  };

  const exportCsv = () => {
    const columns: (keyof Lead)[] = ["business", "niche", "city", "website", "contact", "status", "notes", "createdAt"];
    const escape = (value: string) => '"' + value.replace(/"/g, '""') + '"';
    const csv = "\uFEFF" + [columns.join(";"), ...filtered.map((lead) => columns.map((key) => escape(String(lead[key] ?? ""))).join(";"))].join("\r\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8;" }));
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "nextage-leads.csv";
    anchor.click();
    URL.revokeObjectURL(url);
  };

  const counts = { total: leads.length, new: leads.filter((lead) => lead.status === "Novo").length, contacted: leads.filter((lead) => lead.status === "Contatado").length, interested: leads.filter((lead) => lead.status === "Interessado").length };

  return <div className="min-h-screen bg-[#030611] text-foreground">
    <header className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 bg-[#050816] px-5 py-4 text-white sm:px-8">
      <div className="flex items-center gap-4"><Link to="/" className="font-display text-xl font-bold tracking-tight">nextage<span className="text-cyan-300">.ai</span></Link><span className="hidden border-l border-white/15 pl-4 text-sm text-slate-400 sm:inline">Lead Hunter / Prospecção</span></div>
      <div className="flex flex-wrap items-center gap-2">{user && <span className="hidden text-sm text-muted-foreground sm:inline">{user.email}</span>}{user && <button onClick={signOut} className="rounded-full border px-4 py-2 text-sm font-semibold hover:bg-muted">Sair</button>}<Link to="/editor" className="rounded-full border px-4 py-2 text-sm font-semibold hover:bg-muted">Criar site</Link><button onClick={exportCsv} disabled={!filtered.length} className="rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground disabled:cursor-not-allowed disabled:opacity-40">Exportar CSV</button></div>
    </header>
    <main className="mx-auto max-w-7xl space-y-7 px-4 py-7 sm:px-8 sm:py-10">
      <section className="relative overflow-hidden rounded-3xl border border-cyan-400/20 bg-[#050816] p-5 text-white shadow-[0_0_60px_rgba(34,211,238,0.08)] sm:p-8 lg:p-10">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_15%_10%,rgba(30,64,175,0.26),transparent_45%),radial-gradient(ellipse_at_85%_80%,rgba(126,34,206,0.18),transparent_40%)]" />
        <div className="relative grid items-center gap-8 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="z-10">
            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-300/25 bg-cyan-300/5 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.24em] text-cyan-200"><span className="size-1.5 animate-pulse rounded-full bg-cyan-300" /> NEXTAGE INTELLIGENCE / LEAD HUNTER</div>
            <h1 className="mt-5 max-w-xl font-display text-4xl font-bold leading-[1.04] tracking-tight sm:text-5xl lg:text-6xl">Encontre oportunidades antes da concorrência<span className="text-cyan-300">.</span></h1>
            <p className="mt-5 max-w-lg text-sm leading-7 text-slate-300 sm:text-base">Um centro de comando para descobrir negócios, identificar presença digital fraca e transformar potenciais clientes em projetos.</p>
            <div className="mt-7 flex flex-wrap gap-3"><button onClick={searchMaps} className="rounded-xl border border-cyan-300/40 bg-cyan-300 px-5 py-3 text-sm font-bold text-slate-950 shadow-[0_0_24px_rgba(34,211,238,0.22)] transition hover:bg-cyan-200">Iniciar varredura ↗</button><span className="inline-flex items-center rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-xs text-slate-300">Radar visual · busca externa</span></div>
            <div className="mt-7 flex flex-wrap gap-x-6 gap-y-2 text-xs text-slate-400"><span>⌁ Pesquisa por nicho</span><span>◉ Descoberta regional</span><span>↗ Pipeline comercial</span></div>
          </div>
          <div className="relative mx-auto aspect-square w-full max-w-[440px]">
            <div className="radar-glow absolute inset-[13%] rounded-full" />
            <div className="radar-ring radar-ring-one absolute inset-[5%] rounded-full" /><div className="radar-ring radar-ring-two absolute inset-[16%] rounded-full" /><div className="radar-ring radar-ring-three absolute inset-[27%] rounded-full" />
            <div className="radar-grid absolute inset-[5%] rounded-full" />
            <div className="radar-sweep absolute inset-[5%] rounded-full" />
            <div className="radar-core absolute left-1/2 top-1/2 z-10 size-5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet-300 shadow-[0_0_12px_5px_rgba(167,139,250,0.65),0_0_48px_12px_rgba(34,211,238,0.2)]" />
            <span className="radar-point absolute left-[27%] top-[35%] size-2 rounded-full bg-cyan-200 shadow-[0_0_14px_4px_rgba(103,232,249,0.75)]" /><span className="radar-point radar-point-delay absolute right-[23%] top-[28%] size-1.5 rounded-full bg-violet-300 shadow-[0_0_14px_4px_rgba(196,181,253,0.75)]" /><span className="radar-point radar-point-delay-two absolute bottom-[24%] left-[35%] size-2 rounded-full bg-cyan-200 shadow-[0_0_14px_4px_rgba(103,232,249,0.75)]" />
            <div className="absolute left-[7%] top-[14%] rounded-lg border border-cyan-300/20 bg-[#080e24]/85 px-3 py-2 backdrop-blur"><p className="text-[9px] uppercase tracking-[0.2em] text-cyan-200">Sistema</p><p className="mt-1 text-xs font-semibold text-white">Pronto para buscar</p></div>
            <div className="absolute bottom-[12%] right-[2%] rounded-lg border border-violet-300/20 bg-[#080e24]/85 px-3 py-2 backdrop-blur"><p className="text-[9px] uppercase tracking-[0.2em] text-violet-200">Área de alcance</p><p className="mt-1 text-xs font-semibold text-white">Nicho + região</p></div>
            <div className="absolute bottom-[3%] left-[10%] h-px w-[35%] bg-gradient-to-r from-transparent via-cyan-300/70 to-transparent" />
          </div>
        </div>
        <style>{`.radar-glow{background:radial-gradient(circle,rgba(139,92,246,.22),rgba(34,211,238,.08) 38%,transparent 70%);filter:blur(8px)}.radar-ring{border:1px solid rgba(103,232,249,.42);box-shadow:inset 0 0 22px rgba(34,211,238,.035),0 0 22px rgba(34,211,238,.06)}.radar-ring-one{border-style:solid;animation:radar-breathe 4s ease-in-out infinite}.radar-ring-two{border-color:rgba(129,140,248,.5);border-style:dashed;animation:radar-rotate 28s linear infinite}.radar-ring-three{border-color:rgba(196,181,253,.55);animation:radar-breathe 3s ease-in-out infinite reverse}.radar-grid{background:linear-gradient(90deg,transparent 49.8%,rgba(103,232,249,.18) 50%,transparent 50.2%),linear-gradient(transparent 49.8%,rgba(103,232,249,.18) 50%,transparent 50.2%);mask-image:radial-gradient(circle,black 30%,transparent 72%)}.radar-sweep{overflow:hidden;border-radius:50%;background:conic-gradient(from 0deg,transparent 0deg,transparent 270deg,rgba(34,211,238,.025) 300deg,rgba(34,211,238,.3) 350deg,rgba(139,92,246,.2) 360deg);animation:radar-rotate 6s linear infinite;mask-image:radial-gradient(circle,transparent 0%,black 100%)}.radar-point{animation:radar-ping 2.8s ease-in-out infinite}.radar-point-delay{animation-delay:.8s}.radar-point-delay-two{animation-delay:1.6s}@keyframes radar-rotate{to{transform:rotate(360deg)}}@keyframes radar-breathe{0%,100%{opacity:.55;transform:scale(.985)}50%{opacity:1;transform:scale(1.015)}}@keyframes radar-ping{0%,100%{opacity:.55;scale:.8}50%{opacity:1;scale:1.4}}@media(prefers-reduced-motion:reduce){.radar-ring,.radar-sweep,.radar-point{animation:none}}`}</style>
      </section>
      {!user && authReady && <section className="rounded-2xl border border-white/10 bg-[#080d1c] p-5 text-white sm:p-6">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div><h2 className="font-display text-xl font-bold">Sincronize seus leads</h2><p className="mt-1 max-w-xl text-sm text-muted-foreground">Crie uma conta ou entre para guardar seus contatos na nuvem e acessá-los em outros dispositivos. Sem login, os dados ficam apenas neste navegador.</p></div>
          <div className="flex shrink-0 gap-2"><button type="button" onClick={() => setAuthMode("signin")} className={`rounded-full px-4 py-2 text-sm font-semibold ${authMode === "signin" ? "bg-primary text-primary-foreground" : "border hover:bg-muted"}`}>Entrar</button><button type="button" onClick={() => setAuthMode("signup")} className={`rounded-full px-4 py-2 text-sm font-semibold ${authMode === "signup" ? "bg-primary text-primary-foreground" : "border hover:bg-muted"}`}>Criar conta</button></div>
        </div>
        <form onSubmit={submitAuth} className="mt-4 grid gap-3 sm:grid-cols-[1fr_1fr_auto]">
          <input type="email" required autoComplete="email" value={authEmail} onChange={(e) => setAuthEmail(e.target.value)} placeholder="Seu e-mail" aria-label="E-mail para entrar" className="min-w-0 rounded-lg border bg-background px-3 py-2.5 text-sm" />
          <input type="password" required minLength={6} autoComplete={authMode === "signup" ? "new-password" : "current-password"} value={authPassword} onChange={(e) => setAuthPassword(e.target.value)} placeholder="Senha (mínimo 6 caracteres)" aria-label="Senha" className="min-w-0 rounded-lg border bg-background px-3 py-2.5 text-sm" />
          <button type="submit" disabled={authBusy} className="rounded-lg bg-foreground px-5 py-2.5 text-sm font-semibold text-background disabled:opacity-50">{authBusy ? "Aguarde..." : authMode === "signup" ? "Criar conta" : "Entrar"}</button>
        </form>
      </section>}
      {user && <p className="rounded-xl border border-primary/20 bg-primary/5 px-4 py-3 text-sm">Conectado como <strong>{user.email}</strong>. Seus leads são sincronizados com segurança pela sua conta.</p>}
      <section className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {[{label:"Leads registrados",value:counts.total,desc:"Na sua lista"},{label:"Novos",value:counts.new,desc:"Aguardando contato"},{label:"Contatados",value:counts.contacted,desc:"Abordagem iniciada"},{label:"Interessados",value:counts.interested,desc:"Em negociação"}].map((item) => <div key={item.label} className="rounded-2xl border border-white/10 bg-[#080d1c] p-4 text-white sm:p-5"><p className="text-sm text-muted-foreground">{item.label}</p><p className="mt-2 font-display text-3xl font-bold tabular-nums">{item.value}</p><p className="mt-1 text-xs text-muted-foreground">{item.desc}</p></div>)}
      </section>
      <section className="grid gap-5 lg:grid-cols-[minmax(0,1.1fr)_minmax(320px,0.9fr)]">
        <div className="rounded-2xl border border-white/10 bg-[#080d1c] p-5 text-white sm:p-6">
          <div className="mb-5"><h2 className="font-display text-xl font-bold">Pesquisar estabelecimentos</h2><p className="mt-1 text-sm text-muted-foreground">Abra uma busca no Google Maps e registre os negócios relevantes.</p></div>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="text-sm font-medium">Tipo de negócio<select value={niche} onChange={(e) => setNiche(e.target.value)} className="mt-1.5 w-full rounded-lg border bg-background px-3 py-2.5"><option>Barbearia</option><option>Assistência técnica</option><option>Restaurante</option><option>Clínica de estética</option><option>Academia</option><option>Oficina mecânica</option><option>Imobiliária</option><option>Advocacia</option><option>Odontologia</option><option>Outro negócio local</option></select></label>
            <label className="text-sm font-medium">Cidade ou região<input value={city} onChange={(e) => setCity(e.target.value)} placeholder="Ex.: Uberlândia, MG" className="mt-1.5 w-full rounded-lg border bg-background px-3 py-2.5" /></label>
          </div>
          <button onClick={searchMaps} className="mt-4 w-full rounded-xl bg-foreground px-4 py-3 font-semibold text-background transition hover:opacity-90">Abrir busca no Google Maps ↗</button>
          <p className="mt-3 text-xs leading-relaxed text-muted-foreground">A busca abre em outra aba. A identificação automática de sites ausentes ainda não está conectada a uma API de dados; confirme as informações antes de cadastrar cada oportunidade.</p>
        </div>
        <div className="rounded-2xl border bg-background p-5 sm:p-6">
          <h2 className="font-display text-xl font-bold">Adicionar lead</h2><p className="mb-5 mt-1 text-sm text-muted-foreground">Registre manualmente um negócio encontrado.</p>
          <form onSubmit={addLead} className="space-y-3">
            <label className="block text-sm font-medium">Nome do estabelecimento *<input required maxLength={120} value={form.business} onChange={(e) => setForm({...form,business:e.target.value})} placeholder="Nome da empresa" className="mt-1 w-full rounded-lg border bg-background px-3 py-2.5" /></label>
            <div className="grid gap-3 sm:grid-cols-2"><label className="block text-sm font-medium">Cidade<input maxLength={120} value={form.city} onChange={(e) => setForm({...form,city:e.target.value})} placeholder="Cidade, UF" className="mt-1 w-full rounded-lg border bg-background px-3 py-2.5" /></label><label className="block text-sm font-medium">Segmento<select value={form.niche} onChange={(e) => setForm({...form,niche:e.target.value})} className="mt-1 w-full rounded-lg border bg-background px-3 py-2.5">{["Barbearia","Assistência técnica","Restaurante","Clínica de estética","Academia","Oficina mecânica","Imobiliária","Advocacia","Odontologia","Outro"].map((value)=><option key={value}>{value}</option>)}</select></label></div>
            <label className="block text-sm font-medium">Site atual (se houver)<input type="url" maxLength={500} value={form.website} onChange={(e) => setForm({...form,website:e.target.value})} placeholder="https://" className="mt-1 w-full rounded-lg border bg-background px-3 py-2.5" /></label>
            <label className="block text-sm font-medium">Contato público<input maxLength={160} value={form.contact} onChange={(e) => setForm({...form,contact:e.target.value})} placeholder="Telefone comercial, e-mail ou Instagram" className="mt-1 w-full rounded-lg border bg-background px-3 py-2.5" /></label>
            <label className="block text-sm font-medium">Observações<textarea maxLength={1000} rows={2} value={form.notes} onChange={(e) => setForm({...form,notes:e.target.value})} placeholder="Ex.: não encontrei site oficial" className="mt-1 w-full rounded-lg border bg-background px-3 py-2.5" /></label>
            <button type="submit" className="w-full rounded-xl bg-primary px-4 py-3 font-semibold text-primary-foreground hover:opacity-90">+ Salvar lead</button>
          </form>
        </div>
      </section>
      <section className="overflow-hidden rounded-2xl border border-white/10 bg-[#080d1c] text-white">
        <div className="flex flex-col justify-between gap-4 border-b p-5 sm:flex-row sm:items-center sm:p-6"><div><h2 className="font-display text-xl font-bold">Seus leads</h2><p className="mt-1 text-sm text-muted-foreground">Acompanhe o progresso e mantenha seu pipeline organizado.</p></div><div className="flex flex-col gap-2 sm:flex-row"><input aria-label="Buscar leads" value={query} onChange={(e)=>setQuery(e.target.value)} placeholder="Buscar negócio..." className="min-w-0 rounded-lg border bg-background px-3 py-2 text-sm"/><select aria-label="Filtrar por status" value={filter} onChange={(e)=>setFilter(e.target.value)} className="rounded-lg border bg-background px-3 py-2 text-sm"><option>Todos</option>{statuses.map((status)=><option key={status}>{status}</option>)}</select></div></div>
        {filtered.length === 0 ? <div className="px-6 py-14 text-center"><div className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-muted text-xl" aria-hidden="true">⌕</div><h3 className="mt-4 font-semibold">{leads.length ? "Nenhum lead encontrado" : "Sua lista começa com uma oportunidade"}</h3><p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">{leads.length ? "Tente outro termo ou altere o filtro de status." : "Pesquise negócios na sua região e adicione o primeiro estabelecimento para acompanhar os contatos."}</p></div> : <div className="overflow-x-auto"><table className="w-full min-w-[760px] text-left text-sm"><thead className="bg-muted/60 text-xs uppercase tracking-wide text-muted-foreground"><tr><th className="px-5 py-3 font-semibold">Estabelecimento</th><th className="px-5 py-3 font-semibold">Localização</th><th className="px-5 py-3 font-semibold">Contato / site</th><th className="px-5 py-3 font-semibold">Status</th><th className="px-5 py-3 font-semibold">Ação</th></tr></thead><tbody className="divide-y">{filtered.map((lead)=><tr key={lead.id} className="align-top"><td className="px-5 py-4"><p className="font-semibold">{lead.business}</p><p className="mt-1 text-xs text-muted-foreground">{lead.niche}</p>{lead.notes&&<p className="mt-2 max-w-xs text-xs text-muted-foreground">{lead.notes}</p>}</td><td className="px-5 py-4">{lead.city||"—"}</td><td className="px-5 py-4">{lead.contact||"—"}{lead.website&&<a href={lead.website} target="_blank" rel="noreferrer" className="mt-1 block max-w-[200px] truncate text-primary underline underline-offset-2">{lead.website}</a>}</td><td className="px-5 py-4"><select aria-label={`Status de ${lead.business}`} value={lead.status} onChange={(e)=>void changeStatus(lead, e.target.value as LeadStatus)} className="rounded-lg border bg-background px-2 py-2">{statuses.map((status)=><option key={status}>{status}</option>)}</select></td><td className="px-5 py-4"><button onClick={()=>void deleteLead(lead)} className="text-xs font-semibold text-destructive underline underline-offset-4">Excluir</button></td></tr>)}</tbody></table></div>}
      </section>
      {notice&&<p role="status" className="text-sm text-muted-foreground">{notice}</p>}
      <p className="text-xs leading-relaxed text-muted-foreground">{user ? "Seus leads estão vinculados à sua conta. Exporte o CSV para manter uma cópia de segurança." : "Sem entrar na conta, os leads ficam salvos apenas neste navegador. Exporte o CSV para manter uma cópia. Utilize contatos comerciais públicos de forma responsável e respeite a legislação aplicável."}</p>
    </main>
  </div>;
}
