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

const botaoAdotar = document.querySelector(".btn-adotar");
const botaoExcluir = document.querySelector(".btn-excluir");

//aqui se o lobo estiver adotado, ele desativa o botao
if (loboEncontrado.adotado == true) {
  botaoAdotar.disabled = true;
  botaoAdotar.style.cursor = 'not-allowed';
}

if (botaoAdotar){
    botaoAdotar.addEventListener("click", () => {
      window.location.href = `../adotar lobinho/adotar.html?id=${idDoLobo}`;
    })
}

if (botaoExcluir) {
  botaoExcluir.addEventListener("click", () => {
    const novaListaDeLobos = todosOsLobos.filter((l) => l.id != idDoLobo);
    localStorage.setItem("lobos", JSON.stringify(novaListaDeLobos));
    alert("Lobinho excluído");
    window.location.href = `../lista-de-lobinhos/index.html`;
  });
}
