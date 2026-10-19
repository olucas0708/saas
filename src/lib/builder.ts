export type BlockType = "header" | "hero" | "features" | "text" | "image" | "cta" | "footer";

type Known = "title" | "subtitle" | "button" | "link" | "body" | "url" | "caption" | "f1" | "f2" | "f3" | "brand" | "nav";
export type Block = {
  id: string;
  type: BlockType;
  props: { [k: string]: string } & Partial<Record<Known, string>>;
};

export type SiteTheme = { mode: "claro" | "escuro"; accent: string; font: string };
export type SiteSeo = { title: string; description: string };
export type SiteData = { theme: SiteTheme; seo: SiteSeo; blocks: Block[] };

export const fonts = ["Manrope", "Sora", "Playfair Display", "Space Grotesk", "DM Serif Display"];

export const blockLabels: Record<BlockType, string> = {
  header: "Cabeçalho",
  hero: "Capa",
  features: "Benefícios",
  text: "Texto",
  image: "Imagem",
  cta: "Chamada para ação",
  footer: "Rodapé",
};

export const fieldLabels: Record<string, string> = {
  title: "Título", subtitle: "Subtítulo", button: "Texto do botão", link: "Link do botão",
  body: "Texto", url: "Endereço da imagem", caption: "Legenda", brand: "Nome da marca",
  nav: "Menu (separado por vírgula)", f1: "Item 1", f2: "Item 2", f3: "Item 3",
};

export const blockDefaults: Record<BlockType, Record<string, string>> = {
  header: { brand: "Minha Marca", nav: "Início, Serviços, Contato" },
  hero: { title: "Seu título incrível", subtitle: "Uma frase curta que explica o que você faz.", button: "Começar", link: "#contato" },
  features: { title: "Por que nos escolher", f1: "Rápido", f2: "Confiável", f3: "Acessível" },
  text: { title: "Sobre nós", body: "Conte sua história aqui. Fale sobre sua missão e o que te torna único." },
  image: { url: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200", caption: "Nosso espaço" },
  cta: { title: "Pronto para começar?", button: "Fale conosco", link: "#" },
  footer: { body: "© 2026 Minha Empresa. Todos os direitos reservados." },
};

export const uid = () => Math.random().toString(36).slice(2, 10);
export const makeBlock = (type: BlockType, props?: Record<string, string>): Block => ({
  id: uid(), type, props: { ...blockDefaults[type], ...props },
});

export type Niche = { id: string; name: string; description: string; build: (name: string) => SiteData };

const site = (name: string, theme: Partial<SiteTheme>, blocks: Block[], description: string): SiteData => ({
  theme: { mode: "claro", accent: "#7c3aed", font: "Manrope", ...theme },
  seo: { title: name, description },
  blocks,
});

export const niches: Niche[] = [
  { id: "branco", name: "Em branco", description: "Comece do zero", build: (n) => site(n, {}, [], "") },
  {
    id: "barbearia", name: "Barbearia", description: "Agenda, serviços e localização",
    build: (n) => site(n, { mode: "escuro", accent: "#d4a24c", font: "Space Grotesk" }, [
      makeBlock("header", { brand: n, nav: "Serviços, Equipe, Agendar" }),
      makeBlock("hero", { title: "Corte com estilo, sem espera", subtitle: "Barbeiros experientes e horário marcado pelo WhatsApp.", button: "Agendar horário" }),
      makeBlock("features", { title: "Serviços", f1: "Corte masculino", f2: "Barba completa", f3: "Corte + barba" }),
      makeBlock("image", { url: "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=1200", caption: "Nosso ambiente" }),
      makeBlock("cta", { title: "Reserve seu horário hoje", button: "Chamar no WhatsApp" }),
      makeBlock("footer", { body: `© 2026 ${n}` }),
    ], "Barbearia com horário marcado."),
  },
  {
    id: "assistencia", name: "Assistência técnica", description: "Conserto de celulares e computadores",
    build: (n) => site(n, { accent: "#2563eb", font: "Sora" }, [
      makeBlock("header", { brand: n, nav: "Serviços, Como funciona, Contato" }),
      makeBlock("hero", { title: "Seu aparelho consertado com garantia", subtitle: "Orçamento rápido para celulares, notebooks e tablets.", button: "Pedir orçamento" }),
      makeBlock("features", { title: "O que consertamos", f1: "Troca de tela", f2: "Bateria", f3: "Placa e software" }),
      makeBlock("text", { title: "Como funciona", body: "Você traz o aparelho, avaliamos sem compromisso e só começamos o conserto após sua aprovação." }),
      makeBlock("cta", { title: "Fale com um técnico agora", button: "Enviar mensagem" }),
      makeBlock("footer", { body: `© 2026 ${n}` }),
    ], "Assistência técnica com garantia."),
  },
  {
    id: "restaurante", name: "Restaurante", description: "Cardápio, ambiente e reservas",
    build: (n) => site(n, { accent: "#c2410c", font: "Playfair Display" }, [
      makeBlock("header", { brand: n, nav: "Cardápio, Ambiente, Reservas" }),
      makeBlock("hero", { title: "Comida feita com afeto", subtitle: "Ingredientes frescos e receitas da casa, todos os dias.", button: "Ver cardápio" }),
      makeBlock("image", { url: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200", caption: "Nosso salão" }),
      makeBlock("features", { title: "Destaques", f1: "Almoço executivo", f2: "Jantar à la carte", f3: "Sobremesas artesanais" }),
      makeBlock("cta", { title: "Reserve sua mesa", button: "Fazer reserva" }),
      makeBlock("footer", { body: `© 2026 ${n}` }),
    ], "Restaurante com reservas online."),
  },
  {
    id: "imobiliaria", name: "Imobiliária", description: "Imóveis em destaque e contato",
    build: (n) => site(n, { accent: "#0f766e", font: "Manrope" }, [
      makeBlock("header", { brand: n, nav: "Comprar, Alugar, Contato" }),
      makeBlock("hero", { title: "Encontre o imóvel certo para você", subtitle: "Casas e apartamentos selecionados na sua região.", button: "Ver imóveis" }),
      makeBlock("image", { url: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200", caption: "Destaque da semana" }),
      makeBlock("features", { title: "Por que nós", f1: "Corretores certificados", f2: "Documentação segura", f3: "Atendimento personalizado" }),
      makeBlock("cta", { title: "Agende uma visita", button: "Falar com corretor" }),
      makeBlock("footer", { body: `© 2026 ${n}` }),
    ], "Imobiliária com imóveis selecionados."),
  },
  {
    id: "portfolio", name: "Portfólio", description: "Mostre seu trabalho",
    build: (n) => site(n, { mode: "escuro", accent: "#a78bfa", font: "DM Serif Display" }, [
      makeBlock("header", { brand: n, nav: "Trabalhos, Sobre, Contato" }),
      makeBlock("hero", { title: `${n}`, subtitle: "Design, fotografia e direção criativa.", button: "Ver trabalhos" }),
      makeBlock("image", { url: "https://images.unsplash.com/photo-1452587925148-ce544e77e70d?w=1200", caption: "Projeto recente" }),
      makeBlock("text", { title: "Sobre mim", body: "Crio projetos visuais com foco em clareza e emoção." }),
      makeBlock("cta", { title: "Vamos trabalhar juntos?", button: "Entrar em contato" }),
      makeBlock("footer", { body: `© 2026 ${n}` }),
    ], "Portfólio profissional."),
  },
];

export type Issue = { level: "erro" | "aviso"; message: string };

/** Deterministic quality checks — work without any AI integration. */
export function validateSite(d: SiteData): Issue[] {
  const out: Issue[] = [];
  if (!d.blocks.length) out.push({ level: "erro", message: "O site não tem nenhuma seção." });
  if (!d.seo.title.trim()) out.push({ level: "aviso", message: "Defina um título para buscadores (SEO)." });
  if (d.seo.description.trim().length < 50) out.push({ level: "aviso", message: "A descrição para buscadores deve ter pelo menos 50 caracteres." });
  if (!d.blocks.some((b) => b.type === "hero")) out.push({ level: "aviso", message: "Adicione uma Capa para apresentar o site." });
  if (!d.blocks.some((b) => b.type === "cta")) out.push({ level: "aviso", message: "Adicione uma Chamada para ação para gerar contatos." });
  d.blocks.forEach((b) => {
    if (b.type === "image" && !b.props.caption?.trim()) out.push({ level: "aviso", message: "Uma imagem está sem legenda (importante para acessibilidade)." });
    if (b.props.title !== undefined && !b.props.title.trim()) out.push({ level: "erro", message: `Um bloco "${blockLabels[b.type]}" está sem título.` });
  });
  return out;
}

export function normalizeSite(raw: unknown, fallbackName: string): SiteData {
  const r = (raw ?? {}) as Partial<SiteData>;
  return {
    theme: { mode: "claro", accent: "#7c3aed", font: "Manrope", ...(r.theme ?? {}) },
    seo: { title: fallbackName, description: "", ...(r.seo ?? {}) },
    blocks: Array.isArray(r.blocks) ? r.blocks : [],
  };
}
