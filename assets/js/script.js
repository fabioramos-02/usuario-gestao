// Função para simular login (apenas para fins demonstrativos)
document.getElementById('loginForm').addEventListener('submit', function (e) {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    // Simulação de login com dados fixos
    if (username === 'admin' && password === '12345') {
        alert('Login bem-sucedido!');
        // Aqui você pode redirecionar para outra página ou exibir o painel de controle
    } else {
        alert('Credenciais incorretas.');
    }
});

document.getElementById('registerForm').addEventListener('submit', function (e) {
    e.preventDefault();
    const newUsername = document.getElementById('newUsername').value;
    const newPassword = document.getElementById('newPassword').value;

    const novoUsuario = {
        nome: newUsername,
        senha: newPassword
    };

    fetch('http://localhost:3000/usuarios', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(novoUsuario)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Erro ao cadastrar usuário.');
        }
        alert(`Usuário ${newUsername} cadastrado com sucesso!`);
        document.getElementById('registerForm').reset();
        listarUsuarios(); // exibe na interface (será feita já já)
    })
    .catch(error => {
        alert(error.message);
    });
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