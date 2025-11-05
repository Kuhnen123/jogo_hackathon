// js/tela_compra.js
document.addEventListener('DOMContentLoaded', () => {
  const chaveSessao = 'lingua_session';
  const chaveOwned = 'lingua_owned_skins';

  const saldoValorEl = document.getElementById('saldoValor');
  const gridAvatares = document.getElementById('gridAvatares');
  const previewImage = document.getElementById('previewImage');
  const previewNome = document.getElementById('previewNome');
  const previewDescricao = document.getElementById('previewDescricao');
  const previewPreco = document.getElementById('previewPreco');
  const btnComprarPreview = document.getElementById('btnComprarPreview');

  const AVATARES = [
    { id: 'avatar-urso', nome: 'Urso Mágico', descricao: 'Urso com chapéu de mago', preco: 300, img: './../img/urso_magico.png' },
    { id: 'avatar-raposa', nome: 'Raposa Sábia', descricao: 'Raposa com óculos', preco: 200, img: './../img/raposa_esperta.png' },
    { id: 'avatar-panda', nome: 'Panda Rock', descricao: 'Panda com guitarra', preco: 150, img: './../img/urso_rokeiro.png' },
    { id: 'avatar-coala', nome: 'Coala Astronauta', descricao: 'Coala no espaço', preco: 400, img: './../img/coalha_astronauta.png' },
    { id: 'avatar-bloq1', nome: 'Misterioso', descricao: 'Em breve', preco: 250, img: '' },
    { id: 'avatar-bloq2', nome: 'Segredo', descricao: 'Em breve', preco: 320, img: '' }
  ];

  function lerSessao() {
    try { return JSON.parse(localStorage.getItem(chaveSessao) || 'null') || null; }
    catch (e) { return null; }
  }
  function gravarSessao(sessao) {
    localStorage.setItem(chaveSessao, JSON.stringify(sessao));
    window.dispatchEvent(new StorageEvent('storage', { key: chaveSessao, newValue: localStorage.getItem(chaveSessao) }));
  }
  function lerOwned() { try { return JSON.parse(localStorage.getItem(chaveOwned) || '[]'); } catch (e) { return []; } }
  function gravarOwned(arr) { localStorage.setItem(chaveOwned, JSON.stringify(arr)); }

  function atualizarSaldoUI() {
    const sess = lerSessao() || {};
    const moedas = typeof sess.pontos === 'number' ? sess.pontos : (parseInt(sess.moedas) || 0) || 0;
    saldoValorEl.textContent = `${Intl.NumberFormat('pt-BR').format(moedas)} moedas`;
    return moedas;
  }

  function gerarGrid() {
    gridAvatares.innerHTML = '';
    const owned = lerOwned();

    AVATARES.forEach(item => {
      const card = document.createElement('div');
      card.className = 'avatar-card';
      card.setAttribute('role','button');
      card.setAttribute('tabindex','0');

      const circle = document.createElement('div');
      circle.className = 'avatar-circle';
      if (item.img) circle.style.backgroundImage = `url("${item.img}")`;
      else {
        circle.innerHTML = `<span class="material-symbols-outlined">lock</span>`;
        circle.style.backgroundColor = '#e7e9ee';
        circle.style.color = '#9aa4b2';
      }

      const nameEl = document.createElement('div');
      nameEl.className = 'avatar-title';
      nameEl.textContent = item.nome;

      const subEl = document.createElement('div');
      subEl.className = 'avatar-sub';
      subEl.textContent = `${item.preco} moedas`;

      const foot = document.createElement('div');
      foot.className = 'card-foot';

      const btn = document.createElement('button');
      btn.className = 'btn-small btn-buy';
      btn.textContent = 'Comprar';
      btn.dataset.id = item.id;

      if (owned.includes(item.id)) {
        const badge = document.createElement('div');
        badge.className = 'badge-bought';
        badge.textContent = 'Desbloqueado';
        foot.appendChild(badge);
      } else {
        foot.appendChild(subEl);
        foot.appendChild(btn);
      }

      card.appendChild(circle);
      card.appendChild(nameEl);
      card.appendChild(foot);

      card.addEventListener('click', (ev) => {
        if (ev.target === btn) return;
        mostrarPreview(item, owned.includes(item.id));
      });

      card.addEventListener('keydown', (ev) => {
        if (ev.key === 'Enter' || ev.key === ' ') { ev.preventDefault(); card.click(); }
      });

      btn.addEventListener('click', (ev) => {
        ev.stopPropagation();
        abrirCompra(item);
      });

      gridAvatares.appendChild(card);
    });
  }

  let selecionado = null;
  function mostrarPreview(item, isOwned = false) {
    selecionado = item;
    previewNome.textContent = item.nome;
    previewDescricao.textContent = item.descricao || '';
    previewPreco.textContent = isOwned ? 'Já possui' : `${item.preco} moedas`;
    if (item.img) previewImage.style.backgroundImage = `url("${item.img}")`;
    else previewImage.style.backgroundImage = '';
    btnComprarPreview.disabled = !!isOwned;
    btnComprarPreview.textContent = isOwned ? 'Desbloqueado' : `Comprar por ${item.preco} moedas`;
    btnComprarPreview.dataset.id = item.id;
  }

  function abrirCompra(item) {
    const moedas = atualizarSaldoUI();
    if (!item) return;
    if (window.confirm(`Comprar "${item.nome}" por ${item.preco} moedas?`)) {
      if (moedas < item.preco) { alert('Saldo insuficiente. Complete atividades para ganhar mais moedas.'); return; }
      let sess = lerSessao() || {};
      const novoSaldo = (typeof sess.pontos === 'number' ? sess.pontos : (parseInt(sess.moedas) || 0) || 0) - item.preco;
      sess.pontos = novoSaldo;
      gravarSessao(sess);

      const owned = lerOwned();
      if (!owned.includes(item.id)) { owned.push(item.id); gravarOwned(owned); }

      alert(`Compra realizada! Você comprou "${item.nome}".`);
      atualizarSaldoUI();
      gerarGrid();
      mostrarPreview(item, true);
    }
  }

  btnComprarPreview.addEventListener('click', () => { if (!selecionado) return; abrirCompra(selecionado); });

  atualizarSaldoUI();
  gerarGrid();

  window.addEventListener('storage', (ev) => {
    if (ev.key === chaveSessao || ev.key === chaveOwned) {
      atualizarSaldoUI();
      gerarGrid();
    }
  });
});
