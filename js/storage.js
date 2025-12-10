// --- FUNÇÕES DE DADOS (LocalStorage) ---
function carregarItens() {
    const itensSalvos = localStorage.getItem('itensProducaoERP');
    return itensSalvos ? JSON.parse(itensSalvos) : [];
}

function salvarItens(itens) {
    localStorage.setItem('itensProducaoERP', JSON.stringify(itens));
}

// --- FUNÇÕES DE CÁLCULO E FORMATAÇÃO (Helpers) ---
function calcularDiasRestantes(prazoString) {
    const [ano, mes, dia] = prazoString.split('-');
    const dataPrazo = new Date(ano, mes - 1, dia); 
    dataPrazo.setHours(23, 59, 59, 999); 
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0); 
    const diferencaTempo = dataPrazo.getTime() - hoje.getTime();
    return Math.ceil(diferencaTempo / (1000 * 3600 * 24));
}

function formatarData(dataString) {
    const [ano, mes, dia] = dataString.split('-');
    return `${dia}/${mes}/${ano}`;
}

// --- FUNÇÕES DE DADOS DE DEMONSTRAÇÃO ---
function calcularDataDemo(dias) {
    const data = new Date();
    data.setDate(data.getDate() + dias);
    return data.toISOString().split('T')[0];
}

function popularDadosDemo() {
    if (carregarItens().length === 0) {
        const dadosDemo = [
            { id: 1678886401, nome: "Componente Alfa (Atrasado)", total: 100, produzido: 50, prazo: calcularDataDemo(-5) },
            { id: 1678886402, nome: "Chassi Beta (Alerta de Prazo)", total: 50, produzido: 10, prazo: calcularDataDemo(3) },
            { id: 1678886403, nome: "Serviço de Montagem (Em dia)", total: 200, produzido: 150, prazo: calcularDataDemo(30) },
            { id: 1678886404, nome: "Produto Gamar (Concluído)", total: 80, produzido: 80, prazo: calcularDataDemo(15) }
        ];
        salvarItens(dadosDemo);
    }
}