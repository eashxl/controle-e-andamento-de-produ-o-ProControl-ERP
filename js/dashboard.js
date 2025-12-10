// --- LÓGICA DA PÁGINA "PRINCIPAL.HTML" ---

// Seleciona o corpo da tabela onde as linhas serão inseridas
const tabelaBody = document.querySelector('.tabela-producao tbody');
// Seleciona o container onde ficam os cards coloridos (métricas)
const metricasContainer = document.querySelector('.metricas');
// Seleciona todos os cards individuais
const cards = document.querySelectorAll('.metricas .card'); 
// Variável de estado para saber qual filtro está ativo (padrão: mostrar tudo)
let filtroAtivo = 'all'; 
// Lista em memória que guardará os itens carregados (array vazio inicialmente)
let itensProducao = []; 

// --- AÇÕES (CRUD - Create, Read, Update, Delete) ---

// Função chamada ao clicar no botão "+1 Uni"
function incrementarProducao(id) {
    // Procura na lista o item que tem o ID clicado
    const item = itensProducao.find(item => item.id === id);
    // Se achou o item E a produção atual for menor que o total
    if (item && item.produzido < item.total) {
        item.produzido++; // Aumenta 1 unidade
        salvarItens(itensProducao); // Salva no LocalStorage (Função do arquivo storage.js - FALTANDO)
        renderizarSistema(); // Atualiza a tela toda
    }
}

// Função chamada ao clicar no botão "X" (Remover)
function removerItem(id) {
    const item = itensProducao.find(item => item.id === id);
    // Pede confirmação ao usuário antes de apagar
    const confirmar = confirm(`Tem certeza que deseja remover o item "${item.nome}"?`);
    if (confirmar) {
        // Cria uma nova lista EXCLUINDO o item que tem esse ID
        itensProducao = itensProducao.filter(item => item.id !== id);
        salvarItens(itensProducao); // Salva a nova lista
        renderizarSistema(); // Atualiza a tela
    }
}

// *** FUNÇÃO DO BOTÃO "EDITAR" ***
function abrirFormularioEdicao(id) {
    // 1. Salva o ID que queremos editar no localStorage para sobreviver à mudança de página
    localStorage.setItem('editItemId', id);
    
    // 2. Navega para a página do formulário
    window.location.href = 'item_form.html';
}

// --- LÓGICA DE FILTRAGEM (Ao clicar nos cards) ---
function aplicarFiltro(tipoFiltro) {
    filtroAtivo = tipoFiltro; // Atualiza a variável global
    // Loop para atualizar visualmente qual card está selecionado
    cards.forEach(card => {
        card.classList.remove('active-filter'); // Remove destaque de todos
        if (card.getAttribute('data-filter') === tipoFiltro) {
            card.classList.add('active-filter'); // Adiciona destaque só no clicado
        }
    });
    renderizarTabela(); // Redesenha a tabela com o novo filtro
}

// --- RENDERIZAÇÃO (Desenhar na tela) ---
function renderizarTabela() {
    tabelaBody.innerHTML = ''; // Limpa a tabela atual para não duplicar linhas
    let listaFiltrada; // Variável auxiliar

    // 1. Bloco de IF/ELSE para decidir quais itens mostrar baseado no 'filtroAtivo'
    if (filtroAtivo === 'concluido') {
        listaFiltrada = itensProducao.filter(item => item.produzido === item.total);
    } else if (filtroAtivo === 'andamento') {
        listaFiltrada = itensProducao.filter(item => {
            // calcularDiasRestantes vem de storage.js (FALTANDO)
            const dias = calcularDiasRestantes(item.prazo);
            // Mostra se não acabou E o prazo ainda não estourou (>=0)
            return item.produzido < item.total && dias >= 0; 
        });
    } else if (filtroAtivo === 'alerta') {
         listaFiltrada = itensProducao.filter(item => {
            const dias = calcularDiasRestantes(item.prazo);
            // Mostra se faltam 5 dias ou menos
            return item.produzido < item.total && dias <= 5 && dias >= 0; 
        });
    } else {
         listaFiltrada = itensProducao; // Se filtro for 'all', mostra tudo
    }

    // 2. Ordenação da lista (Lógica visual complexa)
    const itensOrdenados = listaFiltrada.sort((a, b) => {
        const progA = a.produzido / a.total; // Calcula % item A
        const progB = b.produzido / b.total; // Calcula % item B
        
        // Coloca os concluídos (100%) no final da lista
        if (progA === 1 && progB < 1) return 1; 
        if (progA < 1 && progB === 1) return -1; 
        // Se ambos não terminaram, ordena por quem tem o prazo mais próximo
        return calcularDiasRestantes(a.prazo) - calcularDiasRestantes(b.prazo);
    });
    
    // Se a lista estiver vazia, mostra mensagem amigável
    if (itensOrdenados.length === 0) {
        tabelaBody.innerHTML = `<tr><td colspan="9" style="text-align: center; padding: 30px;">Nenhum item encontrado.</td></tr>`;
        return;
    }

    // 3. Loop para criar o HTML de cada linha (tr)
    itensOrdenados.forEach(item => {
        // Cálculos visuais
        const progresso = item.produzido / item.total;
        const progressoPercentual = (progresso * 100).toFixed(0);
        const diasRestantes = calcularDiasRestantes(item.prazo);
        
        // Variáveis para guardar classes CSS e HTMLs dinâmicos
        let statusTag, progressoClass, linhaClass = '';
        
        // Botões padrão
        let acaoBtnProgresso = `<button class="btn btn-view" onclick="incrementarProducao(${item.id})">+1 Uni</button>`;
        let acaoBtnEditar = `<button class="btn btn-edit" onclick="abrirFormularioEdicao(${item.id})">Editar</button>`;
        let acaoBtnRemover = `<button class="btn btn-danger" onclick="removerItem(${item.id})">X</button>`; 

        // Lógica de Cores e Status
        if (progresso === 1) {
            statusTag = `<span class="tag tag-success">Completo</span>`;
            progressoClass = 'concluido';
            linhaClass = 'status-concluido';
            // Desabilita botões se completou
            acaoBtnProgresso = `<button class="btn btn-view" disabled>Completo</button>`;
            acaoBtnEditar = `<button class="btn btn-edit" disabled>Editar</button>`;
        } else if (diasRestantes < 0) {
            // Se atrasou
             statusTag = `<span class="tag tag-danger">ATRASADO (${Math.abs(diasRestantes)} dias)</span>`;
            progressoClass = 'atrasado';
            linhaClass = 'status-danger'; 
        } else if (diasRestantes <= 5) {
            // Se está perto do prazo
            statusTag = `<span class="tag tag-warning">Alerta Prazo (${diasRestantes} dias)</span>`;
            progressoClass = 'alerta';
            linhaClass = 'status-alerta';
        } else {
            // Normal
            statusTag = `<span class="tag tag-info">Em Produção</span>`;
            progressoClass = 'andamento';
            linhaClass = 'status-em-andamento';
        }

        // Cria a linha da tabela
        const row = tabelaBody.insertRow();
        row.className = linhaClass; // Aplica cor de fundo se necessário
        
        // Preenche as colunas com Template String
        // Nota: formatarData() vem de storage.js (FALTANDO)
        row.innerHTML = `
            <td>#${item.id.toString().slice(-4)}</td> 
            <td>${item.nome}</td>
            <td>
                <div class="progresso-bar">
                    <div class="progresso-fill ${progressoClass}" style="width: ${progressoPercentual}%;">
                        ${progressoPercentual > 10 ? progressoPercentual + '%' : ''}
                    </div>
                </div>
            </td>
            <td>${item.produzido} / ${item.total}</td>
            <td>${formatarData(item.prazo)}</td>
            <td>${statusTag}</td>
            <td>${acaoBtnProgresso}</td>
            <td>${acaoBtnEditar}</td>
            <td>${acaoBtnRemover}</td> 
        `;
    });
}

// Atualiza os números nos Cards do topo
function renderizarMetricas() {
    const totalItens = itensProducao.length;
    // Conta quantos itens têm produzido == total
    const concluidos = itensProducao.filter(item => item.produzido === item.total).length;
    const emAndamento = totalItens - concluidos;
    // Conta quantos estão perto do prazo
    const proximoPrazo = itensProducao.filter(item => {
        const dias = calcularDiasRestantes(item.prazo);
        return item.produzido < item.total && dias <= 5 && dias >= 0;
    }).length;

    // Atualiza o texto HTML dos cards
    metricasContainer.querySelector('.card-total h3').textContent = totalItens;
    metricasContainer.querySelector('.card-concluido h3').textContent = concluidos;
    metricasContainer.querySelector('.card-andamento h3').textContent = emAndamento;
    metricasContainer.querySelector('.card-atrasado h3').textContent = proximoPrazo;
}

// Função "Maestro": chama as funções na ordem certa
function renderizarSistema() {
    itensProducao = carregarItens(); // Busca do LocalStorage (storage.js)
    renderizarMetricas(); // Calcula números
    renderizarTabela(); // Desenha tabela
}

// --- INICIALIZAÇÃO DA PÁGINA ---
document.addEventListener('DOMContentLoaded', () => {
    popularDadosDemo(); // Se estiver vazio, cria dados falsos (storage.js)
    renderizarSistema();

    // Adiciona evento de clique nos cards para filtrar
    cards.forEach(card => {
        card.addEventListener('click', function(event) {
            event.preventDefault(); // Evita que a página recarregue
            const tipoFiltro = this.getAttribute('data-filter');
            aplicarFiltro(tipoFiltro);
        });
    });

    // Se houver o link "Novo Item", garante que clicando nele limpamos o modo de edição
    const linkNovo = document.getElementById('link-novo-item');
    if(linkNovo) {
        linkNovo.addEventListener('click', (e) => {
            localStorage.removeItem('editItemId');
        });
    }
});