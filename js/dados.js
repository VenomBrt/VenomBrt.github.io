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
    "Opa! Eu sou o VenomBrt, programador e fundador do Recreate Studios. Programo há uns 7 anos: crio mods e modpacks para Minecraft há 5 anos e plugins há 2, desde coisas simples até sistemas bem complexos.",
    "Hoje meu principal projeto é o Recreate, um servidor de megaverso que venho desenvolvendo junto com uma equipe.",
    "Também faço sites, ferramentas e automações. Se você tem uma ideia e não sabe como colocar em prática, pode me chamar: a gente vê junto a melhor forma de fazer.",
  ],
  estatisticas: [
    { valor: 7, sufixo: "", rotulo: "anos programando" },
    { valor: 5, sufixo: "", rotulo: "anos com mods e modpacks" },
    { valor: 2, sufixo: "", rotulo: "anos com plugins" },
    { valor: 16, sufixo: "+", rotulo: "doenças no sistema de medicina" },
  ],
  github: "https://github.com/VenomBrt",
  discordUsuario: "venom.brt",
  discordServidor: "https://discord.gg/JjGG2USvF",
};

const SERVICOS = [
  {
    titulo: "Plugins e mods",
    texto: "Do mais simples ao sistema bem complexo e personalizado para o seu projeto, em Paper, Spigot, Forge, NeoForge ou Fabric.",
  },
  {
    titulo: "Correção e otimização",
    texto: "Pego um sistema que já existe para corrigir bugs, melhorar, otimizar ou adicionar novas funções.",
  },
  {
    titulo: "Launchers personalizados",
    texto: "Launchers com a cara do seu servidor: login, skins, amigos e atualização automática.",
  },
  {
    titulo: "Sites",
    texto: "Sites completos do jeito que você quiser, da página do seu servidor a um portfolio como este.",
  },
  {
    titulo: "Sistemas e automações",
    texto: "Ferramentas, automações e outros projetos personalizados para o que você precisar.",
  },
];

const HABILIDADES = [
  {
    grupo: "Minecraft",
    itens: ["Forge", "NeoForge", "Fabric", "Spigot / Paper", "Modpacks", "Servidores"],
  },
  {
    grupo: "Linguagens",
    itens: ["Java", "JavaScript", "TypeScript", "Python", "Lua", "HTML / CSS", "C# (aprendendo)"],
  },
  {
    grupo: "Ferramentas",
    itens: ["Node.js", "Electron", "Git / GitHub"],
  },
];

// categoria: "mod" | "plugin" | "launcher" | "site"
// capa: imagem do card; video e imagens aparecem ao clicar no card
// pixelado: true para prints pequenos (inventário etc.), mantém os pixels nítidos
const PROJETOS = [
  {
    nome: "BetterLockCraft",
    categoria: "plugin",
    versao: "1.20.x – 1.21.x",
    descricao: "O sistema de cadeados mais completo para servidores de Minecraft. Tranque portas, baús e barris e veja o cadeado direto no bloco.",
    destaques: [
      "Cadeado visível em portas, baús e barris",
      "2 minigames de lockpick para arrombar fechaduras",
      "Lockpicks de 7 materiais, da madeira à netherite",
      "Menu completo de gerenciamento",
    ],
    tecnologias: ["Java", "Paper / Spigot"],
    capa: "assets/images/projetos/betterlockcraft-blocos.jpg",
    imagens: ["assets/images/projetos/betterlockcraft-blocos.jpg", "assets/images/projetos/betterlockcraft-lockpicks.png"],
    links: [],
  },
  {
    nome: "Sistema de Medicina",
    categoria: "plugin",
    versao: "Paper 1.20.1",
    descricao: "Plugin de medicina realista para servidores: jogadores podem ficar doentes, se ferir e precisam de tratamento.",
    destaques: [
      "Mais de 16 tipos de doenças",
      "Vários tipos de ferimentos",
      "Itens médicos: seringas, bandagens, remédios e mais",
    ],
    tecnologias: ["Java", "Paper 1.20.1"],
    capa: "assets/images/projetos/medicina-2.png",
    imagens: ["assets/images/projetos/medicina-1.png", "assets/images/projetos/medicina-2.png", "assets/images/projetos/medicina-3.png"],
    pixelado: true,
    links: [],
  },
  {
    nome: "Recreate Launcher",
    categoria: "launcher",
    versao: "",
    descricao: "Launcher próprio do Recreate Studios com login, troca de skin, lista de amigos, sistema de níveis e atualização automática.",
    destaques: [
      "Login com conta original ou pirata",
      "Editor de skin e lista de amigos online",
      "Nível e tempo de jogo do jogador",
      "Changelog e atualização automática",
    ],
    tecnologias: ["Electron", "JavaScript", "Node.js"],
    capa: "assets/images/projetos/recreate-launcher-capa.jpg",
    video: "assets/videos/recreate-launcher.mp4",
    imagens: [],
    links: [{ rotulo: "GitHub", url: "https://github.com/VenomBrt/recreate-launcher" }],
  },
  {
    nome: "Recreate Essencial",
    categoria: "mod",
    versao: "Forge 1.20.1",
    descricao: "Mod essencial do modpack Recreate, que cuida de toda a experiência de abertura, da tela de carregamento até o menu principal.",
    destaques: [
      "Tela de carregamento com efeito glitch",
      "Intro animada do Recreate Studios",
      "Atualizador automático do modpack",
      "Menu principal com player de música e fundos animados",
    ],
    tecnologias: ["Java", "Forge", "Minecraft"],
    capa: "assets/images/projetos/recreate-menu-capa.jpg",
    video: "assets/videos/recreate-menu.mp4",
    imagens: [],
    links: [],
  },
];

// tipo: "imagem" | "video" | "youtube" (para youtube, use o ID do vídeo em "src")
// capa: imagem mostrada na grade para vídeos
const GALERIA = [
  { tipo: "video", src: "assets/videos/recreate-menu.mp4", capa: "assets/images/projetos/recreate-menu-capa.jpg", legenda: "Recreate Essencial · menu" },
  { tipo: "imagem", src: "assets/images/projetos/betterlockcraft-blocos.jpg", legenda: "BetterLockCraft · cadeados nos blocos" },
  { tipo: "imagem", src: "assets/images/projetos/medicina-1.png", legenda: "Sistema de Medicina · itens", pixelado: true },
  { tipo: "video", src: "assets/videos/recreate-launcher.mp4", capa: "assets/images/projetos/recreate-launcher-capa.jpg", legenda: "Recreate Launcher" },
  { tipo: "imagem", src: "assets/images/projetos/betterlockcraft-lockpicks.png", legenda: "BetterLockCraft · lockpicks" },
  { tipo: "imagem", src: "assets/images/projetos/medicina-2.png", legenda: "Sistema de Medicina · remédios", pixelado: true },
  { tipo: "imagem", src: "assets/images/projetos/medicina-3.png", legenda: "Sistema de Medicina · seringas", pixelado: true },
];
