import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState, type FormEvent } from "react";

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

  useEffect(() => {
    try {
      const saved = localStorage.getItem(KEY);
      if (saved) {
        const parsed: unknown = JSON.parse(saved);
        if (Array.isArray(parsed)) setLeads(parsed.filter((item): item is Lead => item && typeof item.id === "string" && typeof item.business === "string" && statuses.includes(item.status)));
      }
    } catch { setNotice("Não foi possível carregar os leads salvos neste navegador."); }
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (!loaded) return;
    try { localStorage.setItem(KEY, JSON.stringify(leads)); }
    catch { setNotice("Não foi possível salvar. Exporte seus leads para não perder os dados."); }
  }, [leads, loaded]);

  const filtered = useMemo(() => leads.filter((lead) => {
    const text = [lead.business, lead.city, lead.niche, lead.contact].join(" ").toLocaleLowerCase("pt-BR");
    return (filter === "Todos" || lead.status === filter) && (!query || text.includes(query.toLocaleLowerCase("pt-BR")));
  }), [leads, filter, query]);

  const addLead = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const business = form.business.trim();
    if (!business) return;
    const lead: Lead = { ...form, business, city: form.city.trim(), website: form.website.trim(), contact: form.contact.trim(), notes: form.notes.trim(), id: crypto.randomUUID(), status: "Novo", createdAt: new Date().toISOString() };
    setLeads((previous) => [lead, ...previous]);
    setForm({ business: "", city: city.trim(), niche, website: "", contact: "", notes: "" });
    setNotice("Lead adicionado à sua lista.");
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

  return <div className="min-h-screen bg-muted/50 text-foreground">
    <header className="flex flex-wrap items-center justify-between gap-3 border-b bg-background px-5 py-4 sm:px-8">
      <div className="flex items-center gap-4"><Link to="/" className="font-display text-xl font-bold">nextage<span className="text-primary">.ai</span></Link><span className="hidden text-muted-foreground sm:inline">/ Prospecção</span></div>
      <div className="flex flex-wrap gap-2"><Link to="/editor" className="rounded-full border px-4 py-2 text-sm font-semibold hover:bg-muted">Criar site</Link><button onClick={exportCsv} disabled={!filtered.length} className="rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground disabled:cursor-not-allowed disabled:opacity-40">Exportar CSV</button></div>
    </header>
    <main className="mx-auto max-w-7xl space-y-7 px-4 py-7 sm:px-8 sm:py-10">
      <section className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
        <div><p className="text-sm font-semibold uppercase tracking-widest text-primary">Pipeline comercial</p><h1 className="mt-2 font-display text-3xl font-bold tracking-tight sm:text-4xl">Encontre sua próxima oportunidade.</h1><p className="mt-3 max-w-2xl text-muted-foreground">Pesquise negócios locais, registre oportunidades e acompanhe cada contato até a conversão.</p></div>
      </section>
      <section className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {[{label:"Leads registrados",value:counts.total,desc:"Na sua lista"},{label:"Novos",value:counts.new,desc:"Aguardando contato"},{label:"Contatados",value:counts.contacted,desc:"Abordagem iniciada"},{label:"Interessados",value:counts.interested,desc:"Em negociação"}].map((item) => <div key={item.label} className="rounded-2xl border bg-background p-4 sm:p-5"><p className="text-sm text-muted-foreground">{item.label}</p><p className="mt-2 font-display text-3xl font-bold tabular-nums">{item.value}</p><p className="mt-1 text-xs text-muted-foreground">{item.desc}</p></div>)}
      </section>
      <section className="grid gap-5 lg:grid-cols-[minmax(0,1.1fr)_minmax(320px,0.9fr)]">
        <div className="rounded-2xl border bg-background p-5 sm:p-6">
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
      <section className="overflow-hidden rounded-2xl border bg-background">
        <div className="flex flex-col justify-between gap-4 border-b p-5 sm:flex-row sm:items-center sm:p-6"><div><h2 className="font-display text-xl font-bold">Seus leads</h2><p className="mt-1 text-sm text-muted-foreground">Acompanhe o progresso e mantenha seu pipeline organizado.</p></div><div className="flex flex-col gap-2 sm:flex-row"><input aria-label="Buscar leads" value={query} onChange={(e)=>setQuery(e.target.value)} placeholder="Buscar negócio..." className="min-w-0 rounded-lg border bg-background px-3 py-2 text-sm"/><select aria-label="Filtrar por status" value={filter} onChange={(e)=>setFilter(e.target.value)} className="rounded-lg border bg-background px-3 py-2 text-sm"><option>Todos</option>{statuses.map((status)=><option key={status}>{status}</option>)}</select></div></div>
        {filtered.length === 0 ? <div className="px-6 py-14 text-center"><div className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-muted text-xl" aria-hidden="true">⌕</div><h3 className="mt-4 font-semibold">{leads.length ? "Nenhum lead encontrado" : "Sua lista começa com uma oportunidade"}</h3><p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">{leads.length ? "Tente outro termo ou altere o filtro de status." : "Pesquise negócios na sua região e adicione o primeiro estabelecimento para acompanhar os contatos."}</p></div> : <div className="overflow-x-auto"><table className="w-full min-w-[760px] text-left text-sm"><thead className="bg-muted/60 text-xs uppercase tracking-wide text-muted-foreground"><tr><th className="px-5 py-3 font-semibold">Estabelecimento</th><th className="px-5 py-3 font-semibold">Localização</th><th className="px-5 py-3 font-semibold">Contato / site</th><th className="px-5 py-3 font-semibold">Status</th><th className="px-5 py-3 font-semibold">Ação</th></tr></thead><tbody className="divide-y">{filtered.map((lead)=><tr key={lead.id} className="align-top"><td className="px-5 py-4"><p className="font-semibold">{lead.business}</p><p className="mt-1 text-xs text-muted-foreground">{lead.niche}</p>{lead.notes&&<p className="mt-2 max-w-xs text-xs text-muted-foreground">{lead.notes}</p>}</td><td className="px-5 py-4">{lead.city||"—"}</td><td className="px-5 py-4">{lead.contact||"—"}{lead.website&&<a href={lead.website} target="_blank" rel="noreferrer" className="mt-1 block max-w-[200px] truncate text-primary underline underline-offset-2">{lead.website}</a>}</td><td className="px-5 py-4"><select aria-label={`Status de ${lead.business}`} value={lead.status} onChange={(e)=>setLeads((previous)=>previous.map((item)=>item.id===lead.id?{...item,status:e.target.value as LeadStatus}:item))} className="rounded-lg border bg-background px-2 py-2">{statuses.map((status)=><option key={status}>{status}</option>)}</select></td><td className="px-5 py-4"><button onClick={()=>setLeads((previous)=>previous.filter((item)=>item.id!==lead.id))} className="text-xs font-semibold text-destructive underline underline-offset-4">Excluir</button></td></tr>)}</tbody></table></div>}
      </section>
      {notice&&<p role="status" className="text-sm text-muted-foreground">{notice}</p>}
      <p className="text-xs leading-relaxed text-muted-foreground">Os leads ficam salvos neste navegador, não em uma conta sincronizada. Exporte o CSV para manter uma cópia. Utilize contatos comerciais públicos de forma responsável e respeite a legislação aplicável.</p>
    </main>
  </div>;
}
