// js/home.js
// Integra Home com painel de "Atividades do Dia" via mascote
// Comentários em português conforme solicitado.

document.addEventListener('DOMContentLoaded', () => {
  const chaveSessao = 'lingua_session';

  // elementos da UI
  const nomeHeader = document.getElementById('nomeUsuarioHeader');
  const nomeCard = document.getElementById('nomeUsuario');
  const nivelEl = document.getElementById('nivelUsuario');
  const pontosEl = document.getElementById('pontosUsuario');
  const barraXp = document.getElementById('barraXp');
  const xpPercentEl = document.getElementById('xpPercent');
  const avatarSmall = document.getElementById('avatar');
  const avatarGrande = document.getElementById('avatarGrande');

  // elementos do mascote / painel
  const mascoteBtn = document.getElementById('mascoteBtn');
  const painelAtividades = document.getElementById('painelAtividades');
  const fecharPainel = document.getElementById('fecharPainel');
  const btnCompletarTudo = document.getElementById('btnCompletarTudo');

  // carregar sessão do localStorage (se existir)
  function carregarSessao() {
    let sessao = null;
    try {
      sessao = JSON.parse(localStorage.getItem(chaveSessao) || 'null');
    } catch (e) {
      console.warn('Erro parseando sessão:', e);
      sessao = null;
    }

    if (sessao) {
      const nome = sessao.username || sessao.email || 'Usuário';
      const nivel = sessao.nivel ?? 5;
      const pontos = typeof sessao.pontos === 'number' ? sessao.pontos : (sessao.pontos ? Number(sessao.pontos) : 1250);
      const xpPercent = typeof sessao.xpPercent === 'number' ? sessao.xpPercent : (sessao.xpPercent ? Number(sessao.xpPercent) : 60);
      const avatarUrl = sessao.avatar || null;

      // preenche campos
      nomeHeader.textContent = nome;
      nomeCard.textContent = nome;
      nivelEl.textContent = `Nível ${nivel}`;
      pontosEl.textContent = `Pontos: ${Intl.NumberFormat('pt-BR').format(pontos)}`;
      barraXp.style.width = `${xpPercent}%`;
      xpPercentEl.textContent = `${xpPercent}%`;

      // atualiza avatares (se existir URL)
      if (avatarUrl) {
        avatarSmall.style.backgroundImage = `url("${avatarUrl}")`;
        avatarGrande.style.backgroundImage = `url("${avatarUrl}")`;
      }
    } else {
      // fallback padrão
      nomeHeader.textContent = 'Visitante';
      nomeCard.textContent = 'Visitante';
      nivelEl.textContent = 'Nível 0';
      pontosEl.textContent = 'Pontos: 0';
      barraXp.style.width = `0%`;
      xpPercentEl.textContent = `0%`;
    }
  }

  // abrir/fechar painel de atividades (toggle)
  function togglePainel(mostrar) {
    if (mostrar) {
      painelAtividades.classList.remove('hidden');
      // foco para acessibilidade
      painelAtividades.setAttribute('tabindex', '-1');
      painelAtividades.focus();
    } else {
      painelAtividades.classList.add('hidden');
    }
  }

  // marcar todas atividades como completas (exemplo: adiciona pontos e atualiza UI)
  function completarTodasAtividades() {
    // lê sessão
    let sessao = null;
    try { sessao = JSON.parse(localStorage.getItem(chaveSessao) || 'null'); } catch { sessao = null; }

    if (!sessao) sessao = {};

    // soma exemplo de pontos (200 + 120 + 80 = 400)
    const ganho = 200 + 120 + 80;
    const pontosAtuais = typeof sessao.pontos === 'number' ? sessao.pontos : (sessao.pontos ? Number(sessao.pontos) : 0);
    sessao.pontos = pontosAtuais + ganho;

    // opcional: atualizar xpPercent também (simulação)
    const xpAtual = typeof sessao.xpPercent === 'number' ? sessao.xpPercent : (sessao.xpPercent ? Number(sessao.xpPercent) : 60);
    const novoXp = Math.min(100, xpAtual + 10);

    sessao.xpPercent = novoXp;

    // salva de volta
    try { localStorage.setItem(chaveSessao, JSON.stringify(sessao)); }
    catch (e) { console.warn('Erro salvando sessão:', e); }

    // atualiza UI local sem reload
    carregarSessao();

    // feedback ao usuário
    alert(`Atividades concluídas! Você ganhou ${ganho} pontos.`);
    // fecha painel após completar
    togglePainel(false);
  }

  // eventos iniciais: mascote abre o painel
  mascoteBtn.addEventListener('click', (ev) => {
    ev.stopPropagation();
    const aberto = !painelAtividades.classList.contains('hidden');
    togglePainel(!aberto);
  });

  // fechar botão
  fecharPainel.addEventListener('click', () => togglePainel(false));

  // completar tudo
  btnCompletarTudo.addEventListener('click', completarTodasAtividades);

  // cliques fora do painel fecham (melhora UX)
  document.addEventListener('click', (ev) => {
    const alvo = ev.target;
    if (!painelAtividades.classList.contains('hidden')) {
      // se o clique não foi no painel nem no mascote, fecha
      if (!painelAtividades.contains(alvo) && !mascoteBtn.contains(alvo)) {
        togglePainel(false);
      }
    }
  });

  // tecla ESC fecha o painel
  document.addEventListener('keydown', (ev) => {
    if (ev.key === 'Escape' && !painelAtividades.classList.contains('hidden')) {
      togglePainel(false);
    }
  });

  // Botões dos cards: delegação por data-action (vídeo, atividades, jogos, perfil)
  document.querySelectorAll('.acao-card').forEach(btn => {
    btn.addEventListener('click', () => {
      const acao = btn.getAttribute('data-action');
      switch (acao) {
        case 'video':
          alert('Abrindo vídeo-aulas (simulação).');
          break;
        case 'atividades':
          alert('Abrindo atividades (simulação).');
          break;
        case 'jogos':
          alert('Abrindo jogos (simulação).');
          break;
        case 'perfil':
          alert('Abrindo seu perfil (simulação).');
          break;
        default:
          alert('Ação não mapeada: ' + acao);
      }
    });
  });

  // Botões sugeridos
  document.querySelectorAll('.btn-sug').forEach(btn => {
    btn.addEventListener('click', (ev) => {
      const acao = btn.getAttribute('data-action');
      ev.stopPropagation();
      switch (acao) {
        case 'iniciar-aula':
        case 'iniciar-aula-2':
          alert('Iniciando aula (simulação).');
          break;
        case 'iniciar-desafio':
          alert('Iniciando desafio (simulação).');
          break;
        default:
          alert('Ação sugerida: ' + acao);
      }
    });
  });

  // Notificações (simulação)
  const btnNotificacoes = document.getElementById('btnNotificacoes');
  btnNotificacoes.addEventListener('click', () => {
    alert('Você não tem notificações novas (simulação).');
  });

  // Tema - alterna classe 'dark' no html
  const btnTema = document.getElementById('btnTema');
  const iconeTema = document.getElementById('iconeTema');
  const root = document.documentElement;

  // inicial: se já existe preferencia no localStorage
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

  // Inicializa a página com dados da sessão
  carregarSessao();
});
