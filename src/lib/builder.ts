export type BlockType = "hero" | "features" | "text" | "image" | "cta" | "footer";

export type Block = {
  id: string;
  type: BlockType;
  props: { [k: string]: string } & Partial<Record<"title"|"subtitle"|"button"|"body"|"url"|"caption"|"f1"|"f2"|"f3", string>>;
};

export type Site = { name: string; theme: "claro" | "escuro"; blocks: Block[] };

export const blockLabels: Record<BlockType, string> = {
  hero: "Capa",
  features: "Benefícios",
  text: "Texto",
  image: "Imagem",
  cta: "Chamada",
  footer: "Rodapé",
};

export const fieldLabels: Record<string, string> = {
  title: "Título",
  subtitle: "Subtítulo",
  button: "Texto do botão",
  body: "Texto",
  url: "Link da imagem",
  caption: "Legenda",
  f1: "Benefício 1",
  f2: "Benefício 2",
  f3: "Benefício 3",
};

export const blockDefaults: Record<BlockType, Record<string, string>> = {
  hero: { title: "Seu título incrível", subtitle: "Uma frase curta que explica o que você faz.", button: "Começar" },
  features: { title: "Por que nos escolher", f1: "Rápido", f2: "Confiável", f3: "Acessível" },
  text: { title: "Sobre nós", body: "Conte sua história aqui. Fale sobre sua missão e o que te torna único." },
  image: { url: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200", caption: "Nosso espaço" },
  cta: { title: "Pronto para começar?", button: "Fale conosco" },
  footer: { body: "© 2026 Minha Empresa. Todos os direitos reservados." },
};

export const uid = () => Math.random().toString(36).slice(2, 10);
export const makeBlock = (type: BlockType, props?: Record<string, string>): Block => ({
  id: uid(),
  type,
  props: { ...blockDefaults[type], ...props },
});

export type Template = { id: string; name: string; description: string; build: () => Site };

export const templates: Template[] = [
  {
    id: "branco",
    name: "Em branco",
    description: "Comece do zero",
    build: () => ({ name: "Meu site", theme: "claro", blocks: [] }),
  },
  {
    id: "negocio",
    name: "Pequeno negócio",
    description: "Capa, benefícios, sobre e contato",
    build: () => ({
      name: "Padaria Pão Quente",
      theme: "claro",
      blocks: [
        makeBlock("hero", { title: "Pão fresquinho todo dia", subtitle: "Feito com carinho no seu bairro desde 1998.", button: "Ver cardápio" }),
        makeBlock("features", { title: "O que fazemos", f1: "Pães artesanais", f2: "Bolos sob encomenda", f3: "Café da manhã" }),
        makeBlock("image", { url: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=1200", caption: "Nossa vitrine" }),
        makeBlock("cta", { title: "Faça sua encomenda", button: "Chamar no WhatsApp" }),
        makeBlock("footer"),
      ],
    }),
  },
  {
    id: "portfolio",
    name: "Portfólio",
    description: "Mostre seu trabalho",
    build: () => ({
      name: "Ana Fotografia",
      theme: "escuro",
      blocks: [
        makeBlock("hero", { title: "Ana Lima — Fotógrafa", subtitle: "Casamentos, retratos e eventos.", button: "Ver trabalhos" }),
        makeBlock("image", { url: "https://images.unsplash.com/photo-1452587925148-ce544e77e70d?w=1200", caption: "Ensaio 2026" }),
        makeBlock("text", { title: "Sobre mim", body: "Fotografo histórias reais há 10 anos, com luz natural e muita sensibilidade." }),
        makeBlock("cta", { title: "Vamos criar juntos?", button: "Agendar conversa" }),
        makeBlock("footer", { body: "© 2026 Ana Lima Fotografia" }),
      ],
    }),
  },
  {
    id: "evento",
    name: "Evento",
    description: "Divulgue um lançamento",
    build: () => ({
      name: "Festival Verão",
      theme: "claro",
      blocks: [
        makeBlock("hero", { title: "Festival de Verão 2026", subtitle: "12 de dezembro · Praia Central", button: "Garantir ingresso" }),
        makeBlock("features", { title: "Atrações", f1: "Shows ao vivo", f2: "Food trucks", f3: "Área kids" }),
        makeBlock("cta", { title: "Ingressos limitados!", button: "Comprar agora" }),
        makeBlock("footer"),
      ],
    }),
  },
];

const KEY = "construtor-site";
export const saveSite = (s: Site) => localStorage.setItem(KEY, JSON.stringify(s));
export const loadSite = (): Site | null => {
  try {
    const v = localStorage.getItem(KEY);
    return v ? (JSON.parse(v) as Site) : null;
  } catch {
    return null;
  }
};
