import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { blockLabels, fieldLabels, makeBlock, niches, type BlockType, type SiteData } from "@/lib/builder";
import { BlockView, SiteFrame } from "@/components/builder/BlockView";

const STORAGE_KEY = "nextage-site-v1";
type SavedSite = SiteData & { name: string };

function initialSite(): SavedSite {
  const template = niches.find((n) => n.id === "barbearia")!;
  return { ...template.build("Minha Empresa"), name: "Minha Empresa" };
}

export const Route = createFileRoute("/editor")({
  head: () => ({ meta: [{ title: "Editor de sites — nextage.ai" }, { name: "description", content: "Monte e personalize seu site com um editor visual." }] }),
  component: Editor,
});

function Editor() {
  const [site, setSite] = useState<SavedSite | null>(null);
  const [selected, setSelected] = useState<string | null>(null);
  const [device, setDevice] = useState<"desktop" | "mobile">("desktop");
  const [notice, setNotice] = useState("");

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      setSite(raw ? JSON.parse(raw) as SavedSite : initialSite());
    } catch {
      setSite(initialSite());
      setNotice("Não foi possível recuperar o último rascunho. Um novo foi criado.");
    }
  }, []);

  useEffect(() => {
    if (!site) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(site));
    } catch {
      setNotice("O navegador não conseguiu salvar o rascunho. Verifique o espaço disponível.");
    }
  }, [site]);

  if (!site) return <main className="p-8 text-sm text-muted-foreground">Carregando editor…</main>;

  const selectedBlock = site.blocks.find((block) => block.id === selected);
  const updateBlock = (key: string, value: string) => setSite((current) => current ? ({
    ...current,
    blocks: current.blocks.map((block) => block.id === selected ? { ...block, props: { ...block.props, [key]: value } } : block),
  }) : current);

  const addBlock = (type: BlockType) => {
    const block = makeBlock(type);
    setSite((current) => current ? { ...current, blocks: [...current.blocks, block] } : current);
    setSelected(block.id);
  };

  return (
    <div className="flex min-h-screen flex-col bg-muted text-foreground">
      <header className="flex flex-wrap items-center gap-3 border-b bg-background px-4 py-3">
        <Link to="/" className="font-display text-xl font-bold">nextage<span className="text-primary">.ai</span></Link>
        <label className="min-w-0 flex-1 text-sm"><span className="sr-only">Nome do site</span><input aria-label="Nome do site" value={site.name} onChange={(e) => setSite({ ...site, name: e.target.value, seo: { ...site.seo, title: e.target.value } })} className="w-full max-w-xs rounded-md border bg-background px-3 py-2" /></label>
        <div className="flex flex-wrap items-center gap-2">
          <button onClick={() => setDevice("desktop")} aria-pressed={device === "desktop"} className={`rounded-md px-3 py-2 text-sm ${device === "desktop" ? "bg-foreground text-background" : "border bg-background"}`}>Desktop</button>
          <button onClick={() => setDevice("mobile")} aria-pressed={device === "mobile"} className={`rounded-md px-3 py-2 text-sm ${device === "mobile" ? "bg-foreground text-background" : "border bg-background"}`}>Celular</button>
          <Link to="/preview" className="rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground">Ver prévia</Link>
        </div>
      </header>
      {notice && <p role="status" className="px-4 py-2 text-sm text-muted-foreground">{notice}</p>}
      <div className="grid min-h-0 flex-1 lg:grid-cols-[210px_minmax(0,1fr)_260px]">
        <aside className="border-b bg-background p-4 lg:border-b-0 lg:border-r">
          <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Adicionar seção</h2>
          <div className="grid grid-cols-2 gap-2 lg:grid-cols-1">
            {(Object.keys(blockLabels) as BlockType[]).map((type) => <button key={type} onClick={() => addBlock(type)} className="rounded-lg border bg-card px-3 py-2 text-left text-sm transition hover:border-primary focus-visible:outline-2 focus-visible:outline-primary">+ {blockLabels[type]}</button>)}
          </div>
          <h2 className="mb-3 mt-6 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Aparência</h2>
          <label className="mb-3 block text-sm">Tema<select value={site.theme.mode} onChange={(e) => setSite({ ...site, theme: { ...site.theme, mode: e.target.value as "claro" | "escuro" } })} className="mt-1 w-full rounded-md border bg-background p-2"><option value="claro">Claro</option><option value="escuro">Escuro</option></select></label>
          <label className="mb-3 block text-sm">Cor principal<input type="color" value={site.theme.accent} onChange={(e) => setSite({ ...site, theme: { ...site.theme, accent: e.target.value } })} className="mt-1 h-10 w-full rounded-md border bg-background p-1" /></label>
          <label className="block text-sm">Fonte<select value={site.theme.font} onChange={(e) => setSite({ ...site, theme: { ...site.theme, font: e.target.value } })} className="mt-1 w-full rounded-md border bg-background p-2">{["Manrope", "Sora", "Playfair Display", "Space Grotesk", "DM Serif Display"].map((font) => <option key={font}>{font}</option>)}</select></label>
        </aside>
        <main className="min-w-0 overflow-auto p-3 sm:p-6" aria-label="Prévia editável do site">
          <div className={`mx-auto min-h-96 overflow-hidden rounded-xl bg-background shadow-xl transition-[max-width] duration-200 ${device === "desktop" ? "max-w-5xl" : "max-w-sm"}`}>
            <SiteFrame theme={site.theme}>
              {site.blocks.length === 0 ? <div className="p-12 text-center"><h2 className="text-2xl font-bold">Seu site começa aqui</h2><p className="mt-2 opacity-70">Adicione uma seção no painel para começar.</p></div> : site.blocks.map((block) => <div key={block.id} className={selected === block.id ? "relative outline outline-2 outline-primary outline-offset-[-2px]" : "relative hover:outline hover:outline-1 hover:outline-primary/50"}><button aria-label={`Editar seção ${blockLabels[block.type]}`} onClick={() => setSelected(block.id)} className="absolute right-2 top-2 z-10 rounded bg-background/90 px-2 py-1 text-xs font-semibold text-foreground shadow">{selected === block.id ? "Selecionada" : "Editar seção"}</button><BlockView block={block} /></div>)}
            </SiteFrame>
          </div>
        </main>
        <aside className="border-t bg-background p-4 lg:border-t-0 lg:border-l">
          <h2 className="mb-4 font-display text-lg font-bold">Personalizar</h2>
          {selectedBlock ? <><p className="mb-3 text-sm text-muted-foreground">{blockLabels[selectedBlock.type]}</p><div className="space-y-3">{Object.entries(selectedBlock.props).map(([key, value]) => <label key={key} className="block text-sm font-medium">{fieldLabels[key] ?? key}<textarea rows={key === "body" || key === "subtitle" ? 4 : 2} value={value} onChange={(e) => updateBlock(key, e.target.value)} className="mt-1 w-full rounded-md border bg-background p-2 font-normal focus-visible:outline-2 focus-visible:outline-primary" /></label>)}</div><button onClick={() => { setSite({ ...site, blocks: site.blocks.filter((block) => block.id !== selected) }); setSelected(null); }} className="mt-5 w-full rounded-md border border-destructive px-3 py-2 text-sm font-semibold text-destructive hover:bg-destructive/10">Remover seção</button></> : <p className="text-sm leading-relaxed text-muted-foreground">Selecione uma seção na prévia para editar seus textos e links.</p>}
          <p className="mt-6 text-xs text-muted-foreground">Rascunho salvo automaticamente neste navegador.</p>
        </aside>
      </div>
    </div>
  );
}
