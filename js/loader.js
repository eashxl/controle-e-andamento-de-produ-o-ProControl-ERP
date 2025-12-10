// Aguarda todo o HTML da página carregar antes de executar o script
document.addEventListener('DOMContentLoaded', () => {
    
    // Objeto que mapeia o nome do arquivo HTML para o Título que deve aparecer no topo
    const titulosPagina = {
        'principal.html': 'Painel de Produção',
        'item_form.html': 'Gestão de Item'
    };
    
    // Pega o caminho da URL (ex: /pasta/principal.html), divide pelas barras '/' e pega o último item (o nome do arquivo)
    const paginaAtual = window.location.pathname.split('/').pop();
    
    // Busca os elementos vazios no HTML onde vamos injetar o menu e o cabeçalho
    const sidebarPlaceholder = document.getElementById('sidebar-placeholder');
    const headerPlaceholder = document.getElementById('header-placeholder');

    // SE existir um local para a sidebar (menu lateral) nesta página...
    if (sidebarPlaceholder) {
        // ...busca o conteúdo do arquivo 'partials/rodape.html'
        fetch('partials/rodape.html')
            .then(response => response.text()) // Converte a resposta para texto HTML
            .then(data => {
                sidebarPlaceholder.innerHTML = data; // Insere o HTML do menu dentro da div vazia
                
                // Lógica para destacar (deixar ativo) o link do menu correspondente à página atual
                let linkId = '';
                if (paginaAtual === 'principal.html') linkId = 'link-dashboard';
                if (paginaAtual === 'item_form.html') linkId = 'link-novo-item';

                // Se identificamos qual link deve acender e ele existe, adicionamos a classe CSS 'active'
                if (linkId && document.getElementById(linkId)) {
                    document.getElementById(linkId).classList.add('active');
                }
            });
    }

    // SE existir um local para o cabeçalho (topo) nesta página...
    if (headerPlaceholder) {
        // ...busca o conteúdo do arquivo 'partials/cabecalho.html'
        fetch('partials/cabecalho.html')
            .then(response => response.text())
            .then(data => {
                headerPlaceholder.innerHTML = data; // Insere o HTML do cabeçalho
                
                // Define o texto do H1 no cabeçalho baseando-se no objeto 'titulosPagina' criado lá em cima
                // Se não achar (||), usa 'Dashboard' como padrão
                document.getElementById('titulo-pagina').textContent = titulosPagina[paginaAtual] || 'Dashboard';

                // Lógica de Logout (Sair)
                // Adiciona um evento de clique na área do usuário (onde diz "Sair")
                document.querySelector('.user-info').addEventListener('click', () => {
                    sessionStorage.removeItem('usuario_logado'); // Remove a "chave" que diz que o usuário está logado
                    window.location.href = 'login.html'; // Manda o usuário de volta para o login
                });
            });
    }
});