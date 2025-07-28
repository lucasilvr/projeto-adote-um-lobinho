async function inicializarLocalStorage() {
    try {
        // Determina o caminho correto baseado na localização atual
        const path = window.location.pathname;
        const caminhoJson = path.includes('/lista-de-lobinhos/') ? '../lobinhos.json' : 'lobinhos.json';
        
        const response = await fetch(caminhoJson);
        if (!response.ok) {
            throw new Error(`Erro ao buscar lobinho.json: ${response.statusText}`);
        }
        const lobos = await response.json();
        localStorage.setItem('lobos', JSON.stringify(lobos));
        console.log('Lobos inicializados no localStorage');
    } catch (error) {
        console.error('Erro ao inicializar o localStorage:', error);
    } finally {
        console.log('Tentativa de inicialização do localStorage concluída');
    }
}

if (!localStorage.getItem('lobos')) {
    inicializarLocalStorage().then(() => {
        console.log('Inicialização do localStorage concluída');
    }).catch(error => {
        console.error('Erro durante a inicialização do localStorage:', error);
    });
}