// js/auth.js

// Tenta ler o item 'usuario_logado' da memória temporária do navegador (SessionStorage)
const usuarioEstaLogado = sessionStorage.getItem('usuario_logado');

// Verifica se o valor NÃO é a string 'true'
if (usuarioEstaLogado !== 'true') {
    // Se não for 'true', avisa o usuário
    alert('Acesso negado! Por favor, faça o login primeiro.');
    // E redireciona imediatamente para a tela de login
    window.location.href = 'login.html';
}