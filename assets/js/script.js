// Função para simular login (apenas para fins demonstrativos)
document.getElementById('loginForm').addEventListener('submit', function (e) {
    e.preventDefault();
    const form = this;
    const newUsername = document.getElementById('newUsername').value;
    const newPassword = document.getElementById('newPassword').value;

    const usuario = {
        nome: newUsername,
        senha: newPassword
    };

    const idEditando = form.dataset.idEditando;

    if (idEditando) {
        // Edição
        fetch(`http://localhost:3000/usuarios/${idEditando}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(usuario)
        })
        .then(() => {
            alert(`Usuário ${newUsername} atualizado com sucesso!`);
            delete form.dataset.idEditando;
            document.querySelector('#registerForm button').textContent = 'Cadastrar';
            form.reset();
            listarUsuarios();
        });
    } else {
        // Cadastro
        fetch('http://localhost:3000/usuarios', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(usuario)
        })
        .then(response => {
            if (!response.ok) throw new Error('Erro ao cadastrar usuário.');
            alert(`Usuário ${newUsername} cadastrado com sucesso!`);
            form.reset();
            listarUsuarios();
        })
        .catch(error => alert(error.message));
    }
});

function listarUsuarios() {
    fetch('http://localhost:3000/usuarios')
        .then(res => res.json())
        .then(usuarios => {
            const lista = document.getElementById('listaUsuarios');
            lista.innerHTML = '';

            usuarios.forEach(usuario => {
                const li = document.createElement('li');
                li.innerHTML = `
                    ${usuario.nome}
                    <button onclick="editarUsuario(${usuario.id})">Editar</button>
                    <button onclick="excluirUsuario(${usuario.id})">Excluir</button>
                `;
                lista.appendChild(li);
            });
        });
}

// Chamar a listagem quando a página carrega
document.addEventListener('DOMContentLoaded', listarUsuarios);

function editarUsuario(id) {
    fetch(`http://localhost:3000/usuarios/${id}`)
        .then(res => res.json())
        .then(usuario => {
            document.getElementById('newUsername').value = usuario.nome;
            document.getElementById('newPassword').value = usuario.senha;
            const form = document.getElementById('registerForm');
            form.dataset.idEditando = usuario.id;
            document.querySelector('#registerForm button').textContent = 'Salvar Edição';
        });
}