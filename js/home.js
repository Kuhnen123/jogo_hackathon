// js/home.js
// Funcionalidades da tela Home (preencher dados, botões, tema)
// Em português: busca sessão em localStorage (lingua_session)

document.addEventListener('DOMContentLoaded', () => {
    const chaveSessao = 'lingua_session';
    const sessaoRaw = localStorage.getItem(chaveSessao);
    let sessao = null;
  
    try {
      sessao = sessaoRaw ? JSON.parse(sessaoRaw) : null;
    } catch (e) {
      console.warn('Erro ao parsear sessão:', e);
      sessao = null;
    }
  
    // elementos
    const nomeHeader = document.getElementById('nomeUsuarioHeader');
    const nomeCard = document.getElementById('nomeUsuario');
    const nivelEl = document.getElementById('nivelUsuario');
    const pontosEl = document.getElementById('pontosUsuario');
    const barraXp = document.getElementById('barraXp');
    const xpPercentEl = document.getElementById('xpPercent');
    const avatarEl = document.getElementById('avatar');
    const avatarGrande = document.getElementById('avatarGrande');
  
    // Se tiver sessão, preenche — senão, valores padrão
    if (sessao && sessao.username) {
      const nome = sessao.username || sessao.email || 'Usuário';
      const nivel = sessao.nivel ?? 5; // se não tiver, 5 apenas como demo
      const pontos = sessao.pontos ?? 1250;
      const xpPercent = sessao.xpPercent ?? 60;
      const avatarUrl = sessao.avatar || avatarEl.style.backgroundImage.replace(/url\(["']?(.+)["']?\)/, '$1');
  
      nomeHeader.textContent = nome;
      nomeCard.textContent = nome;
      nivelEl.textContent = `Nível ${nivel}`;
      pontosEl.textContent = `Pontos: ${Intl.NumberFormat('pt-BR').format(pontos)}`;
      barraXp.style.width = `${xpPercent}%`;
      xpPercentEl.textContent = `${xpPercent}%`;
  
      // atualizar avatares (se tiver url válida)
      if (avatarUrl) {
        avatarEl.style.backgroundImage = `url("${avatarUrl}")`;
        avatarGrande.style.backgroundImage = `url("${avatarUrl}")`;
      }
    } else {
      // fallback visual
      nomeHeader.textContent = 'Visitante';
      nomeCard.textContent = 'Visitante';
      nivelEl.textContent = 'Nível 0';
      pontosEl.textContent = 'Pontos: 0';
      barraXp.style.width = `0%`;
      xpPercentEl.textContent = `0%`;
    }
  
    // Botões dos cards: delegação por data-action
    document.querySelectorAll('.card').forEach(card => {
      card.addEventListener('click', () => {
        const acao = card.getAttribute('data-action');
        handleAcaoCard(acao);
      });
    });
  
    // Botões sugeridos
    document.querySelectorAll('.btn-sug').forEach(btn => {
      btn.addEventListener('click', (ev) => {
        const acao = btn.getAttribute('data-action');
        ev.stopPropagation();
        handleSugerido(acao);
      });
    });
  
    // Notificações (simples)
    document.getElementById('btnNotificacoes').addEventListener('click', () => {
      alert('Você não tem notificações novas (simulação).');
    });
  
    // Tema - alterna classe 'dark' no html/body
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
  
    // Funções auxiliares
    function handleAcaoCard(acao) {
      switch (acao) {
        case 'video':
          // exemplo: ir para video-aulas.html
          // window.location.href = 'video-aulas.html';
          alert('Abrindo vídeo-aulas (simulação).');
          break;
        case 'atividades':
          alert('Abrindo atividades (simulação).');
          break;
        case 'jogos':
          alert('Abrindo jogos (simulação).');
          break;
        case 'perfil':
          // window.location.href = 'perfil.html';
          alert('Abrindo seu perfil (simulação).');
          break;
        default:
          alert('Ação não mapeada: ' + acao);
      }
    }
  
    function handleSugerido(acao) {
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
    }
  
  });
  