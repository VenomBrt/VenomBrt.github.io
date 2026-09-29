const LINHAS_INTRO = [
  "RECREATE_OS v5.0 // inicializando sistema",
  "carregando módulos: forge · neoforge · fabric · spigot",
  "compilando plugins e launchers ........ OK",
  "conectando ao Servidor Recreate ....... OK",
  "descriptografando identidade...",
];

function rodarIntro() {
  const intro = document.getElementById("intro");
  const reduzido = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (!intro || reduzido) {
    intro?.remove();
    return Promise.resolve();
  }

  let jaViu = false;
  try {
    jaViu = sessionStorage.getItem("introVista") === "1";
    sessionStorage.setItem("introVista", "1");
  } catch {}

  intro.classList.add("preparando");
  return aguardarEntrada(intro)
    .then(() => som.pronto())
    .then(() => {
      intro.classList.remove("preparando");
      return jaViu ? introRapida(intro) : introCompleta(intro);
    });
}

function aguardarEntrada(intro) {
  if (!som.precisaDesbloquear()) return Promise.resolve();
  intro.classList.add("aguardando");
  const entrar = document.getElementById("intro-entrar");
  const semSom = document.getElementById("intro-sem-som");
  entrar.focus({ preventScroll: true });

  return new Promise((resolve) => {
    const concluir = async (comSom) => {
      entrar.disabled = semSom.disabled = true;
      if (comSom) await som.desbloquear();
      else som.silenciar();
      document.dispatchEvent(new Event("som-alterado"));
      intro.classList.remove("aguardando");
      resolve();
    };
    entrar.addEventListener("click", (e) => (e.stopPropagation(), concluir(true)), { once: true });
    semSom.addEventListener("click", (e) => (e.stopPropagation(), concluir(false)), { once: true });
  });
}

function introCompleta(intro) {
  let pulou = false;
  const pular = () => (pulou = true);
  intro.addEventListener("click", pular);
  window.addEventListener("keydown", pular, { once: true });

  const esperar = (ms) =>
    new Promise((resolve) => {
      if (pulou) return resolve();
      const inicio = performance.now();
      const checar = () => (pulou || performance.now() - inicio >= ms ? resolve() : requestAnimationFrame(checar));
      requestAnimationFrame(checar);
    });

  const terminal = document.getElementById("intro-terminal");
  const barra = document.getElementById("intro-progresso");
  const porcentagem = document.getElementById("intro-porcentagem");
  const logoEl = document.getElementById("intro-logo");
  const fatias = document.getElementById("intro-fatias");

  const TOTAL_FATIAS = 14;
  for (let i = 0; i < TOTAL_FATIAS; i++) {
    const fatia = document.createElement("span");
    fatia.style.top = `${(i / TOTAL_FATIAS) * 100}%`;
    fatia.style.height = `${100 / TOTAL_FATIAS + 0.5}%`;
    fatia.style.setProperty("--atraso", `${aleatorio(0, 220)}ms`);
    fatia.style.setProperty("--dir", `${i % 2 ? "" : "-"}${aleatorio(102, 120)}%`);
    fatias.appendChild(fatia);
  }

  const logo = new Glitch(logoEl);
  logo.esconder();

  async function sequencia() {
    for (const texto of LINHAS_INTRO) {
      const linha = document.createElement("p");
      linha.innerHTML = `<span class="prompt">&gt;</span> ${texto}`;
      terminal.appendChild(linha);
      som.tick();
      await esperar(aleatorio(110, 220));
    }

    const carregar = async () => {
      let progresso = 0;
      while (progresso < 100) {
        progresso = Math.min(100, progresso + aleatorio(3, 12));
        barra.style.width = `${progresso}%`;
        porcentagem.textContent = `${String(Math.floor(progresso)).padStart(3, "0")}%`;
        await esperar(aleatorio(45, 110));
      }
    };

    som.etapa();
    await Promise.all([carregar(), logo.decodificar(pulou ? 250 : 1300)]);
    await esperar(150);
    await logo.surto(2.2, 260);
    await esperar(120);

    som.final();
    intro.classList.add("saindo");
    await new Promise((r) => setTimeout(r, 750));
    intro.remove();
  }

  return sequencia();
}

async function introRapida(intro) {
  intro.classList.add("rapida");
  const logo = new Glitch(document.getElementById("intro-logo"));
  logo.esconder();
  await logo.decodificar(350);
  await logo.surto(2, 200);
  som.transicao();
  intro.classList.add("saindo");
  await new Promise((r) => setTimeout(r, 650));
  intro.remove();
}
