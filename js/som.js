const ARQUIVOS_SOM = [
  { arquivo: "hit-1.mp3", tipo: "hit" },
  { arquivo: "hit-2.mp3", tipo: "hit" },
  { arquivo: "hit-3.mp3", tipo: "hit" },
  { arquivo: "texture-1.mp3", tipo: "texture" },
  { arquivo: "transition-1.mp3", tipo: "transition" },
  { arquivo: "transition-2.mp3", tipo: "transition" },
  { arquivo: "transition-3.mp3", tipo: "transition" },
  { arquivo: "transition-4.mp3", tipo: "transition" },
];

const VOLUME_MASTER = 0.38;

class Som {
  constructor() {
    this.mudo = localStorage.getItem("som") === "off";
    this.porTipo = { hit: [], transition: [], texture: [] };
    this.ativos = new Set();
    this.ultimo = {};
    this.ctx = null;
  }

  iniciar() {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC || this.ctx) return;
    this.ctx = new AC();

    this.master = this.ctx.createGain();
    this.master.gain.value = VOLUME_MASTER;

    const graves = this.ctx.createBiquadFilter();
    graves.type = "highpass";
    graves.frequency.value = 70;

    const presenca = this.ctx.createBiquadFilter();
    presenca.type = "highshelf";
    presenca.frequency.value = 2800;
    presenca.gain.value = 2.5;

    const brilho = this.ctx.createBiquadFilter();
    brilho.type = "peaking";
    brilho.frequency.value = 6500;
    brilho.Q.value = 0.7;
    brilho.gain.value = 1.8;

    const limitador = this.ctx.createDynamicsCompressor();
    limitador.threshold.value = -18;
    limitador.knee.value = 12;
    limitador.ratio.value = 8;
    limitador.attack.value = 0.003;
    limitador.release.value = 0.18;

    this.bus = this.ctx.createGain();
    this.bus.gain.value = 0.85;
    this.bus.connect(graves);
    graves.connect(presenca);
    presenca.connect(brilho);
    brilho.connect(limitador);
    limitador.connect(this.master);
    this.master.connect(this.ctx.destination);

    ARQUIVOS_SOM.forEach(async ({ arquivo, tipo }) => {
      try {
        const resposta = await fetch(`assets/sfx/${arquivo}`);
        this.porTipo[tipo].push(await this.ctx.decodeAudioData(await resposta.arrayBuffer()));
      } catch {}
    });

    const desbloquear = () => {
      if (this.ctx.state === "suspended") this.ctx.resume().catch(() => {});
    };
    ["pointerdown", "keydown", "touchstart"].forEach((evento) =>
      window.addEventListener(evento, desbloquear, { passive: true })
    );

    document.addEventListener("visibilitychange", () => {
      if (document.hidden) this.pararTudo();
    });
  }

  podeTocar() {
    return this.ctx && !this.mudo && this.ctx.state === "running" && !document.hidden;
  }

  pararTudo() {
    this.ativos.forEach((fonte) => {
      try { fonte.stop(); } catch {}
    });
    this.ativos.clear();
  }

  limitar(nome, ms) {
    const agora = performance.now();
    if (agora - (this.ultimo[nome] || 0) < ms) return false;
    this.ultimo[nome] = agora;
    return true;
  }

  tocar({ tipo, volume = 1, corte = false, min = 0.12, max = 0.45, velocidade = 1, atraso = 0 }) {
    if (!this.podeTocar()) return;
    const lista = this.porTipo[tipo]?.length ? this.porTipo[tipo] : Object.values(this.porTipo).flat();
    if (!lista.length) return;

    const buffer = lista[Math.floor(Math.random() * lista.length)];
    const fonte = this.ctx.createBufferSource();
    fonte.buffer = buffer;
    fonte.playbackRate.value = velocidade;

    const ganho = this.ctx.createGain();
    const pico = Math.max(0, Math.min(0.75, volume));
    const t0 = this.ctx.currentTime + atraso;
    let inicio = 0;
    let duracao = buffer.duration;
    if (corte && buffer.duration > min + 0.05) {
      duracao = Math.min(buffer.duration, aleatorio(min, Math.min(max, buffer.duration)));
      inicio = Math.random() * Math.max(0, buffer.duration - duracao);
    }
    const fim = t0 + (corte ? duracao : Math.min(buffer.duration, 0.8));

    ganho.gain.setValueAtTime(0.0001, t0);
    ganho.gain.linearRampToValueAtTime(pico, t0 + 0.012);
    ganho.gain.setValueAtTime(pico, t0 + Math.max(0.05, (corte ? min : 0.12) * 0.5));
    ganho.gain.linearRampToValueAtTime(0.0001, fim);

    fonte.connect(ganho);
    ganho.connect(this.bus);
    if (corte) fonte.start(t0, inicio, duracao);
    else fonte.start(t0);

    this.ativos.add(fonte);
    fonte.onended = () => this.ativos.delete(fonte);
  }

  camadas(tipoA, tipoB, volume = 0.65) {
    this.tocar({ tipo: tipoA, volume: volume * 0.7, corte: true, min: 0.15, max: 0.4, velocidade: aleatorio(0.92, 1.08) });
    if (tipoB) {
      this.tocar({ tipo: tipoB, volume: volume * 0.35, corte: true, min: 0.08, max: 0.22, velocidade: aleatorio(1.05, 1.25), atraso: aleatorio(0.03, 0.07) });
    }
  }

  tick() {
    if (!this.limitar("tick", 45)) return;
    this.tocar({ tipo: "hit", volume: 0.4, corte: true, min: 0.06, max: 0.14, velocidade: aleatorio(1.05, 1.35) });
  }

  ambiente() {
    this.tocar({ tipo: Math.random() > 0.5 ? "texture" : "hit", volume: 0.28, corte: true, min: 0.08, max: 0.18, velocidade: aleatorio(0.95, 1.2) });
  }

  burst(pesado = false) {
    if (!this.limitar("burst", 45)) return;
    this.camadas(pesado ? "hit" : Math.random() > 0.4 ? "hit" : "texture", pesado ? "texture" : null, pesado ? 0.7 : 0.55);
    if (pesado) {
      this.tocar({ tipo: "transition", volume: 0.32, corte: true, min: 0.12, max: 0.28, velocidade: aleatorio(1.1, 1.3), atraso: 0.05 });
    }
  }

  transicao() {
    if (!this.limitar("transicao", 110)) return;
    this.tocar({ tipo: "transition", volume: 0.65, corte: Math.random() > 0.3, min: 0.25, max: 0.55, velocidade: aleatorio(0.94, 1.12) });
    this.tocar({ tipo: "hit", volume: 0.36, corte: true, min: 0.1, max: 0.22, atraso: 0.05, velocidade: aleatorio(1, 1.2) });
  }

  etapa() {
    this.tocar({ tipo: "transition", volume: 0.62, corte: Math.random() > 0.35, min: 0.22, max: 0.5, velocidade: aleatorio(0.95, 1.1) });
    this.tocar({ tipo: "hit", volume: 0.38, corte: true, min: 0.1, max: 0.25, velocidade: aleatorio(1, 1.15), atraso: 0.04 });
    this.tocar({ tipo: "texture", volume: 0.22, corte: true, min: 0.08, max: 0.18, velocidade: aleatorio(1.1, 1.35), atraso: 0.07 });
  }

  final() {
    this.tocar({ tipo: "transition", volume: 0.68 });
    this.tocar({ tipo: "hit", volume: 0.42, corte: true, min: 0.15, max: 0.3, atraso: 0.06 });
    this.tocar({ tipo: "hit", volume: 0.28, corte: true, min: 0.08, max: 0.16, atraso: 0.16, velocidade: 1.15 });
  }

  alternar() {
    this.mudo = !this.mudo;
    localStorage.setItem("som", this.mudo ? "off" : "on");
    if (this.mudo) this.pararTudo();
    else {
      this.ctx?.resume().catch(() => {});
      setTimeout(() => this.burst(), 30);
    }
    return this.mudo;
  }
}

const som = new Som();
som.iniciar();
Glitch.som = som;
