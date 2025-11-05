// js/perfil.js
// Gerencia sessão, seleção de avatar, abas e integração com loja de skins (localStorage)

/*
Estruturas usadas:
- localStorage.lingua_session (objeto JSON) -> pode conter { username, nivel, pontos, xpPercent, avatar }
- localStorage.lingua_owned_skins (array) -> ['skin-ouro', ...]
*/

document.addEventListener('DOMContentLoaded', () => {
  const chaveSessao = 'lingua_session';
  const chaveOwned = 'lingua_owned_skins';

  // elementos principais
  const nomeEl = document.getElementById('nomePerfil');
  const nivelEl = document.getElementById('nivelPerfil');
  const pontosEl = document.getElementById('pontosPerfil');
  const xpPercentHeader = document.getElementById('xpPercentHeader');
  const barraProgresso = document.getElementById('barraProgresso');
  const avatarGrande = document.getElementById('avatarPerfil');

  const tabs = document.querySelectorAll('.tab');
  const tabContents = document.querySelectorAll('.tab-content');

  // NodeList -> Array
  let avatarItems = Array.from(document.querySelectorAll('.avatar-item'));

  // carregar sessão da página / preencher UI
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
      if (sessao.nivel) nivelEl.textContent = `Nível ${sessao.nivel}`;
      if (typeof sessao.pontos !== 'undefined') pontosEl.textContent = `Pontos: ${Intl.NumberFormat('pt-BR').format(sessao.pontos)}`;
      const xp = typeof sessao.xpPercent === 'number' ? sessao.xpPercent : 75;
      xpPercentHeader.textContent = `${xp}%`;
      barraProgresso.style.width = `${xp}%`;
      if (sessao.avatar) avatarGrande.style.backgroundImage = `url("${sessao.avatar}")`;
    } else {
      // defaults
      barraProgresso.style.width = barraProgresso.style.width || '75%';
    }
  }

  // atualiza lista de avatarItems (útil se DOM mudar)
  function refreshAvatarItems() {
    avatarItems = Array.from(document.querySelectorAll('.avatar-item'));
  }

  // carregar skins possuídas e atualizar itens bloqueados
  function aplicarOwnedSkins() {
    const owned = JSON.parse(localStorage.getItem(chaveOwned) || '[]');
    refreshAvatarItems();
    avatarItems.forEach(item => {
      const skinId = item.getAttribute('data-skin-id');
      if (skinId) {
        if (owned.includes(skinId)) {
          item.classList.remove('locked');
          // se houver data-avatar disponível (não enviado), não fazemos nada
        } else {
          // permanece locked
          item.classList.add('locked');
        }
      }
    });
  }

  // salva avatar no objeto de sessão
  function salvarAvatarSessao(url) {
    try {
      const sessao = JSON.parse(localStorage.getItem(chaveSessao) || '{}');
      sessao.avatar = url;
      localStorage.setItem(chaveSessao, JSON.stringify(sessao));
    } catch (e) {
      console.warn('Erro salvando avatar na sessão:', e);
    }
  }

  // limpa a seleção visual
  function limparSelecaoAvatares() {
    refreshAvatarItems();
    avatarItems.forEach(i => i.classList.remove('selected'));
  }

  // inicialização
  carregarSessao();
  aplicarOwnedSkins();

  // após aplicar owned, re-obtem avatarItems
  refreshAvatarItems();

  // adiciona comportamento aos avatars (selecionar / comprar)
  avatarItems.forEach(item => {
    // tornar focável para teclado
    if (!item.hasAttribute('tabindex')) item.setAttribute('tabindex', '0');

    item.addEventListener('click', (ev) => {
      // se estiver locked -> redirecionar para comprar
      if (item.classList.contains('locked')) {
        const skinId = item.getAttribute('data-skin-id') || '';
        const skinName = item.getAttribute('data-skin-name') || '';
        const qId = encodeURIComponent(skinId);
        const qName = encodeURIComponent(skinName);
        window.location.href = `comprar-skins.html?skin=${qId}&name=${qName}`;
        return;
      }

      // selecionar avatar desbloqueado
      const url = item.getAttribute('data-avatar');
      if (!url) {
        // se não houver url (situação improvável), apenas mostra efeito
        item.classList.add('selected');
        setTimeout(() => item.classList.remove('selected'), 800);
        return;
      }

      limparSelecaoAvatares();
      item.classList.add('selected');
      avatarGrande.style.backgroundImage = `url("${url}")`;
      salvarAvatarSessao(url);
    });

    // suporte teclado (Enter / Space)
    item.addEventListener('keydown', (ev) => {
      if (ev.key === 'Enter' || ev.key === ' ') {
        ev.preventDefault();
        item.click();
      }
    });
  });

  // abas (tabs)
  tabs.forEach(tab => {
    tab.addEventListener('click', (ev) => {
      ev.preventDefault();
      const targetId = tab.getAttribute('data-target');
      if (!targetId) return;

      tabs.forEach(t => t.classList.remove('tab-active'));
      tab.classList.add('tab-active');

      tabContents.forEach(tc => {
        if (tc.id === targetId) tc.classList.remove('hidden');
        else tc.classList.add('hidden');
      });
    });
  });

  // animação suave da barra de progresso
  setTimeout(() => {
    barraProgresso.style.transition = 'width 700ms cubic-bezier(.2,.9,.3,1)';
  }, 50);

  // observar mudanças no localStorage (ex: retorno da compra)
  window.addEventListener('storage', (ev) => {
    if (ev.key === chaveOwned || ev.key === chaveSessao) {
      // re-aplica owned quando mudanças externas acontecem
      aplicarOwnedSkins();
      carregarSessao();
    }
  });

  // quando voltar da página de compra via redirect (não storage event), revalidar owned
  // (útil se a compra salvou e redirecionou de volta)
  window.addEventListener('pageshow', () => {
    aplicarOwnedSkins();
    carregarSessao();
  });

});
