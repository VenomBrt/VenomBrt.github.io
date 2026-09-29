const GLIFOS = "#%&@$!?/\\<>[]{}=+*^~01█▓▒░";
const aleatorio = (min, max) => Math.random() * (max - min) + min;
const glifoAleatorio = () => GLIFOS[Math.floor(Math.random() * GLIFOS.length)];
const CORES_GLITCH = ["var(--magenta)", "var(--ciano)", "#ffffff"];

class Glitch {
  constructor(el, { camadas = true } = {}) {
    this.el = el;
    this.texto = el.dataset.text || el.textContent.trim();
    this.ativo = false;

    el.classList.add("gx");
    el.setAttribute("aria-label", this.texto);
    el.innerHTML = "";

    this.base = document.createElement("span");
    this.base.className = "gx-base";
    this.base.setAttribute("aria-hidden", "true");
    this.letras = [...this.texto].map((caractere) => {
      const letra = document.createElement("span");
      letra.className = caractere === " " ? "gx-letra gx-espaco" : "gx-letra";
      letra.textContent = caractere;
      this.base.appendChild(letra);
      return letra;
    });
    this.letrasVisiveis = this.letras.filter((l) => !l.classList.contains("gx-espaco"));
    el.appendChild(this.base);

    this.camadas = camadas
      ? ["gx-c1", "gx-c2", "gx-c3"].map((classe) => {
          const camada = document.createElement("span");
          camada.className = `gx-camada ${classe}`;
          camada.setAttribute("aria-hidden", "true");
          camada.textContent = this.texto;
          el.appendChild(camada);
          return camada;
        })
      : [];
  }

  trocar(letra, glifo) {
    letra.dataset.glifo = glifo;
    letra.classList.add("gx-trocada");
  }

  restaurar(letra) {
    letra.classList.remove("gx-trocada", "gx-deslocada", "gx-oculta");
    letra.style.removeProperty("--dx");
    letra.style.removeProperty("--dy");
    letra.style.removeProperty("--cor");
  }

  restaurarTudo() {
    this.letras.forEach((l) => this.restaurar(l));
    this.camadas.forEach((c) => (c.style.opacity = 0));
    this.el.style.setProperty("--jx", "0px");
    this.el.style.setProperty("--sk", "0deg");
  }

  esconder() {
    this.letrasVisiveis.forEach((l) => l.classList.add("gx-oculta"));
  }

  fatiar(intensidade = 1) {
    this.camadas.forEach((camada) => {
      if (Math.random() < 0.35) {
        camada.style.opacity = 0;
        return;
      }
      const topo = aleatorio(0, 85);
      const altura = aleatorio(4, 22 + 10 * intensidade);
      camada.style.clipPath = `inset(${topo}% 0 ${Math.max(0, 100 - topo - altura)}% 0)`;
      camada.style.transform = `translateX(${aleatorio(-16, 16) * intensidade}px)`;
      camada.style.opacity = 1;
    });
  }

  corromperLetras(intensidade = 1) {
    const quantidade = Math.max(1, Math.round(aleatorio(1, 2.5) * intensidade));
    for (let i = 0; i < quantidade; i++) {
      const letra = this.letrasVisiveis[Math.floor(Math.random() * this.letrasVisiveis.length)];
      letra.style.setProperty("--dx", `${aleatorio(-10, 10) * intensidade}px`);
      letra.style.setProperty("--dy", `${aleatorio(-4, 4) * intensidade}px`);
      letra.classList.add("gx-deslocada");
      if (Math.random() < 0.55) this.trocar(letra, glifoAleatorio());
      if (Math.random() < 0.6) letra.style.setProperty("--cor", CORES_GLITCH[Math.floor(Math.random() * CORES_GLITCH.length)]);
    }
  }

  surto(intensidade = 1, duracao = aleatorio(160, 420)) {
    if (this.ativo) return Promise.resolve();
    this.ativo = true;
    const fim = performance.now() + duracao * Math.min(intensidade, 2);

    return new Promise((resolve) => {
      const passo = () => {
        this.letras.forEach((l) => this.restaurar(l));
        this.corromperLetras(intensidade);
        this.fatiar(intensidade);
        this.el.style.setProperty("--jx", Math.random() < 0.4 ? `${aleatorio(-7, 7) * intensidade}px` : "0px");
        this.el.style.setProperty("--sk", Math.random() < 0.2 ? `${aleatorio(-12, 12)}deg` : "0deg");

        if (performance.now() < fim) {
          setTimeout(passo, aleatorio(35, 85));
        } else {
          this.restaurarTudo();
          this.ativo = false;
          resolve();
        }
      };
      passo();
    });
  }

  decodificar(duracao = 900) {
    this.ativo = true;
    const inicio = performance.now();
    const n = this.letrasVisiveis.length;
    const momentos = this.letrasVisiveis.map((_, i) => (i / n) * duracao * 0.65 + aleatorio(0, duracao * 0.35));

    return new Promise((resolve) => {
      const passo = () => {
        const decorrido = performance.now() - inicio;
        let pendentes = 0;
        this.letrasVisiveis.forEach((letra, i) => {
          if (decorrido < momentos[i]) {
            pendentes++;
            letra.classList.remove("gx-oculta");
            this.trocar(letra, glifoAleatorio());
            letra.style.setProperty("--cor", Math.random() < 0.5 ? "var(--roxo-claro)" : CORES_GLITCH[Math.floor(Math.random() * 2)]);
          } else {
            this.restaurar(letra);
          }
        });
        if (Math.random() < 0.35) this.fatiar(1.2);
        else this.camadas.forEach((c) => (c.style.opacity = 0));

        if (pendentes) {
          setTimeout(passo, 50);
        } else {
          this.restaurarTudo();
          this.ativo = false;
          resolve();
        }
      };
      passo();
    });
  }

  automatico(min = 1800, max = 5200, aoSurto) {
    clearTimeout(this.timer);
    const agendar = () => {
      this.timer = setTimeout(async () => {
        const forte = Math.random() < 0.2;
        aoSurto?.(forte);
        await this.surto(forte ? 1.8 : 1);
        if (Math.random() < 0.3) {
          await new Promise((r) => setTimeout(r, aleatorio(60, 160)));
          await this.surto(0.7, aleatorio(80, 160));
        }
        agendar();
      }, aleatorio(min, max));
    };
    agendar();
  }
}
