import { createFileRoute } from "@tanstack/react-router";
import { niches } from "@/lib/builder";
import { Logo } from "@/components/Logo";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "nextage.ai — From idea to income" },
      { name: "description", content: "Crie sites profissionais sem programar e gerencie seus clientes em um só lugar." },
      { property: "og:title", content: "nextage.ai — From idea to income" },
      { property: "og:description", content: "Crie sites profissionais sem programar." },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6"><Logo /></header>
      <section className="mx-auto max-w-4xl px-6 py-20 text-center">
        <h1 className="font-display text-5xl font-bold md:text-7xl">From idea to <span className="text-primary">income</span>.</h1>
        <p className="mx-auto mt-6 max-w-xl text-lg text-muted-foreground">Crie sites profissionais sem programar. Cadastro e editor estão em construção.</p>
      </section>
      <section className="mx-auto grid max-w-6xl gap-4 px-6 pb-24 sm:grid-cols-3">
        {niches.map((n) => (
          <div key={n.id} className="rounded-2xl border bg-card p-5">
            <p className="font-semibold">{n.name}</p>
            <p className="text-sm text-muted-foreground">{n.description}</p>
          </div>
        ))}
      </section>
    </div>
  );
}
