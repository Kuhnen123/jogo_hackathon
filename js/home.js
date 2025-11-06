// js/home.js
// Home - integração de sessão, mascote/painel de atividades, navegação por ROTAS
// Comentários em português para facilitar a manutenção.

document.addEventListener('DOMContentLoaded', () => {
  /* ---------- CONFIGURAÇÕES / CHAVES ---------- */
  const CHAVE_SESSAO = 'lingua_session'; // localStorage para dados do usuário

  /* ---------- MAPA DE ROTAS (edite conforme suas pastas) ---------- */
  const ROTAS = {
    // botões principais (cards)
    video: '../html/video.html',
    atividades: '../html/atividade.html',
    jogos: '../html/competicao.html',
    perfil: '../html/perfil.html',

    // botões sugeridos (cada ação aponta para uma tela específica)
    'iniciar-aula': '../html/video.html',
    'iniciar-desafio': '../html/atividade.html',
    'iniciar-aula-2': '../html/video.html'
  };

  /* ---------- ELEMENTOS DO DOM ---------- */
  // header / painel do usuário
  const nomeHeader = document.getElementById('nomeUsuarioHeader');
  const nomeCard = document.getElementById('nomeUsuario');
  const nivelEl = document.getElementById('nivelUsuario');
  const pontosEl = document.getElementById('pontosUsuario');
  const barraXp = document.getElementById('barraXp');
  const xpPercentEl = document.getElementById('xpPercent');
  const avatarSmall = document.getElementById('avatar');
  const avatarGrande = document.getElementById('avatarGrande');

  // mascote / painel de atividades
  const mascoteBtn = document.getElementById('mascoteBtn');          // botão que mostra o painel
  const painelAtividades = document.getElementById('painelAtividades'); // o painel/modal em si
  const fecharPainel = document.getElementById('fecharPainel');     // botão fechar do painel
  const btnCompletarTudo = document.getElementById('btnCompletarTudo'); // marcar tudo
  const btnNotificacoes = document.getElementById('btnNotificacoes'); // notificações
  const btnTema = document.getElementById('btnTema');               // alterna tema
  const iconeTema = document.getElementById('iconeTema');           // ícone do tema

  /* ---------- FUNÇÕES DE SESSÃO ---------- */
  // lê sessão do localStorage (retorna objeto ou null)
  function lerSessao() {
    try {
      return JSON.parse(localStorage.getItem(CHAVE_SESSAO) || 'null');
    } catch (e) {
      console.warn('Erro ao ler sessão:', e);
      return null;
    }
  }

  // salva sessão no localStorage (passar objeto)
  function gravarSessao(obj) {
    try {
      localStorage.setItem(CHAVE_SESSAO, JSON.stringify(obj));
      // Dispara evento storage local para sinalizar mudanças (útil em outras abas)
      window.dispatchEvent(new Event('storage'));
    } catch (e) {
      console.warn('Erro ao gravar sessão:', e);
    }
  }

  // cria sessão de exemplo (apenas se não existir) — útil para testes
  function inicializarSessaoExemplo() {
    let sess = lerSessao();
    if (!sess) {
      sess = {
        username: 'Maria',
        nivel: 5,
        pontos: 1250,
        xpPercent: 60,
        avatar: '../img/avatar-default-large.jpg' // ajuste caso queira outra imagem
      };
      gravarSessao(sess);
    }
    return sess;
  }

  /* ---------- ATUALIZAÇÃO DA UI ---------- */
  function carregarSessaoNaUI() {
    const sessao = lerSessao() || inicializarSessaoExemplo();

    const nome = sessao.username || sessao.email || 'Usuário';
    const nivel = typeof sessao.nivel === 'number' ? sessao.nivel : (sessao.nivel || 0);
    const pontos = typeof sessao.pontos === 'number' ? sessao.pontos : Number(sessao.pontos || 0);
    const xpPercent = typeof sessao.xpPercent === 'number' ? sessao.xpPercent : Number(sessao.xpPercent || 0);

    // preenche DOM
    if (nomeHeader) nomeHeader.textContent = nome;
    if (nomeCard) nomeCard.textContent = nome;
    if (nivelEl) nivelEl.textContent = `Nível ${nivel}`;
    if (pontosEl) pontosEl.textContent = `Pontos: ${Intl.NumberFormat('pt-BR').format(pontos)}`;
    if (barraXp) barraXp.style.width = `${xpPercent}%`;
    if (xpPercentEl) xpPercentEl.textContent = `${xpPercent}%`;

    // atualiza avatares se existirem elementos
    if (sessao.avatar) {
      if (avatarSmall) avatarSmall.style.backgroundImage = `url("${sessao.avatar}")`;
      if (avatarGrande) avatarGrande.style.backgroundImage = `url("${sessao.avatar}")`;
    }
  }

  /* ---------- MASCOTE / PAINEL DE ATIVIDADES ---------- */
  // abre ou fecha o painel de atividades
  function togglePainelAtividades(mostrar) {
    if (!painelAtividades) return;
    if (mostrar) {
      painelAtividades.classList.remove('hidden');
      painelAtividades.setAttribute('tabindex', '-1');
      painelAtividades.focus();
    } else {
      painelAtividades.classList.add('hidden');
      painelAtividades.removeAttribute('tabindex');
    }
  }

  // ação quando usuário completa todas atividades (simulação)
  function completarTodasAtividadesSimulado() {
    // soma de recompensa (mesma soma usada no HTML: 200 + 120 + 80)
    const ganho = 200 + 120 + 80;

    let sess = lerSessao() || {};
    sess.pontos = (typeof sess.pontos === 'number' ? sess.pontos : Number(sess.pontos || 0)) + ganho;

    // atualiza XP (simples incremento)
    sess.xpPercent = Math.min(100, (sess.xpPercent ?? 0) + 10);

    gravarSessao(sess);
    carregarSessaoNaUI();

    alert(`Atividades concluídas! Você ganhou ${ganho} pontos.`);
    togglePainelAtividades(false);
  }

  /* ---------- DELEGAÇÃO: BOTÕES -> ROTAS ---------- */
  // delega clique dos cards para abrir páginas conforme ROTAS
  function inicializarRotas() {
    // botões principais (cards)
    document.querySelectorAll('.acao-card').forEach(btn => {
      btn.addEventListener('click', () => {
        const acao = btn.getAttribute('data-action');
        if (ROTAS[acao]) {
          // navega para a rota definida
          window.location.href = ROTAS[acao];
        } else {
          // fallback: mensagem para dev
          alert('Ação não mapeada (verifique ROTAS em home.js): ' + acao);
        }
      });
    });

    // botões sugeridos (lista)
    document.querySelectorAll('.btn-sug').forEach(btn => {
      btn.addEventListener('click', (ev) => {
        ev.stopPropagation();
        const acao = btn.getAttribute('data-action');
        if (ROTAS[acao]) {
          window.location.href = ROTAS[acao];
        } else {
          alert('Conteúdo em desenvolvimento: ' + acao);
        }
      });
    });
  }

  /* ---------- NOTIFICAÇÕES E TEMA ---------- */
  if (btnNotificacoes) {
    btnNotificacoes.addEventListener('click', () => {
      alert('Você não tem notificações novas (simulação).');
    });
  }

  // alterna tema claro/escuro e persiste preferência
  (function initTema() {
    if (!btnTema || !iconeTema) return;
    const root = document.documentElement;
    const temaSalvo = localStorage.getItem('lingua_tema');
    if (temaSalvo === 'dark') {
      root.classList.add('dark');
      iconeTema.textContent = 'light_mode';
    } else {
      root.classList.remove('dark');
      iconeTema.textContent = 'dark_mode';
    }

    btnTema.addEventListener('click', () => {
      if (root.classList.contains('dark')) {
        root.classList.remove('dark');
        iconeTema.textContent = 'dark_mode';
        localStorage.setItem('lingua_tema', 'light');
      } else {
        root.classList.add('dark');
        iconeTema.textContent = 'light_mode';
        localStorage.setItem('lingua_tema', 'dark');
      }
    });
  })();

  /* ---------- EVENTOS DO MASCOTE E PAINEL ---------- */
  if (mascoteBtn) {
    mascoteBtn.addEventListener('click', (ev) => {
      ev.stopPropagation();
      const aberto = !painelAtividades.classList.contains('hidden');
      togglePainelAtividades(!aberto);
    });
  }

  if (fecharPainel) {
    fecharPainel.addEventListener('click', () => togglePainelAtividades(false));
  }

  if (btnCompletarTudo) {
    btnCompletarTudo.addEventListener('click', () => {
      if (confirm('Marcar todas as atividades como completas?')) {
        completarTodasAtividadesSimulado();
      }
    });
  }

  // fecha painel ao clicar fora
  document.addEventListener('click', (ev) => {
    if (!painelAtividades) return;
    if (!painelAtividades.classList.contains('hidden')) {
      const alvo = ev.target;
      if (!painelAtividades.contains(alvo) && !mascoteBtn.contains(alvo)) {
        togglePainelAtividades(false);
      }
    }
  });

  // tecla ESC fecha o painel
  document.addEventListener('keydown', (ev) => {
    if (ev.key === 'Escape' && painelAtividades && !painelAtividades.classList.contains('hidden')) {
      togglePainelAtividades(false);
    }
  });

  /* ---------- INICIALIZAÇÃO ---------- */
  // inicializa sessão exemplo caso não exista
  inicializarSessaoExemplo();
  // carrega valores na UI
  carregarSessaoNaUI();
  // inicializa rotas para botões
  inicializarRotas();

  /* ---------- OBSERVAÇÃO: onde editar imagens ------- */
  // - Mascote: alterar o <img src="..."> dentro do botão #mascoteBtn no HTML.
  // - Avatar pequeno: alterar background-image em .avatar-small no arquivo CSS (home.css).
  // - Avatar grande: alterar background-image em .avatar-large no arquivo CSS (home.css).
  //
  // Exemplo rápido (HTML): <img src="../img/novo-mascote.png" class="mascote-img" />
  // Exemplo CSS (home.css): .avatar-large { background-image: url("../img/meu-avatar.jpg"); }

  /* ---------- FIM ---------- */
});
// === Notificações / Configurações - comportamento (em português) ===
document.addEventListener('DOMContentLoaded', () => {
  const btnNotificacoes = document.getElementById('btnNotificacoes');
  const popover = document.getElementById('popoverNotificacoes');
  const fecharPopover = document.getElementById('fecharPopover');
  const btnConfig = document.getElementById('btnConfig');

  // Abre/fecha o popover de notificações
  function togglePopover(show) {
    if (!popover) return;
    if (show) {
      popover.classList.remove('hidden');
      popover.setAttribute('aria-hidden', 'false');
      btnNotificacoes.setAttribute('aria-expanded', 'true');
    } else {
      popover.classList.add('hidden');
      popover.setAttribute('aria-hidden', 'true');
      btnNotificacoes.setAttribute('aria-expanded', 'false');
    }
  }

  // clique no ícone de notificação: alterna o popover
  btnNotificacoes.addEventListener('click', (ev) => {
    ev.stopPropagation(); // evita que o documento capture o clique e feche imediatamente
    const aberto = !popover.classList.contains('hidden');
    togglePopover(!aberto);
  });

  // fechar pelo botão ×
  fecharPopover.addEventListener('click', (ev) => {
    ev.stopPropagation();
    togglePopover(false);
  });

  // fecha o popover ao clicar fora
  document.addEventListener('click', (ev) => {
    if (!popover.classList.contains('hidden')) {
      const alvo = ev.target;
      if (!popover.contains(alvo) && !btnNotificacoes.contains(alvo)) {
        togglePopover(false);
      }
    }
  });

  // tecla ESC fecha o popover
  document.addEventListener('keydown', (ev) => {
    if (ev.key === 'Escape' && !popover.classList.contains('hidden')) {
      togglePopover(false);
    }
  });

  // Botão de configurações: navega para a página de configurações
  btnConfig.addEventListener('click', () => {
    // ajuste o caminho se sua estrutura de pastas for diferente
    window.location.href = '../html/configuracoes.html';
  });

});

