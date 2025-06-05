// LOGIN
document.getElementById('loginForm').addEventListener('submit', function (e) {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    fetch('http://localhost:3000/usuarios')
        .then(res => res.json())
        .then(usuarios => {
            const usuario = usuarios.find(u => u.nome === username && u.senha === password);
            if (usuario) {
                alert('Login bem-sucedido!');
            } else {
                alert('Credenciais incorretas.');
            }
        });
});

// CADASTRO / EDIÇÃO
document.getElementById('registerForm').addEventListener('submit', function (e) {
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
        // Editar usuário
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
        // Cadastrar novo usuário
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

// LISTAR USUÁRIOS
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

// EDITAR
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

// EXCLUIR
function excluirUsuario(id) {
    if (confirm('Tem certeza que deseja excluir este usuário?')) {
        fetch(`http://localhost:3000/usuarios/${id}`, {
            method: 'DELETE'
        })
        .then(() => {
            alert('Usuário excluído com sucesso!');
            listarUsuarios();
        })
        .catch(() => {
            alert('Erro ao excluir usuário.');
        });
    }
}

// INICIAR LISTAGEM AUTOMÁTICA
document.addEventListener('DOMContentLoaded', listarUsuarios);
