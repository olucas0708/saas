import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { loadSite, type Site } from "@/lib/builder";
import { BlockView, SiteFrame } from "@/components/builder/BlockView";

export const Route = createFileRoute("/preview")({
  head: () => ({
    meta: [
      { title: "Prévia do site — Monta" },
      { name: "description", content: "Veja como seu site ficará para os visitantes." },
      { property: "og:title", content: "Prévia do site — Monta" },
      { property: "og:description", content: "Prévia do site criado no Monta." },
    ],
  }),
  component: Preview,
});

function Preview() {
  const [site, setSite] = useState<Site | null>(null);
  useEffect(() => setSite(loadSite()), []);
  if (!site) return <div className="p-10 text-center">Nenhum site ainda. <Link to="/" className="text-primary underline">Criar um</Link></div>;
  return (
    <div className="min-h-screen">
      <div className="flex items-center justify-between bg-foreground px-4 py-2 text-sm text-background">
        <span>Prévia: {site.name}</span>
        <Link to="/editor" className="underline">Voltar ao editor</Link>
      </div>
      <SiteFrame theme={site.theme}>{site.blocks.map((b) => <BlockView key={b.id} block={b} />)}</SiteFrame>
    </div>
  );
}
