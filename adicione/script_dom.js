document.addEventListener('DOMContentLoaded', () => {

    const form = document.querySelector('form');

    form.addEventListener('submit', (event) => {
        event.preventDefault();
        const lobos = JSON.parse(localStorage.getItem('lobos'));

        const nome = document.getElementById('nome').value;
        const idade = document.getElementById('idade').value;
        const fotoUrl = document.getElementById('foto').value;
        const descricao = document.getElementById('descriçao').value;

        if (!nome || !idade || !fotoUrl || !descricao) {
            alert('Por favor, preencha todos os campos!');
            return; 
        }
        /*id, parte complexa*/
        const novoId = Math.max(...lobos.map(lobo => lobo.id)) + 1;

        const novoLobo = {
            id: novoId,
            nome: nome,
            idade: parseInt(idade),
            imagem: fotoUrl,
            adotado: false,
            nomeDono: null,
            idadeDono: null,
            emailDono: null
        };

        lobos.push(novoLobo);

        localStorage.setItem('lobos', JSON.stringify(lobos));

        alert('Lobinho adicionado!');
    });
});