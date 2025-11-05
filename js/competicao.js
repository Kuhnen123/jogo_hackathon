// js/tela_competicao.js
// Funcionalidade da tela de competição (Desafio de Velocidade)
// Comentários em português para facilitar manutenção.

/* ---------- Configurações iniciais ---------- */
document.addEventListener('DOMContentLoaded', () => {
  // Frase alvo (você pode mudar aqui)
  const FRASE_ALVO = 'A rápida raposa marrom salta sobre o cão preguiçoso.';
  const TEMPO_INICIAL_SEGUNDOS = 85; // 1:25 = 85s

  // Elements
  const elFrase = document.getElementById('frase-alvo');
  const input = document.getElementById('input-digitacao');
  const tempoTop = document.getElementById('tempo-top');
  const tempoRestante = document.getElementById('tempo-restante');
  const pontosTop = document.getElementById('pontos-top');
  const placarVoce = document.getElementById('placar-voce');
  const btnPause = document.getElementById('btn-pause');
  const iconePause = document.getElementById('icone-pause');
  const statusLine = document.getElementById('status-line');
  const btnVoltar = document.getElementById('btn-voltar');
  const rankingList = document.getElementById('ranking-list');
  const melhorPlacar = document.getElementById('melhor-placar');

  // Estado
  let tempo = TEMPO_INICIAL_SEGUNDOS;
  let timerId = null;
  let rodando = false;
  let pontos = 0;
  let started = false; // indica se o usuário já começou a digitar

  // Mostrar ranking estático (você pode alimentar dinamicamente depois)
  const rankingExemplo = [
    { nome: 'Ana', pontos: 2300, avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAKqSxKs_3dq-jrPixisJLU0dvULt5mYg0mJhoHDi5a-JtrVZ9cDsjBwTrAFAHSyIYbAViV_gtU9UFppjvniqyU58msWq_UMt9qXzbdhvlGE9JbuV0N9JEfKcRcF4WJryPBglMKQ7VEp6jeXpX68HkwSxsAV6suNtP3cKn7vgR4FlD8aHSfxpwGVdABXIuBRgRF3Ga5SXc_VLDnwoGHKrmZvMgIQ5PwVPAEDlIQYbiSpE9wUMHeq8k9isPLp4EJF_PqrrEzSrdxaA4' },
    { nome: 'Você', pontos: 1200, avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDz2TalfVEwbmhhU9N2rjYH9bRHrAdYyz1ccg9G7mi6Ns9To9__H9FORd52B78ggvjwwD8ECu_JS0Rmkq_2ff9nvA6SfjwBKBZEYO9A3_FfzHdV8nRA2xm91Nlfao_ZjcSjPbs3s52zgcbvnZDUpbJC44x1PJTCc6_VrSL6pE1TpHtR7IBxGK-JUiw2GGklIvmgsTq8iLA0-f2MvOWFf49WWscd1hPQtZHdjkt3cr63D4TG-briXxGNYgOIam27r0YSY2ZZa2Mchi0' },
    { nome: 'Carlos', pontos: 980, avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCAyZAX4TOfYHi9kbuDLqurXV4JbMSCR-p8TrRomYk7PAmVUbArxwwhe_gCF_nygcvSBrob4UskbDNanrPqqF4DhNU6pMo0DPxhPUCQTQsIVQbQS-uiYYOA0IE1l73ROuyNBnFGTSXFSFPjA_2L1wExGqQfOxhQPw1fl9--j9n9p59tzYLNQC2X_H2C91PCBcjXoLj2-RLJ2Nd3Z6XH6DoEOla4jgPkY_Ltn6SA-B1_Urk32U9SU5qAIMMQf5UvWBkqIaPT1y7BwzA' }
  ];

  // Renderiza ranking
  function renderRanking() {
    if (!rankingList) return;
    rankingList.innerHTML = '';
    rankingExemplo.forEach((r, idx) => {
      const li = document.createElement('li');
      li.className = 'flex items-center gap-3';
      li.innerHTML = `
        <img alt="Avatar ${r.nome}" class="w-10 h-10 rounded-full" src="${r.avatar}">
        <div class="flex-1">
          <p class="font-semibold">${r.nome}</p>
          <p class="text-sm ${r.nome === 'Você' ? 'text-primary' : 'text-gray-500'}">${r.pontos} pts</p>
        </div>
        <span class="font-bold text-lg">${idx + 1}º</span>
      `;
      rankingList.appendChild(li);
    });
  }

  // Constrói a visualização da frase alvo com spans por caractere (para coloração)
  function renderFraseAlvo() {
    if (!elFrase) return;
    elFrase.innerHTML = ''; // limpa
    for (let i = 0; i < FRASE_ALVO.length; i++) {
      const ch = FRASE_ALVO[i];
      const span = document.createElement('span');
      span.className = 'fr-char';
      span.textContent = ch;
      elFrase.appendChild(span);
    }
  }

  // Atualiza o tempo no topo e no painel lateral
  function atualizarTempoNaUI() {
    const mm = String(Math.floor(tempo / 60)).padStart(2, '0');
    const ss = String(tempo % 60).padStart(2, '0');
    if (tempoTop) tempoTop.textContent = `${mm}:${ss}`;
    if (tempoRestante) tempoRestante.textContent = `${mm}:${ss}`;
  }

  // Atualiza pontos na UI
  function atualizarPontosNaUI() {
    if (pontosTop) pontosTop.textContent = pontos.toString();
    if (placarVoce) placarVoce.textContent = pontos.toString();
  }

  // Laço do timer — executa a cada segundo
  function iniciarTimer() {
    if (rodando) return;
    rodando = true;
    timerId = setInterval(() => {
      if (tempo > 0) {
        tempo -= 1;
        atualizarTempoNaUI();
      } else {
        pararTimer();
        finalizarDesafio();
      }
    }, 1000);
  }

  function pararTimer() {
    rodando = false;
    if (timerId) {
      clearInterval(timerId);
      timerId = null;
    }
  }

  // Quando o tempo acaba: desativa a textarea e mostrado resultado
  function finalizarDesafio() {
    input.disabled = true;
    statusLine.textContent = `Tempo esgotado — Pontos finais: ${pontos}`;
    // opcional: atualizar melhor placar (localStorage) — aqui só ajusta visual
    const melhor = Number(melhorPlacar.textContent.replace(/\D/g, '')) || 0;
    if (pontos > melhor) {
      melhorPlacar.textContent = pontos;
      // aqui você poderia persistir em localStorage se quiser
    }
    alert(`Tempo esgotado! Sua pontuação: ${pontos}`);
  }

  // Compara o que foi digitado com a frase alvo e marca spans
  function avaliarDigitacao() {
    const texto = input.value;
    const spans = elFrase.querySelectorAll('.fr-char');
    let corretos = 0;

    for (let i = 0; i < spans.length; i++) {
      const span = spans[i];
      const charEsperado = FRASE_ALVO[i] || '';
      const charDigitado = texto[i] || '';

      span.classList.remove('correct', 'incorrect');

      if (!charDigitado) {
        // sem digitação ainda
        // mantém sem classe
      } else if (charDigitado === charEsperado) {
        span.classList.add('correct');
        corretos++;
      } else {
        span.classList.add('incorrect');
      }
    }

    // Pontuação simples: 10 pontos por caractere correto (ajuste se quiser)
    pontos = corretos * 10;
    atualizarPontosNaUI();

    // Status auxiliar
    const totalChars = FRASE_ALVO.length;
    statusLine.textContent = `Caracteres corretos: ${corretos}/${totalChars} • Pontos atuais: ${pontos}`;
  }

  /* ---------- Eventos ---------- */

  // iniciar ao digitar pela primeira vez
  input.addEventListener('input', () => {
    if (!started) {
      started = true;
      iniciarTimer();
    }
    avaliarDigitacao();
  });

  // pausas
  btnPause.addEventListener('click', () => {
    if (rodando) {
      pararTimer();
      iconePause.textContent = 'play_circle';
      statusLine.textContent = 'Pausado';
    } else {
      if (tempo > 0) {
        iniciarTimer();
        iconePause.textContent = 'pause_circle';
        statusLine.textContent = '';
      }
    }
  });

  // botão voltar (navega para a home; ajuste caminho se necessário)
  btnVoltar.addEventListener('click', () => {
    // alterar caminho se seu arquivo home estiver em outro local
    window.location.href = '../html/home.html';
  });

  // tecla ESC também pausa/resume
  document.addEventListener('keydown', (ev) => {
    if (ev.key === 'Escape') {
      // toggla pause
      btnPause.click();
    }
    // Enter + Ctrl envia? (não queremos submit)
  });

  /* ---------- Inicialização ---------- */
  function init() {
    // renderiza frase alvo com spans
    renderFraseAlvo();
    // tempo inicial
    tempo = TEMPO_INICIAL_SEGUNDOS;
    atualizarTempoNaUI();
    // pontos
    pontos = 0;
    atualizarPontosNaUI();
    // ranking
    renderRanking();
    // desabilita autocomplete e evita submit
    input.setAttribute('autocomplete', 'off');
    input.focus();
  }

  init();
});
