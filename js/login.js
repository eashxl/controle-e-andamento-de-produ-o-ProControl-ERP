// --- Lógica de Autenticação para login.html ---
const loginForm = document.getElementById('login-form');
const usernameInput = document.getElementById('username');
const passwordInput = document.getElementById('password');
const mensagemErro = document.getElementById('mensagem-erro');

loginForm.addEventListener('submit', function(event) {
    event.preventDefault();
    const usuario = usernameInput.value.trim();
    const senha = passwordInput.value.trim();

    // --- MUDANÇA: Aceita qualquer login que não esteja vazio ---
    if (usuario !== '' && senha !== '') {
        // Usa sessionStorage para forçar o login a cada nova sessão
        sessionStorage.setItem('usuario_logado', 'true');
        window.location.href = 'index.html'; 
    } else {
        mensagemErro.textContent = 'Usuário ou senha inválidos. Tente novamente.';
        passwordInput.value = ''; 
    }
});

document.addEventListener('DOMContentLoaded', () => {
    // Se já estiver logado (na sessão), redireciona
    if (sessionStorage.getItem('usuario_logado') === 'true') {
        window.location.href = 'index.html';
    }
});