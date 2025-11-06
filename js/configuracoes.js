// configuracoes.js
// Comentários em português explicando cada parte do código.
// Salva/recupera preferências do usuário via localStorage (chave: 'lingua_settings').

// Ao carregar DOM, inicializa
document.addEventListener('DOMContentLoaded', () => {
  const STORAGE_KEY = 'lingua_settings';

  // elementos principais
  const btnVoltar = document.getElementById('btnVoltar');
  const btnSalvar = document.getElementById('btnSalvar');
  const toast = document.getElementById('toast');

  // inputs (notificações)
  const toggleTodas = document.getElementById('toggleTodas');
  const notifLembretes = document.getElementById('notif-lembretes');
  const notifMissoes = document.getElementById('notif-missoes');
  const notifMensagens = document.getElementById('notif-mensagens');

  // audio
  const musicVolume = document.getElementById('music-volume');
  const sfxVolume = document.getElementById('sfx-volume');

  // acessibilidade
  const radioFont = Array.from(document.querySelectorAll('input[name="font-size"]'));
  const altoContraste = document.getElementById('alto-contraste');

  // Carrega configurações do localStorage e aplica à UI
  function carregarConfiguracoes() {
    let cfg = null;
    try {
      cfg = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
    } catch (e) {
      console.warn('Erro ao parsear configurações:', e);
      cfg = {};
    }

    // Notificações
    if (typeof cfg.todasNotificacoes === 'boolean') toggleTodas.checked = cfg.todasNotificacoes;
    if (typeof cfg.lembretes === 'boolean') notifLembretes.checked = cfg.lembretes;
    if (typeof cfg.missoes === 'boolean') notifMissoes.checked = cfg.missoes;
    if (typeof cfg.mensagens === 'boolean') notifMensagens.checked = cfg.mensagens;

    // Áudio
    if (typeof cfg.musicVolume === 'number') musicVolume.value = cfg.musicVolume;
    if (typeof cfg.sfxVolume === 'number') sfxVolume.value = cfg.sfxVolume;

    // Acessibilidade
    if (cfg.fontSize) {
      const radio = document.querySelector(`input[name="font-size"][value="${cfg.fontSize}"]`);
      if (radio) radio.checked = true;
      aplicarTamanhoFonte(cfg.fontSize);
    } else {
      aplicarTamanhoFonte('medium');
    }

    if (typeof cfg.altoContraste === 'boolean') {
      altoContraste.checked = cfg.altoContraste;
      aplicarAltoContraste(cfg.altoContraste);
    }
  }

  // Aplica o tamanho de fonte no root (adiciona classes para fácil estilização)
  function aplicarTamanhoFonte(size) {
    const root = document.documentElement;
    root.classList.remove('font-small', 'font-medium', 'font-large');
    if (size === 'small') root.classList.add('font-small');
    else if (size === 'large') root.classList.add('font-large');
    else root.classList.add('font-medium');

    // Exemplo rápido: ajustar escala via CSS custom (você pode ajustar no CSS global)
    if (size === 'small') root.style.fontSize = '14px';
    else if (size === 'large') root.style.fontSize = '18px';
    else root.style.fontSize = '16px';
  }

  // Aplica (liga/desliga) modo de alto contraste
  function aplicarAltoContraste(on) {
    const root = document.documentElement;
    if (on) root.classList.add('alto-contraste');
    else root.classList.remove('alto-contraste');
  }

  // Salva configurações no localStorage
  function salvarConfiguracoes() {
    const cfg = {
      todasNotificacoes: !!toggleTodas.checked,
      lembretes: !!notifLembretes.checked,
      missoes: !!notifMissoes.checked,
      mensagens: !!notifMensagens.checked,
      musicVolume: Number(musicVolume.value),
      sfxVolume: Number(sfxVolume.value),
      fontSize: (document.querySelector('input[name="font-size"]:checked') || { value: 'medium' }).value,
      altoContraste: !!altoContraste.checked
    };

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cfg));
      mostrarToast('Configurações salvas com sucesso!');
    } catch (e) {
      console.error('Erro ao salvar configurações:', e);
      mostrarToast('Erro ao salvar. Tente novamente.');
    }

    // aplica imediatamente as mudanças visuais
    aplicarTamanhoFonte(cfg.fontSize);
    aplicarAltoContraste(cfg.altoContraste);
  }

  // Mostra um toast simples por 2.5s
  function mostrarToast(msg) {
    if (!toast) return;
    toast.textContent = msg;
    toast.classList.remove('hidden');
    clearTimeout(toast._timer);
    toast._timer = setTimeout(() => {
      toast.classList.add('hidden');
    }, 2500);
  }

  // Eventos
  btnVoltar.addEventListener('click', () => {
    // comportamento padrão: volta para a página anterior
    // se quiser direcionar a uma rota específica, substitua por window.location.href = '../html/home.html';
    window.history.back();
  });

  btnSalvar.addEventListener('click', (ev) => {
    ev.preventDefault();
    salvarConfiguracoes();
  });

  // Quando o toggle "todas" é alterado, atualiza checkboxes filhos (comportamento esperado)
  toggleTodas.addEventListener('change', () => {
    const checked = toggleTodas.checked;
    notifLembretes.checked = checked;
    notifMissoes.checked = checked;
    notifMensagens.checked = checked;
  });

  // Aplica alto contraste ao alterar
  altoContraste.addEventListener('change', () => aplicarAltoContraste(altoContraste.checked));

  // Radios de fonte: quando mudar, já aplica
  radioFont.forEach(r => r.addEventListener('change', () => aplicarTamanhoFonte(r.value)));

  // Carrega as configuracoes ao iniciar
  carregarConfiguracoes();
});
