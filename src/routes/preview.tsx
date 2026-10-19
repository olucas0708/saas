import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { BlockView, SiteFrame } from "@/components/builder/BlockView";
import type { SiteData } from "@/lib/builder";

type SavedSite = SiteData & { name: string };
const STORAGE_KEY = "nextage-site-v1";

export const Route = createFileRoute("/preview")({
  head: () => ({ meta: [{ title: "Prévia do site — nextage.ai" }, { name: "description", content: "Confira seu site antes de publicar." }] }),
  component: Preview,
});

function Preview() {
  const [site, setSite] = useState<SavedSite | null>(null);
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setSite(JSON.parse(raw) as SavedSite);
    } catch {
      setSite(null);
    }
  }, []);

  if (!site) return <main className="mx-auto max-w-xl p-8 text-center"><h1 className="text-2xl font-bold">Nenhum rascunho encontrado</h1><p className="mt-2 text-muted-foreground">Crie ou edite um site antes de abrir a prévia.</p><Link to="/editor" className="mt-5 inline-flex rounded-full bg-primary px-5 py-2 font-semibold text-primary-foreground">Abrir editor</Link></main>;

  return <main className="min-h-screen"><div className="flex flex-wrap items-center justify-between gap-3 bg-foreground px-4 py-3 text-sm text-background"><span>Prévia: {site.name}</span><div className="flex gap-4"><Link to="/editor" className="underline underline-offset-4">Voltar ao editor</Link><button onClick={() => window.print()} className="underline underline-offset-4">Salvar como PDF</button></div></div><SiteFrame theme={site.theme}>{site.blocks.map((block) => <BlockView key={block.id} block={block} />)}</SiteFrame></main>;
}
