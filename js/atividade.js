// js/atividade.js
// Lógica em português para página de Atividades:
// - troca de painel quando o usuário clica na lista lateral
// - quiz de Crase com perguntas, envio, validação, pontuação e armazenamento em localStorage
// - mostra progresso global simples (porcentagem de atividades concluídas)

document.addEventListener('DOMContentLoaded', () => {
  const STORAGE_KEY_PROGRESS = 'lingua_activity_progress_v1';

  /* -------------------------
     TROCA DE ATIVIDADE (SIDEBAR)
     -------------------------*/
  const botoesAtividade = document.querySelectorAll('.atividade-btn');
  const paines = document.querySelectorAll('.atividade-card');
  botoesAtividade.forEach(btn => {
    btn.addEventListener('click', () => {
      const alvoId = btn.getAttribute('data-target');
      // desmarca todos
      botoesAtividade.forEach(b => b.classList.remove('atividade-ativa'));
      paines.forEach(p => p.classList.add('hidden'));
      // ativa o selecionado
      btn.classList.add('atividade-ativa');
      const alvo = document.getElementById(alvoId);
      if (alvo) alvo.classList.remove('hidden');
      // foco no primeiro elemento da atividade
      const firstFocusable = alvo.querySelector('button, input, textarea, a');
      if (firstFocusable) firstFocusable.focus();
    });
  });

  /* -------------------------
     DADOS / QUESTÕES: CRACE
     -------------------------*/
  // Exemplo de questões; você pode adicionar mais ou puxar de API
  const questoesCrase = [
    {
      enunciado: 'Vou ___ escola amanhã.',
      alternativas: ['a', 'à', 'ao', 'às'],
      correta: 1, // índice da alternativa correta (0-based)
      explicacao: 'Aqui usa-se "à escola" (a + a = à) — crase exigida antes de substantivo feminino determinado.'
    },
    {
      enunciado: 'Referi-me ___ aluna durante a reunião.',
      alternativas: ['à', 'a', 'ao', 'às'],
      correta: 0,
      explicacao: 'Verbo "referir-se" exige "a", com artigo "a" => crase (à aluna).'
    },
    {
      enunciado: 'Entreguei o livro ___ professora titular.',
      alternativas: ['a', 'à', 'ao', 'às'],
      correta: 1,
      explicacao: 'Antes de "professora" (feminino com artigo) há crase: "à professora".'
    }
  ];

  /* -------------------------
     RENDERIZAÇÃO DO FORMULÁRIO DE CRASE
     -------------------------*/
  const containerPerguntas = document.getElementById('perguntasCrase');

  function renderizarQuestoes() {
    containerPerguntas.innerHTML = ''; // limpa
    questoesCrase.forEach((q, i) => {
      const bloco = document.createElement('div');
      bloco.className = 'pergunta';
      bloco.innerHTML = `
        <div class="mb-2 font-semibold">Questão ${i+1}</div>
        <div class="mb-2">${q.enunciado.replace('___', '<strong>_____</strong>')}</div>
        <div role="radiogroup" aria-labelledby="q${i}-label" class="space-y-2">
          ${q.alternativas.map((alt, j) => {
            return `
              <label class="alternativa" data-q="${i}" data-alt="${j}">
                <input class="input-radio" type="radio" name="q${i}" value="${j}" />
                <span class="ml-2">${alt}</span>
              </label>
            `;
          }).join('')}
        </div>
      `;
      containerPerguntas.appendChild(bloco);
    });
  }

  renderizarQuestoes();

  /* -------------------------
     ENVIO E VALIDAÇÃO DO QUIZ DE CRASE
     -------------------------*/
  const formCrase = document.getElementById('formCrase');
  const resultadoCrase = document.getElementById('resultadoCrase');
  const btnRefazer = document.getElementById('btnRefazerCrase');

  function salvarProgresso(atividadeId, data) {
    try {
      const raw = localStorage.getItem(STORAGE_KEY_PROGRESS);
      const obj = raw ? JSON.parse(raw) : {};
      obj[atividadeId] = data;
      localStorage.setItem(STORAGE_KEY_PROGRESS, JSON.stringify(obj));
      atualizarProgressoGlobal();
    } catch (e) { console.warn('Erro salvando progresso', e); }
  }

  function carregarProgresso() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY_PROGRESS) || '{}');
    } catch (e) {
      return {};
    }
  }

  formCrase.addEventListener('submit', (ev) => {
    ev.preventDefault();
    // coleta respostas
    const respostas = [];
    let todasRespondidas = true;
    questoesCrase.forEach((q, i) => {
      const escolha = formCrase.querySelector(`input[name="q${i}"]:checked`);
      if (escolha) respostas[i] = Number(escolha.value);
      else { todasRespondidas = false; respostas[i] = null; }
    });

    if (!todasRespondidas) {
      alert('Por favor, responda todas as questões antes de enviar.');
      return;
    }

    // checa e marca visualmente
    let acertos = 0;
    questoesCrase.forEach((q, i) => {
      const bloco = containerPerguntas.children[i];
      const alternativas = bloco.querySelectorAll('.alternativa');
      alternativas.forEach(label => {
        const altIndex = Number(label.getAttribute('data-alt'));
        label.classList.remove('correta', 'errada');
        // se for a alternativa correta
        if (altIndex === q.correta) {
          label.classList.add('correta');
        }
        // se foi a alternativa escolhida e estiver errada
        const input = label.querySelector('input');
        if (input.checked && altIndex !== q.correta) {
          label.classList.add('errada');
        }
        if (input.checked && altIndex === q.correta) {
          acertos++;
        }
      });

      // adiciona explicação se quiser (aparece abaixo da pergunta)
      let explicEl = bloco.querySelector('.explicacao');
      if (!explicEl) {
        explicEl = document.createElement('div');
        explicEl.className = 'explicacao text-sm text-gray-600 dark:text-gray-400 mt-2';
        bloco.appendChild(explicEl);
      }
      explicEl.textContent = `Explicação: ${q.explicacao}`;
    });

    // resultado
    resultadoCrase.textContent = `Acertos: ${acertos} / ${questoesCrase.length} — ${(acertos/questoesCrase.length*100).toFixed(0)}%`;
    // salvar progresso: por simplicidade guardamos acertos e total
    salvarProgresso('crase', { acertos, total: questoesCrase.length, data: Date.now() });

    // bloquear form para evitar reenvio até "refazer"
    formCrase.querySelectorAll('input').forEach(i => i.disabled = true);
    document.getElementById('btnEnviarCrase').disabled = true;
  });

  // botão refazer: limpa seleções e marcações
  btnRefazer.addEventListener('click', () => {
    formCrase.reset();
    containerPerguntas.querySelectorAll('.alternativa').forEach(a => a.classList.remove('correta', 'errada'));
    containerPerguntas.querySelectorAll('.explicacao').forEach(e => e.remove());
    resultadoCrase.textContent = '';
    formCrase.querySelectorAll('input').forEach(i => i.disabled = false);
    document.getElementById('btnEnviarCrase').disabled = false;
  });

  /* -------------------------
     PROGRESSO GLOBAL
     -------------------------*/
  function atualizarProgressoGlobal() {
    const progresso = carregarProgresso();
    // Consideramos cada atividade com chave salva como "completa" se acertos == total
    const atividades = ['crase', 'acentuacao', 'concordancia'];
    let completados = 0;
    atividades.forEach(chave => {
      const item = progresso[chave];
      if (item && typeof item.acertos === 'number' && item.acertos === item.total) completados++;
    });
    const pct = Math.round((completados / atividades.length) * 100);
    const barra = document.getElementById('progressoGlobalBar');
    const texto = document.getElementById('progressoGlobalText');
    if (barra) barra.style.width = `${pct}%`;
    if (texto) texto.textContent = `${pct}% completado`;
  }

  // inicializa progresso (ao carregar a página)
  atualizarProgressoGlobal();

  /* -------------------------
     ACESSIBILIDADE: permitir clicar no label para marcar radio
     -------------------------*/
  containerPerguntas.addEventListener('click', (ev) => {
    const alvo = ev.target.closest('.alternativa');
    if (!alvo) return;
    const input = alvo.querySelector('input[type="radio"]');
    if (input && !input.disabled) input.checked = true;
  });

  /* -------------------------
     INICIALIZAÇÃO: botão ativo inicial
     -------------------------*/
  // garante que a primeira atividade esteja visível
  (function ativarInicial() {
    const inicialBtn = document.querySelector('.atividade-btn');
    if (inicialBtn) inicialBtn.click();
  })();

});
