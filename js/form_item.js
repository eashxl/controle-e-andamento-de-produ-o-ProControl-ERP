// --- LÓGICA DA PÁGINA "ITEM_FORM.HTML" ---

// Referências aos elementos HTML (Inputs e Botões)
const inputNome = document.getElementById('nome-item');
const inputQtdTotal = document.getElementById('qtd-total');
const inputDataPrazo = document.getElementById('data-prazo');
const btnSalvar = document.getElementById('btn-salvar-novo-item');
const mensagemErroForm = document.getElementById('mensagem-erro-form');
const formItemTitulo = document.getElementById('form-item-titulo');
const editItemIdField = document.getElementById('edit-item-id'); // O campo hidden (invisível)

// --- INICIALIZAÇÃO DO FORMULÁRIO ---
document.addEventListener('DOMContentLoaded', () => {
    // 1. Verifica se o dashboard.js deixou algum recado (ID para editar)
    const idParaEditar = localStorage.getItem('editItemId');
    
    if (idParaEditar) {
        // --- MODO DE EDIÇÃO ---
        const itensProducao = carregarItens(); // carregarItens() vem de storage.js (FALTANDO)
        const item = itensProducao.find(item => item.id == idParaEditar);
        
        if (item) {
            // 2. Preenche os campos com os dados existentes
            editItemIdField.value = item.id;
            inputNome.value = item.nome;
            inputQtdTotal.value = item.total;
            inputDataPrazo.value = item.prazo;
            
            // 3. Muda visualmente a página para parecer "Edição"
            formItemTitulo.textContent = 'Editar Item de Produção';
            btnSalvar.textContent = 'Atualizar Item';
            mensagemErroForm.textContent = `Editando item: ${item.nome}`;
        }
        
        // 4. Limpa o localStorage para que, se recarregar a página, não fique preso na edição
        localStorage.removeItem('editItemId');
        
    } else {
        // --- MODO DE CRIAÇÃO (Padrão) ---
        formItemTitulo.textContent = 'Adicionar Novo Item';
        btnSalvar.textContent = 'Salvar Item';
    }
    
    // Habilita o botão
    btnSalvar.disabled = false;
});


// --- BOTÃO SALVAR (Lida com Criar E Atualizar) ---
btnSalvar.addEventListener('click', function(event) {
    event.preventDefault(); // Impede o formulário de recarregar a página padrão
    
    const idParaEditar = editItemIdField.value; // Verifica se tem ID no campo escondido
    
    // 1. Pega os valores digitados
    const nome = inputNome.value.trim();
    const quantidadeTotal = parseInt(inputQtdTotal.value);
    const prazo = inputDataPrazo.value;

    // 2. Validação simples
    if (!nome || isNaN(quantidadeTotal) || quantidadeTotal <= 0 || !prazo) {
        mensagemErroForm.textContent = 'Por favor, preencha todos os campos corretamente.';
        return;
    }
    
    let itensProducao = carregarItens();
    
    if (idParaEditar) {
        // --- LÓGICA DE UPDATE (Atualizar) ---
        // Encontra a posição do item na lista
        const itemIndex = itensProducao.findIndex(item => item.id == idParaEditar);
        if (itemIndex > -1) {
            // Atualiza os dados desse item específico
            const item = itensProducao[itemIndex];
            item.nome = nome;
            item.total = quantidadeTotal;
            item.prazo = prazo;
            
            salvarItens(itensProducao); // Salva no LocalStorage
            alert(`Item "${item.nome}" atualizado com sucesso!`);
        }
    } else {
        // --- LÓGICA DE CREATE (Criar) ---
        const novoItem = {
            id: Date.now(), // Gera um ID único baseado na hora atual (timestamp)
            nome: nome,
            total: quantidadeTotal,
            produzido: 0, // Começa com 0 produzido
            prazo: prazo
        };
        itensProducao.push(novoItem); // Adiciona na lista
        salvarItens(itensProducao); // Salva
        alert(`Item "${novoItem.nome}" cadastrado com sucesso!`);
    }

    // 3. Redireciona de volta para o dashboard
    window.location.href = 'principal.html'; 
});