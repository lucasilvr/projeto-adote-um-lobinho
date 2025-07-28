// aguarda o conteúdo do DOM ser todo carregado
document.addEventListener('DOMContentLoaded', () => {

    /* funçao que verifica se os dados dos lobos ja foram carregados no localstorage pelo outro script, importante para que sua pagina nao quebre ou tente ser construida antes de ter os dados necessarios*/
    function verificarEIniciar() {
        if (localStorage.getItem('lobos')) {
            // dados foi encontrados, inicia a aplicação
            iniciarAplicacaoPrincipal();
        } else {
            // dados ainda não estão prontos, aguarda 100ms e tenta de novo
            setTimeout(verificarEIniciar, 100);
        }
    }

    function iniciarAplicacaoPrincipal() {
        
        const itens = 4; //apenas 4 itens por página
        let pagina = 1; //guarda a a página inicial do usuario
        let todosOsLobos = JSON.parse(localStorage.getItem('lobos'));  // carrega os dados com segurança pois a verificação já foi feita
        let lobosFiltrados = []; // armazena a lista de lobos após a aplicação dos filtros do usuário

        const containerLobos = document.querySelector('.lista-lobos__grade'); //vai no html e pega a classe .lista-lobos__grade pra quando quisermos desenhar o card do lobo
        const controlePaginacao = document.getElementById('controles-paginacao'); // seleciona a div onde os controles de paginação serão exibidos
        const checkboxAdotados = document.querySelector('.lista-lobos__checkbox-adotados'); // seleciona o checkbox no HTML para filtrar os lobos adotados
        const btnProcurar = document.querySelector('.lista-lobos__botao-busca'); //botao de procurar: para que o script possa saber quando o usuário clica nesse botão para fazer uma busca
        const inputProcurar = document.querySelector('.lista-lobos__input-busca'); //pega o campo de texto que a pessoa digita

        function adicionarEventListeners() {
            btnProcurar.addEventListener('click', aplicarFiltros);  // faz o botão de busca (lupa) executar a função de filtro ao ser clicado
            checkboxAdotados.addEventListener('change', aplicarFiltros); //quando o estado mudar do checkbox, vai chamar o aplicarFiltros
            inputProcurar.addEventListener('keypress', (event) => { //toda vez que alguem pressionar uma tecla, verificar se foi o enter, se for executa a função aplicarFiltros
                if (event.key === 'Enter') aplicarFiltros();
            });
            containerLobos.addEventListener('click', cliqueLobo); //PESQUISEI
            controlePaginacao.addEventListener('click', cliquePaginacao); //toda vez que alguem clica chama a função cliquePaginacao
        }

        function aplicarFiltros() { 
            const verAdotados = checkboxAdotados.checked; //verifica se a caixa "ver lobinhos adotados" está marcada e guarda o resultado (true ou false)
            const termoPesquisa = inputProcurar.value.trim().toLowerCase(); //pega o que o usuario digitou, limpa com o trim e converte  as letras para tudo virar a mesma coisa, seja JADA jada ou Jada
            lobosFiltrados = todosOsLobos.filter(lobo => lobo.adotado === verAdotados); //filtra a lista completa de lobos, mantendo apenas aqueles cujo status 'adotado' é igual ao da checkbox

            if (termoPesquisa) {
                lobosFiltrados = lobosFiltrados.filter(lobo => // filtra de novo a lista (que já foi filtrada pelo status de adoção) para incluir apenas os lobos cujo nome contém o termo pesquisado
                    lobo.nome.toLowerCase().includes(termoPesquisa)
                );
            }
            //reinicializa a visualização para a primeira pagina
            pagina = 1; 
            renderizar(); //função que redesenha os cards
        }

        function renderizar() {
            renderizarLobos(); //limpa a grade de lobos e desenha os cards
            renderizarPaginacao(); //desenha os botoes de paginação
        }

        function renderizarLobos() {
            containerLobos.innerHTML = ''; // apaga todos os cards de lobos que estão na tela para evitar que a lista se acumule a cada renderização
            const inicio = (pagina - 1) * itens; 
            const fim = inicio + itens;
            const itensPagina = lobosFiltrados.slice(inicio, fim);

            const cardTemplate = document.getElementById('card-lobo-template');

            itensPagina.forEach((lobo, index) => {
                const cardClone = cardTemplate.content.cloneNode(true);

                const cardDiv = cardClone.querySelector('.card-lobo');
                const classeDeAlinhamento = index % 2 === 0 ? 'card-lobo--alinhado-inicio' : 'card-lobo--alinhado-fim';
                cardDiv.classList.add(classeDeAlinhamento);

                cardClone.querySelector('.card-lobo__imagem').src = lobo.imagem;
                cardClone.querySelector('.card-lobo__imagem').alt = `Foto de ${lobo.nome}`;
                cardClone.querySelector('.card-lobo__nome').textContent = lobo.nome;
                cardClone.querySelector('.card-lobo__idade').textContent = `Idade: ${lobo.idade} anos`;
                cardClone.querySelector('.card-lobo__descricao p').textContent = lobo.descricao;
                
                const botaoAdotar = cardClone.querySelector('.card-lobo__adotar-botao');
                botaoAdotar.textContent = lobo.adotado ? 'Adotado' : 'Adotar';
                botaoAdotar.dataset.id = lobo.id;
                if (lobo.adotado) {
                    botaoAdotar.disabled = true;
                }
                
                containerLobos.appendChild(cardClone);
            });
        }

        function renderizarPaginacao() {
            controlePaginacao.innerHTML = '';
            const totalPaginas = Math.ceil(lobosFiltrados.length / itens);
            if (totalPaginas <= 1) return;

            if (pagina > 1) {
                controlePaginacao.appendChild(criarBotaoPaginacao('«', pagina - 1));
            }
            const paginasDeContexto = 2;
            let inicio = Math.max(1, pagina - paginasDeContexto);
            let fim = Math.min(totalPaginas, pagina + paginasDeContexto);
            if (inicio > 1) {
                controlePaginacao.appendChild(criarBotaoPaginacao(1));
                if (inicio > 2) controlePaginacao.appendChild(criarReticencias());
            }
            for (let i = inicio; i <= fim; i++) {
                controlePaginacao.appendChild(criarBotaoPaginacao(i));
            }
            if (fim < totalPaginas) {
                if (fim < totalPaginas - 1) controlePaginacao.appendChild(criarReticencias());
                controlePaginacao.appendChild(criarBotaoPaginacao(totalPaginas));
            }
            if (pagina < totalPaginas) {
                controlePaginacao.appendChild(criarBotaoPaginacao('»', pagina + 1));
            }

            function criarBotaoPaginacao(conteudo, irParaPagina = conteudo) {
                const botao = document.createElement('button');
                botao.textContent = conteudo;
                if (irParaPagina === pagina) botao.classList.add('pagina-ativa');
                botao.addEventListener('click', () => {
                    pagina = irParaPagina;
                    renderizar();
                });
                return botao;
            }

            function criarReticencias() {
                const reticencias = document.createElement('span');
                reticencias.textContent = '...';
                return reticencias;
            }
        }

function cliqueLobo(event) {
    const card = event.target.closest('.card-lobo');
    if (card) {
        const botaoAdotar = card.querySelector('.card-lobo__adotar-botao');
        if (botaoAdotar && !botaoAdotar.disabled) {
            const loboId = botaoAdotar.dataset.id;
            window.location.href = `./show/showlobinhos.html/?id=${loboId}`;
        }
    }
}

        function cliquePaginacao(event) {
            const acao = event.target.dataset.acao;
            if (acao === 'anterior') pagina--;
            else if (acao === 'proximo') pagina++;
            renderizar();
        }

        adicionarEventListeners();
        aplicarFiltros();
    }

    verificarEIniciar();
});