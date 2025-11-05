// js/video.js
// Player de vídeo com playlist, favoritos e controle de reprodução.
// Comentários em português para facilitar entendimento.

/* Estrutura de dados: edite os objetos 'VIDEOS' para trocar fontes/imagens/títulos.
   Cada item deve ter: id, title, src (caminho do video), thumb (miniatura), descricao, duracao (texto)
*/

document.addEventListener('DOMContentLoaded', () => {
  const STORAGE_FAVS = 'lingua_video_favs';
  const STORAGE_LAST = 'lingua_video_last';

  const VIDEOS = [
    {
      id: 'v1',
      title: 'Acentuação — Regras básicas',
      src: '../media/exemplo1.mp4',
      thumb: '../img/acentuacao.png',
      descricao: 'Regras fundamentais de acentuação com exemplos.',
      duracao: '08:34'
    },
    {
      id: 'v2',
      title: 'Acentuação: ditongos e hiatos',
      src: '../media/exemplo2.mp4',
      thumb: '../img/ditonfoshiatos.png',
      descricao: 'Quando usar acento em ditongos e hiatos.',
      duracao: '06:10'
    },
    {
      id: 'v3',
      title: 'Acentuação: casos especiais',
      src: 'https://youtu.be/YXcG4cLgxuw?si=0DGP__tudpjqNLq_',
      thumb: '../img/casosespeciais.png',
      descricao: 'Exceções e casos práticos.',
      duracao: '05:45'
    }
  ];

  // Elementos
  const player = document.getElementById('player');
  const btnPlay = document.getElementById('btnPlay');
  const btnRewind = document.getElementById('btnRewind');
  const btnForward = document.getElementById('btnForward');
  const progress = document.getElementById('progress');
  const timeCurrent = document.getElementById('timeCurrent');
  const timeTotal = document.getElementById('timeTotal');
  const volume = document.getElementById('volume');
  const btnFullscreen = document.getElementById('btnFullscreen');
  const playlistEl = document.getElementById('playlist');
  const videoTitulo = document.getElementById('videoTitulo');
  const videoDescricao = document.getElementById('videoDescricao');
  const btnPrev = document.getElementById('btnPrev');
  const btnNext = document.getElementById('btnNext');
  const btnLike = document.getElementById('btn-like');
  const notasEl = document.getElementById('notas');
  const btnSalvarNotas = document.getElementById('btnSalvarNotas');

  let currentIndex = 0;
  let isPlaying = false;
  let favs = JSON.parse(localStorage.getItem(STORAGE_FAVS) || '[]');

  /* ---------- Funções utilitárias ---------- */

  // Formata segundos para mm:ss
  function formatTime(sec) {
    if (isNaN(sec)) return '0:00';
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${m}:${String(s).padStart(2,'0')}`;
  }

  // Carrega o item atual no player e atualiza UI
  function loadVideo(index, play = false) {
    const item = VIDEOS[index];
    if (!item) return;

    // atualiza fonte
    player.pause();
    player.src = item.src;
    player.load();
    videoTitulo.textContent = item.title;
    videoDescricao.textContent = item.descricao;

    // marca playlist
    document.querySelectorAll('.playlist-item').forEach(el => el.classList.remove('active'));
    const activeEl = document.querySelector(`.playlist-item[data-id="${item.id}"]`);
    if (activeEl) activeEl.classList.add('active');

    // salva último assistido
    localStorage.setItem(STORAGE_LAST, JSON.stringify({ id: item.id, index }));

    // opcional: começar a reproduzir automaticamente
    if (play) {
      player.play().catch(()=>{});
    }
  }

  // Atualiza barra de progresso e tempos
  function syncProgress() {
    const dur = player.duration || 0;
    const cur = player.currentTime || 0;
    const pct = dur ? (cur / dur) * 100 : 0;
    progress.value = pct;
    timeCurrent.textContent = formatTime(cur);
    timeTotal.textContent = formatTime(dur);
  }

  // Toca/pausa
  function togglePlay() {
    if (player.paused) {
      player.play();
    } else {
      player.pause();
    }
  }

  // Marca/desmarca favorito
  function toggleFav() {
    const id = VIDEOS[currentIndex].id;
    const idx = favs.indexOf(id);
    if (idx === -1) favs.push(id);
    else favs.splice(idx, 1);
    localStorage.setItem(STORAGE_FAVS, JSON.stringify(favs));
    updateFavUI();
  }

  function updateFavUI() {
    const id = VIDEOS[currentIndex].id;
    btnLike.setAttribute('aria-pressed', favs.includes(id) ? 'true' : 'false');
    btnLike.style.color = favs.includes(id) ? 'var(--primary)' : 'inherit';
  }

  /* ---------- Inicialização da playlist no DOM ---------- */
  function renderPlaylist() {
    playlistEl.innerHTML = '';
    VIDEOS.forEach((v, i) => {
      const li = document.createElement('li');
      li.className = 'playlist-item';
      li.setAttribute('data-id', v.id);
      li.innerHTML = `
        <img src="${v.thumb}" alt="Thumb ${v.title}">
        <div class="meta">
          <h4>${v.title}</h4>
          <p>${v.descricao}</p>
        </div>
        <div class="duracao">${v.duracao}</div>
      `;
      li.addEventListener('click', () => {
        currentIndex = i;
        loadVideo(currentIndex, true);
      });
      playlistEl.appendChild(li);
    });

    // se havia último vídeo salvo, tenta restaurar
    const last = JSON.parse(localStorage.getItem(STORAGE_LAST) || 'null');
    if (last && typeof last.index === 'number' && VIDEOS[last.index]) {
      currentIndex = last.index;
    } else {
      currentIndex = 0;
    }
    loadVideo(currentIndex, false);
    updateFavUI();
  }

  /* ---------- Eventos do player ---------- */

  // play/pause visual
  player.addEventListener('play', () => {
    isPlaying = true;
    btnPlay.innerHTML = '<span class="material-symbols-outlined">pause</span>';
  });
  player.addEventListener('pause', () => {
    isPlaying = false;
    btnPlay.innerHTML = '<span class="material-symbols-outlined">play_arrow</span>';
  });

  // tempo carregado
  player.addEventListener('timeupdate', syncProgress);
  player.addEventListener('durationchange', syncProgress);

  // quando termina, avança para o próximo
  player.addEventListener('ended', () => {
    if (currentIndex < VIDEOS.length - 1) {
      currentIndex++;
      loadVideo(currentIndex, true);
    } else {
      // volta ao início
      player.currentTime = 0;
      player.pause();
    }
    updateFavUI();
  });

  // controles clicáveis
  btnPlay.addEventListener('click', togglePlay);
  btnRewind.addEventListener('click', () => { player.currentTime = Math.max(0, player.currentTime - 5); });
  btnForward.addEventListener('click', () => { player.currentTime = Math.min(player.duration || 0, player.currentTime + 10); });

  progress.addEventListener('input', (ev) => {
    const pct = Number(ev.target.value);
    const dur = player.duration || 0;
    player.currentTime = (pct / 100) * dur;
  });

  volume.addEventListener('input', (ev) => { player.volume = Number(ev.target.value); });

  btnFullscreen.addEventListener('click', () => {
    if (!document.fullscreenElement) {
      player.requestFullscreen?.();
    } else {
      document.exitFullscreen?.();
    }
  });

  // botões playlist next/prev
  btnPrev.addEventListener('click', () => {
    if (currentIndex > 0) {
      currentIndex--;
      loadVideo(currentIndex, true);
    }
  });
  btnNext.addEventListener('click', () => {
    if (currentIndex < VIDEOS.length - 1) {
      currentIndex++;
      loadVideo(currentIndex, true);
    }
  });

  // like / favorito
  btnLike.addEventListener('click', toggleFav);

  // salvar notas simples no localStorage (por vídeo)
  btnSalvarNotas.addEventListener('click', () => {
    const key = `nota_${VIDEOS[currentIndex].id}`;
    const texto = notasEl.value || '';
    localStorage.setItem(key, texto);
    btnSalvarNotas.textContent = 'Salvo ✓';
    setTimeout(()=> btnSalvarNotas.textContent = 'Salvar nota', 1200);
  });

  // ao trocar de vídeo, carrega nota salva (se existir)
  function carregarNotaAtual() {
    const key = `nota_${VIDEOS[currentIndex].id}`;
    notasEl.value = localStorage.getItem(key) || '';
  }

  // quando vídeo muda, sincronizar nota + fav UI
  player.addEventListener('loadedmetadata', () => {
    syncProgress();
    carregarNotaAtual();
    updateFavUI();
  });

  /* ---------- Inicialização ---------- */
  renderPlaylist();

  // layout responsivo: se não carregar miniaturas, continue funcionando
  if (!player.src) {
    // fallback: carrega primeiro item manualmente
    loadVideo(0, false);
  }

  // acessibilidade: permitir barra de espaço para play/pause quando o player estiver focado
  document.addEventListener('keydown', (ev) => {
    if (ev.code === 'Space') {
      const active = document.activeElement;
      // se estiver num input/textarea, não interferir
      if (active && (active.tagName === 'INPUT' || active.tagName === 'TEXTAREA')) return;
      ev.preventDefault();
      togglePlay();
    }
  });

});
