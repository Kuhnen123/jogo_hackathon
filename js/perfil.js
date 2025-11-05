// js/perfil.js
// Funcionalidades:
// - Carregar sessão do localStorage (lingua_session) e preencher nome, nível, pontos, XP e avatar
// - Alternar abas (histórico / conquistas)
// - Selecionar avatar clicando em um avatar (atualiza avatar grande e salva na sessão)

document.addEventListener('DOMContentLoaded', () => {
  const chaveSessao = 'lingua_session';

  // elementos
  const nomeEl = document.getElementById('nomePerfil');
  const nivelEl = document.getElementById('nivelPerfil');
  const pontosEl = document.getElementById('pontosPerfil');
  const xpPercentHeader = document.getElementById('xpPercentHeader');
  const barraProgresso = document.getElementById('barraProgresso');
  const avatarGrande = document.getElementById('avatarPerfil');

  // abas
  const tabs = document.querySelectorAll('.tab');
  const tabContents = document.querySelectorAll('.tab-content');

  // avatares
  const avatarItems = Array.from(document.querySelectorAll('.avatar-item'));

  // carregar sessão se existir
  function carregarSessao() {
    let sessao = null;
    try {
      sessao = JSON.parse(localStorage.getItem(chaveSessao) || 'null');
    } catch (e) {
      console.warn('Erro parseando sessão:', e);
      sessao = null;
    }

    if (sessao) {
      nomeEl.textContent = sessao.username || sessao.email || 'Usuário';
      nivelEl.textContent = sessao.nivel ? `Nível ${sessao.nivel}` : nivelEl.textContent;
      pontosEl.textContent = sessao.pontos ? `Pontos: ${Intl.NumberFormat('pt-BR').format(sessao.pontos)}` : pontosEl.textContent;
      const xp = typeof sessao.xpPercent === 'number' ? sessao.xpPercent : 75;
      xpPercentHeader.textContent = `${xp}%`;
      barraProgresso.style.width = `${xp}%`;

      if (sessao.avatar) {
        avatarGrande.style.backgroundImage = `url("${sessao.avatar}")`;
      }
    } else {
      // defaults já definidos no HTML; apenas anima a barra
      setTimeout(() => { barraProgresso.style.width = barraProgresso.style.width || '75%'; }, 40);
    }
  }

  carregarSessao();

  // função para salvar avatar selecionado na sessão
  function salvarAvatarSessao(url) {
    try {
      const sessao = JSON.parse(localStorage.getItem(chaveSessao) || '{}');
      sessao.avatar = url;
      localStorage.setItem(chaveSessao, JSON.stringify(sessao));
    } catch (e) {
      console.warn('Não foi possível salvar avatar na sessão:', e);
    }
  }

  // controlar seleção visual de avatars
  function limparSelecaoAvatares() {
    avatarItems.forEach(item => item.classList.remove('selected'));
  }

  avatarItems.forEach(item => {
    item.addEventListener('click', (ev) => {
      const url = item.getAttribute('data-avatar');
      if (!url) return;
      limparSelecaoAvatares();
      item.classList.add('selected');
      avatarGrande.style.backgroundImage = `url("${url}")`;

      // salva na sessão para manter entre páginas
      salvarAvatarSessao(url);
    });
  });

  // comportamento das abas (tabs)
  tabs.forEach(tab => {
    tab.addEventListener('click', (ev) => {
      ev.preventDefault();
      const targetId = tab.getAttribute('data-target');
      if (!targetId) return;

      // trocar estado ativo visual das abas
      tabs.forEach(t => t.classList.remove('tab-active'));
      tab.classList.add('tab-active');

      // mostrar/ocultar conteúdos
      tabContents.forEach(tc => {
        if (tc.id === targetId) tc.classList.remove('hidden');
        else tc.classList.add('hidden');
      });
    });
  });

  // animação suave da barra de progresso ao carregar
  setTimeout(() => {
    const bw = getComputedStyle(barraProgresso).width;
    // já definido via carregarSessao, então apenas deixa a transição visible
    barraProgresso.style.transition = 'width 700ms cubic-bezier(.2,.9,.3,1)';
  }, 50);
});
