// Edite este arquivo para atualizar o conteúdo do portfolio.
// Imagens: coloque em assets/images/... e vídeos em assets/videos/...

const PERFIL = {
  apelido: "VenomBrt",
  titulo: "Fundador do Recreate Studios",
  foto: "assets/images/perfil/foto.jpg",
  fotoReserva: "https://github.com/VenomBrt.png",
  funcoes: [
    "Mods para Minecraft",
    "Plugins para servidores",
    "Launchers personalizados",
    "Sites e aplicações web",
  ],
  sobre: [
    "Sou o VenomBrt, desenvolvedor full-stack e fundador do Recreate Studios. Há mais de 5 anos crio experiências para Minecraft: mods, plugins, modpacks, launchers e servidores.",
    "Também desenvolvo sites e aplicações web, sempre buscando unir performance, visual caprichado e uma boa experiência para quem usa.",
  ],
  estatisticas: [
    { valor: 5, sufixo: "+", rotulo: "anos de experiência" },
    { valor: 4, sufixo: "", rotulo: "plataformas de mod" },
    { valor: 8, sufixo: "+", rotulo: "tecnologias" },
  ],
  github: "https://github.com/VenomBrt",
  discordUsuario: "venom.brt",
  discordServidor: "https://discord.gg/JjGG2USvF",
};

const HABILIDADES = [
  {
    grupo: "Minecraft",
    itens: ["Forge", "NeoForge", "Fabric", "Spigot / Paper", "Modpacks", "Servidores"],
  },
  {
    grupo: "Linguagens",
    itens: ["Java", "JavaScript", "TypeScript", "Python", "HTML / CSS", "C# (aprendendo)"],
  },
  {
    grupo: "Ferramentas",
    itens: ["Node.js", "Electron", "Git / GitHub"],
  },
];

// categoria: "mod" | "plugin" | "launcher" | "site"
const PROJETOS = [
  {
    nome: "Recreate Launcher",
    categoria: "launcher",
    descricao: "Launcher próprio do Recreate Studios com sistema de releases e atualização automática.",
    tecnologias: ["Electron", "JavaScript", "Node.js"],
    imagem: "",
    video: "",
    links: [{ rotulo: "GitHub", url: "https://github.com/VenomBrt/recreate-launcher" }],
  },
  {
    nome: "Recreate Essencial",
    categoria: "mod",
    descricao: "Mod essencial do ecossistema Recreate, com conteúdo sincronizado entre os jogadores.",
    tecnologias: ["Java", "Minecraft"],
    imagem: "",
    video: "",
    links: [],
  },
];

// tipo: "imagem" | "video" | "youtube" (para youtube, use o ID do vídeo em "src")
const GALERIA = [];
