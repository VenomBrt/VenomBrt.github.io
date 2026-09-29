const ARQUIVOS_SOM = {
  hit: ["hit-1.mp3", "hit-2.mp3", "hit-3.mp3"],
  textura: ["textura-1.mp3"],
  transicao: ["transicao-1.mp3", "transicao-2.mp3", "transicao-3.mp3", "transicao-4.mp3"],
  tick: ["tick.wav"],
  burst: ["burst.wav"],
};

class Som {
  constructor() {
    this.mudo = localStorage.getItem("som") === "off";
    this.buffers = {};
    this.ultimo = {};
    this.ctx = null;
    this.carregamento = null;
  }

  iniciar() {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC || this.ctx) return;
    this.ctx = new AC();

    const limitador = this.ctx.createDynamicsCompressor();
    limitador.threshold.value = -18;
    limitador.knee.value = 12;
    limitador.ratio.value = 8;
    limitador.attack.value = 0.003;
    limitador.release.value = 0.18;

    this.master = this.ctx.createGain();
    this.master.gain.value = 0.32;
    limitador.connect(this.master);
    this.master.connect(this.ctx.destination);
    this.bus = limitador;

    this.carregamento = Promise.all(
      Object.entries(ARQUIVOS_SOM).map(async ([tipo, arquivos]) => {
        this.buffers[tipo] = [];
        await Promise.all(
          arquivos.map(async (arquivo) => {
            try {
              const resposta = await fetch(`assets/sfx/${arquivo}`);
              const dados = await resposta.arrayBuffer();
              this.buffers[tipo].push(await this.ctx.decodeAudioData(dados));
            } catch {}
          })
        );
      })
    );

    const desbloquear = () => {
      if (this.ctx.state === "suspended") this.ctx.resume().catch(() => {});
    };
    ["pointerdown", "keydown", "touchstart"].forEach((evento) =>
      window.addEventListener(evento, desbloquear, { passive: true })
    );
  }

  podeTocar() {
    return this.ctx && !this.mudo && this.ctx.state === "running" && !document.hidden;
  }

  tocar(tipo, { volume = 1, corte = false, min = 0.1, max = 0.4, velocidade = 1, atraso = 0, intervalo = 40 } = {}) {
    if (!this.podeTocar()) return;
    const lista = this.buffers[tipo];
    if (!lista?.length) return;

    const agora = performance.now();
    if (agora - (this.ultimo[tipo] || 0) < intervalo) return;
    this.ultimo[tipo] = agora;

    const buffer = lista[Math.floor(Math.random() * lista.length)];
    const fonte = this.ctx.createBufferSource();
    fonte.buffer = buffer;
    fonte.playbackRate.value = velocidade;

    const ganho = this.ctx.createGain();
    const t0 = this.ctx.currentTime + atraso;
    let inicio = 0;
    let duracao = buffer.duration;
    if (corte && buffer.duration > min + 0.05) {
      duracao = Math.min(buffer.duration, aleatorio(min, Math.min(max, buffer.duration)));
      inicio = Math.random() * (buffer.duration - duracao);
    }

    ganho.gain.setValueAtTime(0.0001, t0);
    ganho.gain.linearRampToValueAtTime(volume, t0 + 0.01);
    ganho.gain.setValueAtTime(volume, t0 + duracao * 0.6);
    ganho.gain.linearRampToValueAtTime(0.0001, t0 + duracao / velocidade);

    fonte.connect(ganho);
    ganho.connect(this.bus);
    fonte.start(t0, inicio, duracao);
  }

  tick() {
    this.tocar("tick", { volume: 0.35, velocidade: aleatorio(0.9, 1.3), intervalo: 30 });
  }

  surto(forte = false) {
    this.tocar("hit", { volume: forte ? 0.7 : 0.45, corte: true, min: 0.12, max: forte ? 0.4 : 0.25, velocidade: aleatorio(0.92, 1.1) });
    if (forte) this.tocar("burst", { volume: 0.5, atraso: 0.04 });
  }

  ambiente(forte = false) {
    this.tocar("hit", { volume: forte ? 0.28 : 0.16, corte: true, min: 0.08, max: 0.2, velocidade: aleatorio(0.95, 1.2) });
  }

  decodificar(duracao = 900) {
    const s = duracao / 1000;
    this.tocar("textura", { volume: 0.4, corte: true, min: s * 0.6, max: s, velocidade: aleatorio(1, 1.15) });
  }

  transicao(forte = false) {
    this.tocar("transicao", { volume: forte ? 0.7 : 0.4, corte: !forte, min: 0.25, max: 0.5, velocidade: aleatorio(0.95, 1.1), intervalo: 110 });
    if (forte) this.tocar("hit", { volume: 0.4, corte: true, min: 0.1, max: 0.22, atraso: 0.05 });
  }

  alternar() {
    this.mudo = !this.mudo;
    localStorage.setItem("som", this.mudo ? "off" : "on");
    if (!this.mudo) {
      this.ctx?.resume().catch(() => {});
      setTimeout(() => this.surto(), 30);
    }
    return this.mudo;
  }
}

const som = new Som();
som.iniciar();
