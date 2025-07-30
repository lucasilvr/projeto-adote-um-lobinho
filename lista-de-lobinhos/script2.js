//isso aqui foi necessario porque tava dando problema no carregamento da pagina, ou seja, o codigo todo é executado quando o DOM estiver pronto
document.addEventListener("DOMContentLoaded", () => {
//junto foi preciso fazer essa função pois no carregamento da pagina estava dando erro
function verificarEIniciar() {
        if (localStorage.getItem('lobos')) {
            // dados foi encontrados, inicia a aplicação
            iniciarAplicacaoPrincipal();
        } else {
            // dados ainda não estão prontos, aguarda 100ms e tenta de novo
            setTimeout(verificarEIniciar, 100);
        }
    }

iniciarAplicacaoPrincipal();

function iniciarAplicacaoPrincipal() {
    const itens = 4;
    let pagina = 1;
    let todosOsLobos = JSON.parse(localStorage.getItem("lobos")) || [];
    let lobosFiltrados = [];

    const containerLobos = document.querySelector(".lista-lobos__grade");
    const controlePaginacao = document.getElementById("controles-paginacao");
    const checkboxAdotados = document.querySelector(
        ".lista-lobos__checkbox-adotados"
    );
    const btnProcurar = document.querySelector(".lista-lobos__botao-busca");
    const inputProcurar = document.querySelector(".lista-lobos__input-busca");

    function adicionarEventListeners() {
        btnProcurar.addEventListener("click", aplicarFiltros);
        checkboxAdotados.addEventListener("change", aplicarFiltros);
        inputProcurar.addEventListener("keypress", (event) => {
            if (event.key === "Enter") aplicarFiltros();
        });
        containerLobos.addEventListener("click", cliqueLobo);
        controlePaginacao.addEventListener("click", cliquePaginacao);
    }

    function aplicarFiltros() {
        const verAdotados = checkboxAdotados.checked;
        const termoPesquisa = inputProcurar.value.trim().toLowerCase();
        lobosFiltrados = todosOsLobos.filter(
            (lobo) => lobo.adotado === verAdotados
        );

        if (termoPesquisa) {
            lobosFiltrados = lobosFiltrados.filter((lobo) =>
                lobo.nome.toLowerCase().includes(termoPesquisa)
            );
        }
        pagina = 1;
        renderizar();
    }

    function renderizar() {
        renderizarLobos();
        renderizarPaginacao();
    }

    function renderizarLobos() {
        containerLobos.innerHTML = "";
        const inicio = (pagina - 1) * itens;
        const fim = inicio + itens;
        const itensPagina = lobosFiltrados.slice(inicio, fim);

        itensPagina.forEach((lobo, index) => {
            const classeDeAlinhamento =
                index % 2 === 0
                    ? "card-lobo--alinhado-inicio"
                    : "card-lobo--alinhado-fim";
            const textoBotao = lobo.adotado ? "Adotado" : "Adotar";
            const estadoBotao = lobo.adotado ? "disabled" : "";

            const cardHtml = `
                <div class="card-lobo ${classeDeAlinhamento}">
                    <div class="card-lobo__container-imagem">
                        <img class="card-lobo__imagem" src="${lobo.imagem}"/>
                    </div>
                    <div class="card-lobo__info">
                        <div class="card-lobo__cabecalho">
                            <div class="card-lobo__detalhes">
                                <h2 class="card-lobo__nome">${lobo.nome}</h2>
                                <p class="card-lobo__idade">Idade: ${lobo.idade} anos</p>
                            </div>
                            <div class="card-lobo__acoes">
                                <button class="card-lobo__adotar-botao" data-id="${lobo.id}" ${estadoBotao}>
                                    ${textoBotao}
                                </button> 
                            </div>
                        </div>
                        <div class="card-lobo__descricao">
                            <p>${lobo.descricao}</p>
                        </div>
                    </div>
                </div>
            `;
            containerLobos.insertAdjacentHTML("beforeend", cardHtml);
        });
    }

    function renderizarPaginacao() {
        controlePaginacao.innerHTML = "";
        const totalPaginas = Math.ceil(lobosFiltrados.length / itens);
        if (totalPaginas <= 1) return;

        if (pagina > 1) {
            controlePaginacao.appendChild(criarBotaoPaginacao("<<", pagina - 1));
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
            if (fim < totalPaginas - 1)
                controlePaginacao.appendChild(criarReticencias());
            controlePaginacao.appendChild(criarBotaoPaginacao(totalPaginas));
        }
        if (pagina < totalPaginas) {
            controlePaginacao.appendChild(criarBotaoPaginacao(">>", pagina + 1));
        }

        function criarBotaoPaginacao(conteudo, irParaPagina = conteudo) {
            const botao = document.createElement("button");
            botao.textContent = conteudo;
            if (irParaPagina === pagina) botao.classList.add("pagina-ativa");
            botao.addEventListener("click", () => {
                pagina = irParaPagina;
                renderizar();
            });
            return botao;
        }

        function criarReticencias() {
            const reticencias = document.createElement("span");
            reticencias.textContent = "...";
            return reticencias;
        }
    }
    
    function cliqueLobo(event) {
        const botaoAdotar = event.target.closest(".card-lobo__adotar-botao");
        if (botaoAdotar && !botaoAdotar.disabled) {
            const loboId = botaoAdotar.dataset.id;
            window.location.href = `../adotar lobinho/adotar.html?id=${loboId}`;
            return;
        }

        const card = event.target.closest(".card-lobo");
        if (card) {
            const botao = card.querySelector(".card-lobo__adotar-botao");
            if (botao) {
                const loboId = botao.dataset.id;
                window.location.href = `../show/show lobinhos.html?id=${loboId}`;
            }
        }
    }

    function cliquePaginacao(event) {
        const acao = event.target.dataset.acao;
        if (acao === "anterior") pagina--;
        else if (acao === "proximo") pagina++;
        renderizar();
    }

    adicionarEventListeners();
    aplicarFiltros();
    
}
verificarEIniciar();
});