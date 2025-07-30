let todosOsLobos = JSON.parse(localStorage.getItem("lobos")) || [];
const urlParams = new URLSearchParams(window.location.search);
const loboId = urlParams.get("id");
const lobo = todosOsLobos.find((l) => l.id == loboId); //isso daqui coleta o id

const infoContainer = document.querySelector(".primeiro");

if (lobo) {
  const loboHtml = `
            <img id="imagem-lobo" src="${lobo.imagem}" class="imagem">
            <div class="adote">
                <h1 id="titulo-adocao">Adote o(a) ${lobo.nome}</h1>
                <p id="id-lobo">ID: ${lobo.id}</p>
            </div>
        `;
  infoContainer.innerHTML = loboHtml;
}
const form = document.querySelector(".segundo");

form.addEventListener("submit", (event) => {
    event.preventDefault();

  if (!lobo) {
    window.location.href ="../lista-de-lobinhos/index.html";
    return;
  }

  let nomeDono = document.getElementById("nome").value;
  let idadeDono = document.getElementById("idade").value;
  let emailDono = document.getElementById("email").value;

  if (!nomeDono || !idadeDono || !emailDono) {
    alert("Por favor, preencha todos os seus dados para adotar!");
    return;
  }

//isso aqui coleta o id
let id = todosOsLobos.findIndex((l) => l.id == loboId);

  todosOsLobos[id].adotado = true;
  todosOsLobos[id].nomeDono = nomeDono;
  todosOsLobos[id].idadeDono = parseInt(idadeDono);
  todosOsLobos[id].emailDono = emailDono;

  localStorage.setItem("lobos", JSON.stringify(todosOsLobos));

  alert(` Você adotou o(a) ${lobo.nome}!`);
  window.location.href = "../lista-de-lobinhos/index.html";

});
