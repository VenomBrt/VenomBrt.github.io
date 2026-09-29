const $ = (sel, raiz = document) => raiz.querySelector(sel);
const $$ = (sel, raiz = document) => [...raiz.querySelectorAll(sel)];

const escapar = (texto = "") =>
  String(texto).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

const NOMES_CATEGORIA = { mod: "Mod", plugin: "Plugin", launcher: "Launcher", site: "Site" };

/* ---------- Fundo com partículas ---------- */
function iniciarFundo() {
  const canvas = $("#fundo");
  const ctx = canvas.getContext("2d");
  let particulas = [];
  let largura, altura;
  const mouse = { x: -9999, y: -9999 };

  function redimensionar() {
    largura = canvas.width = window.innerWidth;
    altura = canvas.height = window.innerHeight;
    const quantidade = Math.min(90, Math.floor((largura * altura) / 16000));
    particulas = Array.from({ length: quantidade }, () => ({
      x: Math.random() * largura,
      y: Math.random() * altura,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      r: Math.random() * 1.8 + 0.6,
    }));
  }

  function desenhar() {
    ctx.clearRect(0, 0, largura, altura);
    for (const p of particulas) {
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0 || p.x > largura) p.vx *= -1;
      if (p.y < 0 || p.y > altura) p.vy *= -1;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(192, 132, 252, 0.8)";
      ctx.fill();
    }

    for (let i = 0; i < particulas.length; i++) {
      for (let j = i + 1; j < particulas.length; j++) {
        const a = particulas[i];
        const b = particulas[j];
        const dist = Math.hypot(a.x - b.x, a.y - b.y);
        if (dist < 130) {
          ctx.strokeStyle = `rgba(168, 85, 247, ${0.18 * (1 - dist / 130)})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }
      const p = particulas[i];
      const distMouse = Math.hypot(p.x - mouse.x, p.y - mouse.y);
      if (distMouse < 180) {
        ctx.strokeStyle = `rgba(255, 43, 214, ${0.35 * (1 - distMouse / 180)})`;
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(mouse.x, mouse.y);
        ctx.stroke();
      }
    }
    requestAnimationFrame(desenhar);
  }

  window.addEventListener("resize", redimensionar);
  window.addEventListener("mousemove", (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });
  redimensionar();
  if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) desenhar();
}

/* ---------- Texto digitando ---------- */
function iniciarDigitacao() {
  const alvo = $("#digitando");
  const frases = PERFIL.funcoes;
  let frase = 0;
  let letra = 0;
  let apagando = false;

  function passo() {
    const atual = frases[frase];
    letra += apagando ? -1 : 1;
    alvo.textContent = atual.slice(0, letra);

    let espera = apagando ? 35 : 70;
    if (!apagando && letra === atual.length) {
      espera = 1800;
      apagando = true;
    } else if (apagando && letra === 0) {
      apagando = false;
      frase = (frase + 1) % frases.length;
      espera = 400;
    }
    setTimeout(passo, espera);
  }
  passo();
}

/* ---------- Conteúdo ---------- */
function renderizarPerfil() {
  $("#hero-titulo").textContent = PERFIL.titulo;

  const foto = $("#foto-perfil");
  foto.onerror = () => {
    foto.onerror = null;
    foto.src = PERFIL.fotoReserva;
  };
  foto.src = PERFIL.foto;

  $("#sobre-texto").innerHTML = PERFIL.sobre.map((p) => `<p>${escapar(p)}</p>`).join("");

  $("#stats").innerHTML = PERFIL.estatisticas
    .map(
      (s) => `
      <div class="stat">
        <div class="stat-valor" data-valor="${s.valor}" data-sufixo="${escapar(s.sufixo)}">0</div>
        <div class="stat-rotulo">${escapar(s.rotulo)}</div>
      </div>`
    )
    .join("");

  $("#discord-usuario").textContent = PERFIL.discordUsuario;
  $("#link-servidor").href = PERFIL.discordServidor;
  $("#link-github").href = PERFIL.github;
  $("#ano").textContent = new Date().getFullYear();
}

function renderizarHabilidades() {
  $("#skills").innerHTML = HABILIDADES.map(
    (g) => `
    <div class="skill-card revelar">
      <h3>${escapar(g.grupo)}</h3>
      <div class="tags">${g.itens.map((i) => `<span class="tag">${escapar(i)}</span>`).join("")}</div>
    </div>`
  ).join("");
}

function midiaProjeto(p) {
  const categoria = `<span class="projeto-categoria">${NOMES_CATEGORIA[p.categoria] || escapar(p.categoria)}</span>`;
  if (p.video) {
    const ehYoutube = !p.video.includes("/") && !p.video.includes(".");
    const capa = p.imagem
      ? `<img src="${escapar(p.imagem)}" alt="${escapar(p.nome)}" loading="lazy" />`
      : ehYoutube
      ? `<img src="https://img.youtube.com/vi/${escapar(p.video)}/hqdefault.jpg" alt="${escapar(p.nome)}" loading="lazy" />`
      : `<video src="${escapar(p.video)}" muted loop playsinline preload="metadata"></video>`;
    const tipo = ehYoutube ? "youtube" : "video";
    return `<div class="projeto-midia" data-tipo="${tipo}" data-src="${escapar(p.video)}">${capa}<span class="projeto-play"></span>${categoria}</div>`;
  }
  if (p.imagem) {
    return `<div class="projeto-midia" data-tipo="imagem" data-src="${escapar(p.imagem)}"><img src="${escapar(p.imagem)}" alt="${escapar(p.nome)}" loading="lazy" />${categoria}</div>`;
  }
  return `<div class="projeto-midia"><div class="projeto-placeholder">${escapar(p.nome.split(" ")[0].toUpperCase())}</div>${categoria}</div>`;
}

function renderizarProjetos() {
  $("#lista-projetos").innerHTML = PROJETOS.map(
    (p) => `
    <article class="projeto revelar" data-categoria="${escapar(p.categoria)}">
      ${midiaProjeto(p)}
      <div class="projeto-corpo">
        <h3>${escapar(p.nome)}</h3>
        <p>${escapar(p.descricao)}</p>
        <div class="tags">${p.tecnologias.map((t) => `<span class="tag">${escapar(t)}</span>`).join("")}</div>
        ${
          p.links.length
            ? `<div class="projeto-links">${p.links
                .map((l) => `<a href="${escapar(l.url)}" target="_blank" rel="noopener">${escapar(l.rotulo)} ↗</a>`)
                .join("")}</div>`
            : ""
        }
      </div>
    </article>`
  ).join("");

  const categoriasUsadas = new Set(PROJETOS.map((p) => p.categoria));
  $$(".filtro").forEach((botao) => {
    const filtro = botao.dataset.filtro;
    if (filtro !== "todos" && !categoriasUsadas.has(filtro)) botao.remove();
    botao.addEventListener("click", () => {
      $$(".filtro").forEach((b) => b.classList.toggle("ativo", b === botao));
      $$(".projeto").forEach((card) => {
        card.classList.toggle("escondido", filtro !== "todos" && card.dataset.categoria !== filtro);
      });
    });
  });
}

function renderizarGaleria() {
  const lista = $("#lista-galeria");
  if (!GALERIA.length) {
    lista.innerHTML = `<div class="galeria-vazia mono">// em breve: imagens e vídeos dos projetos</div>`;
    return;
  }
  lista.innerHTML = GALERIA.map((item) => {
    const legenda = item.legenda ? `<div class="galeria-legenda">${escapar(item.legenda)}</div>` : "";
    let midia;
    if (item.tipo === "youtube") {
      midia = `<img src="https://img.youtube.com/vi/${escapar(item.src)}/hqdefault.jpg" alt="${escapar(item.legenda || "")}" loading="lazy" /><span class="projeto-play"></span>`;
    } else if (item.tipo === "video") {
      midia = `<video src="${escapar(item.src)}" muted loop playsinline preload="metadata"></video><span class="projeto-play"></span>`;
    } else {
      midia = `<img src="${escapar(item.src)}" alt="${escapar(item.legenda || "")}" loading="lazy" />`;
    }
    return `<div class="galeria-item revelar" data-tipo="${escapar(item.tipo)}" data-src="${escapar(item.src)}">${midia}${legenda}</div>`;
  }).join("");
}

/* ---------- Lightbox ---------- */
function iniciarLightbox() {
  const lightbox = $("#lightbox");
  const conteudo = $("#lightbox-conteudo");

  const fechar = () => {
    lightbox.classList.remove("aberto");
    conteudo.innerHTML = "";
  };

  document.addEventListener("click", (e) => {
    const alvo = e.target.closest("[data-tipo][data-src]");
    if (!alvo) return;
    const { tipo, src } = alvo.dataset;
    if (tipo === "youtube") {
      conteudo.innerHTML = `<iframe src="https://www.youtube.com/embed/${escapar(src)}?autoplay=1" allow="autoplay; encrypted-media; fullscreen" allowfullscreen></iframe>`;
    } else if (tipo === "video") {
      conteudo.innerHTML = `<video src="${escapar(src)}" controls autoplay playsinline></video>`;
    } else {
      conteudo.innerHTML = `<img src="${escapar(src)}" alt="" />`;
    }
    lightbox.classList.add("aberto");
  });

  lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox || e.target.classList.contains("lightbox-fechar")) fechar();
  });
  document.addEventListener("keydown", (e) => e.key === "Escape" && fechar());

  document.addEventListener("mouseover", (e) => {
    const video = e.target.closest(".projeto-midia video, .galeria-item video");
    if (video) video.play().catch(() => {});
  });
  document.addEventListener("mouseout", (e) => {
    const video = e.target.closest(".projeto-midia video, .galeria-item video");
    if (video) video.pause();
  });
}

/* ---------- Interações ---------- */
function iniciarNavegacao() {
  const nav = $(".nav");
  const links = $$(".nav-links a");

  window.addEventListener("scroll", () => nav.classList.toggle("rolado", window.scrollY > 40));

  $(".nav-toggle").addEventListener("click", () => nav.classList.toggle("menu-aberto"));
  links.forEach((l) => l.addEventListener("click", () => nav.classList.remove("menu-aberto")));

  const observador = new IntersectionObserver(
    (entradas) => {
      entradas.forEach((entrada) => {
        if (entrada.isIntersecting) {
          links.forEach((l) => l.classList.toggle("ativo", l.getAttribute("href") === `#${entrada.target.id}`));
        }
      });
    },
    { rootMargin: "-45% 0px -50% 0px" }
  );
  $$("section[id]").forEach((s) => observador.observe(s));
}

function animarContador(el) {
  const final = Number(el.dataset.valor);
  const sufixo = el.dataset.sufixo || "";
  const inicio = performance.now();
  const duracao = 1400;
  function quadro(agora) {
    const progresso = Math.min((agora - inicio) / duracao, 1);
    el.textContent = Math.round(final * (1 - Math.pow(1 - progresso, 3))) + sufixo;
    if (progresso < 1) requestAnimationFrame(quadro);
  }
  requestAnimationFrame(quadro);
}

function iniciarRevelacao() {
  const observador = new IntersectionObserver(
    (entradas) => {
      entradas.forEach((entrada) => {
        if (!entrada.isIntersecting) return;
        entrada.target.classList.add("visivel");
        $$(".stat-valor", entrada.target).forEach(animarContador);
        observador.unobserve(entrada.target);
      });
    },
    { threshold: 0.15 }
  );
  $$(".revelar").forEach((el) => observador.observe(el));

  const titulos = new IntersectionObserver((entradas) => {
    entradas.forEach((entrada) => {
      if (!entrada.isIntersecting) return;
      entrada.target.classList.add("glitchando");
      setTimeout(() => entrada.target.classList.remove("glitchando"), 600);
    });
  });
  $$(".titulo-secao").forEach((t) => titulos.observe(t));
}

function iniciarDiscord() {
  $("#copiar-discord").addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(PERFIL.discordUsuario);
      mostrarToast(`"${PERFIL.discordUsuario}" copiado!`);
    } catch {
      mostrarToast(`Discord: ${PERFIL.discordUsuario}`);
    }
  });
}

function mostrarToast(mensagem) {
  const toast = $("#toast");
  toast.textContent = mensagem;
  toast.classList.add("mostrar");
  clearTimeout(mostrarToast.timer);
  mostrarToast.timer = setTimeout(() => toast.classList.remove("mostrar"), 2200);
}

renderizarPerfil();
renderizarHabilidades();
renderizarProjetos();
renderizarGaleria();
iniciarFundo();
iniciarDigitacao();
iniciarLightbox();
iniciarNavegacao();
iniciarRevelacao();
iniciarDiscord();
