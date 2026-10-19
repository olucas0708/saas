import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { blockLabels, fieldLabels, loadSite, makeBlock, saveSite, type BlockType, type Site } from "@/lib/builder";
import { BlockView, SiteFrame } from "@/components/builder/BlockView";

export const Route = createFileRoute("/editor")({
  head: () => ({
    meta: [
      { title: "Editor — Monta" },
      { name: "description", content: "Arraste e solte blocos para montar seu site." },
      { property: "og:title", content: "Editor — Monta" },
      { property: "og:description", content: "Editor visual de arrastar e soltar." },
    ],
  }),
  component: Editor,
});

type Drag = { kind: "new"; type: BlockType } | { kind: "move"; index: number } | null;

function Editor() {
  const [site, setSite] = useState<Site | null>(null);
  const [selected, setSelected] = useState<string | null>(null);
  const [drag, setDrag] = useState<Drag>(null);
  const [over, setOver] = useState<number | null>(null);
  const [device, setDevice] = useState<"pc" | "celular">("pc");

  useEffect(() => setSite(loadSite() ?? { name: "Meu site", theme: "claro", blocks: [] }), []);
  useEffect(() => { if (site) saveSite(site); }, [site]);
  if (!site) return null;

  const drop = (at: number) => {
    if (!drag) return;
    const blocks = [...site.blocks];
    if (drag.kind === "new") {
      const b = makeBlock(drag.type);
      blocks.splice(at, 0, b);
      setSelected(b.id);
    } else {
      const [m] = blocks.splice(drag.index, 1);
      blocks.splice(at > drag.index ? at - 1 : at, 0, m);
    }
    setSite({ ...site, blocks });
    setDrag(null);
    setOver(null);
  };

  const sel = site.blocks.find((b) => b.id === selected);
  const update = (k: string, v: string) =>
    setSite({ ...site, blocks: site.blocks.map((b) => (b.id === selected ? { ...b, props: { ...b.props, [k]: v } } : b)) });

  const Zone = ({ at }: { at: number }) => (
    <div
      onDragOver={(e) => { e.preventDefault(); setOver(at); }}
      onDragLeave={() => setOver(null)}
      onDrop={() => drop(at)}
      className={`transition-all ${drag ? "h-6" : "h-0"} ${over === at ? "h-14 bg-primary/20 outline-2 outline-dashed outline-primary" : ""}`}
    />
  );

  return (
    <div className="flex h-screen flex-col bg-muted">
      <header className="flex items-center gap-3 border-b bg-background px-4 py-2">
        <Link to="/" className="font-display text-xl font-bold">monta<span className="text-primary">.</span></Link>
        <input value={site.name} onChange={(e) => setSite({ ...site, name: e.target.value })} className="rounded-md border bg-background px-2 py-1 text-sm" />
        <div className="ml-auto flex items-center gap-2 text-sm">
          {(["pc", "celular"] as const).map((d) => (
            <button key={d} onClick={() => setDevice(d)} className={`rounded-md px-3 py-1 ${device === d ? "bg-foreground text-background" : "hover:bg-accent"}`}>{d === "pc" ? "Computador" : "Celular"}</button>
          ))}
          <button onClick={() => setSite({ ...site, theme: site.theme === "claro" ? "escuro" : "claro" })} className="rounded-md border px-3 py-1">Tema: {site.theme}</button>
          <Link to="/preview" target="_blank" className="rounded-full bg-primary px-4 py-1.5 font-semibold text-primary-foreground">Ver prévia</Link>
        </div>
      </header>
      <div className="flex min-h-0 flex-1">
        <aside className="w-56 shrink-0 overflow-y-auto border-r bg-background p-4">
          <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Arraste um bloco</p>
          <div className="space-y-2">
            {(Object.keys(blockLabels) as BlockType[]).map((t) => (
              <div key={t} draggable onDragStart={() => setDrag({ kind: "new", type: t })} onDragEnd={() => setDrag(null)}
                onClick={() => { const b = makeBlock(t); setSite({ ...site, blocks: [...site.blocks, b] }); setSelected(b.id); }}
                className="cursor-grab rounded-lg border bg-card px-3 py-2 text-sm font-medium hover:border-primary active:cursor-grabbing">
                {blockLabels[t]}
              </div>
            ))}
          </div>
          <p className="mt-4 text-xs text-muted-foreground">Dica: clique para adicionar no final.</p>
        </aside>
        <main className="flex-1 overflow-y-auto p-6">
          <div className={`mx-auto overflow-hidden rounded-xl bg-background shadow-lg transition-all ${device === "pc" ? "max-w-4xl" : "max-w-sm"}`}>
            <SiteFrame theme={site.theme}>
              <Zone at={0} />
              {site.blocks.length === 0 && (
                <div onDragOver={(e) => e.preventDefault()} onDrop={() => drop(0)} className="m-6 rounded-xl border-2 border-dashed p-16 text-center opacity-60">
                  Arraste blocos da esquerda para cá
                </div>
              )}
              {site.blocks.map((b, i) => (
                <div key={b.id}>
                  <div draggable onDragStart={() => setDrag({ kind: "move", index: i })} onDragEnd={() => setDrag(null)}
                    onClick={() => setSelected(b.id)}
                    className={`group relative cursor-pointer outline-offset-[-2px] ${selected === b.id ? "outline-2 outline-primary" : "hover:outline-2 hover:outline-primary/40"}`}>
                    <span className="absolute left-2 top-2 z-10 hidden rounded bg-primary px-2 py-0.5 text-xs font-semibold text-primary-foreground group-hover:block">⠿ {blockLabels[b.type]}</span>
                    <BlockView block={b} />
                  </div>
                  <Zone at={i + 1} />
                </div>
              ))}
            </SiteFrame>
          </div>
        </main>
        <aside className="w-72 shrink-0 overflow-y-auto border-l bg-background p-4">
          {sel ? (
            <>
              <p className="mb-4 font-display text-lg font-bold">{blockLabels[sel.type]}</p>
              <div className="space-y-3">
                {Object.entries(sel.props).map(([k, v]) => (
                  <label key={k} className="block text-sm">
                    <span className="mb-1 block font-medium">{fieldLabels[k] ?? k}</span>
                    {k === "body" ? (
                      <textarea value={v} onChange={(e) => update(k, e.target.value)} rows={4} className="w-full rounded-md border bg-background p-2" />
                    ) : (
                      <input value={v} onChange={(e) => update(k, e.target.value)} className="w-full rounded-md border bg-background p-2" />
                    )}
                  </label>
                ))}
              </div>
              <button onClick={() => { setSite({ ...site, blocks: site.blocks.filter((b) => b.id !== sel.id) }); setSelected(null); }}
                className="mt-6 w-full rounded-md bg-destructive px-3 py-2 text-sm font-semibold text-destructive-foreground">Remover bloco</button>
            </>
          ) : (
            <p className="text-sm text-muted-foreground">Clique em um bloco do site para editar os textos.</p>
          )}
        </aside>
      </div>
    </div>
  );
}
