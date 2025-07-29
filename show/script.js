const todosOsLobos = JSON.parse(localStorage.getItem("lobos"));

// isso aqui pega o id do lobo da url da parte "?id=5" pega o número 5, pesquisei sobre
const idDoLobo = window.location.search.split("=")[1];

let loboEncontrado = null;
for (const lobo of todosOsLobos) {
  //aqui usa == porque o id da url é texto e o do lobo é número, pesquisei sobre
  if (lobo.id == idDoLobo) {
    loboEncontrado = lobo;
    break;
  }
}

if (loboEncontrado) {
  document.getElementById("nome-lobo").textContent = loboEncontrado.nome;
  document.getElementById("imagem-lobo").src = loboEncontrado.imagem;
  document.getElementById("descricao").textContent = loboEncontrado.descricao;
}
//so fiz o de excluir no script pq o do de adotar da pra fazer no html
const botaoExcluir = document.querySelector(".btn-excluir");

if (botaoExcluir) {
  botaoExcluir.addEventListener("click", () => {
    const novaListaDeLobos = todosOsLobos.filter((l) => l.id != idDoLobo);
    localStorage.setItem("lobos", JSON.stringify(novaListaDeLobos));
    alert("Lobinho excluído");
    window.location.href = "../lista-de-lobinhos/index.html";
  });
}
