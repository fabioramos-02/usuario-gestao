document.addEventListener('DOMContentLoaded', function () {
    // Função para exibir o modal de mensagens
    function showModal(message) {
        const modal = document.getElementById('modal');
        const modalMessage = document.getElementById('modalMessage');
        modalMessage.textContent = message;
        modal.style.display = 'block';

        const closeBtn = document.querySelector('.close-btn');
        closeBtn.onclick = function () {
            modal.style.display = 'none';
        }
    }

    // LOGIN
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function (e) {
            e.preventDefault();
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;

            fetch(`http://localhost:3003/usuarios?nome=${encodeURIComponent(username)}&senha=${encodeURIComponent(password)}`)
                .then(response => response.json())
                .then(data => {
                    if (data.length > 0) {
                        window.location.href = 'home.html';
                    } else {
                        showModal('Credenciais incorretas.');
                    }
                })
                .catch(() => {
                    showModal('Erro ao tentar login.');
                });
        });
    }

    // CADASTRO / EDIÇÃO
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', function (e) {
            e.preventDefault();
            const form = this;
            const newUsername = document.getElementById('newUsername').value.trim();
            const newPassword = document.getElementById('newPassword').value.trim();

            if (!newUsername || !newPassword) {
                alert('Preencha todos os campos.');
                return;
            }

            const usuario = {
                nome: newUsername,
                senha: newPassword
            };

            const idEditando = form.dataset.idEditando;

            if (idEditando) {
                // Editar usuário
                fetch(`http://localhost:3003/usuarios/${idEditando}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(usuario)
                })
                    .then(response => {
                        if (!response.ok) throw new Error('Erro ao atualizar usuário.');
                        alert(`Usuário ${newUsername} atualizado com sucesso!`);
                        delete form.dataset.idEditando;
                        document.querySelector('#registerForm button').textContent = 'Cadastrar';
                        form.reset();
                        listarUsuarios();
                    })
                    .catch(error => alert(error.message));
            } else {
                // Cadastrar novo usuário
                fetch('http://localhost:3003/usuarios', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
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
    }

    // LISTAR USUÁRIOS
    function listarUsuarios() {
    fetch('http://localhost:3003/usuarios')
        .then(res => res.json())
        .then(usuarios => {
            const lista = document.getElementById('listaUsuarios');
            if (!lista) return;
            lista.innerHTML = '';

            usuarios.forEach(usuario => {
                const li = document.createElement('li');
                li.textContent = usuario.nome + ' ';

                const btnEditar = document.createElement('button');
                btnEditar.textContent = 'Editar';
                btnEditar.style.marginRight = '8px'; // Espaço entre os botões
                btnEditar.addEventListener('click', () => editarUsuario(usuario.id));

                const btnExcluir = document.createElement('button');
                btnExcluir.textContent = 'Excluir';
                btnExcluir.addEventListener('click', () => excluirUsuario(usuario.id));

                li.appendChild(btnEditar);
                li.appendChild(btnExcluir);

                lista.appendChild(li);
            });
        })
        .catch(() => {
            alert('Erro ao carregar lista de usuários.');
        });
    }

    // Expor as funções editarUsuario e excluirUsuario no escopo global
    window.editarUsuario = function (id) {
        fetch(`http://localhost:3003/usuarios/${id}`)
            .then(res => res.json())
            .then(usuario => {
                document.getElementById('newUsername').value = usuario.nome;
                document.getElementById('newPassword').value = usuario.senha;
                const form = document.getElementById('registerForm');
                form.dataset.idEditando = usuario.id;
                document.querySelector('#registerForm button').textContent = 'Salvar Edição';
            })
            .catch(() => {
                alert('Erro ao carregar dados do usuário.');
            });
    }

    window.excluirUsuario = function (id) {
        if (confirm('Tem certeza que deseja excluir este usuário?')) {
            fetch(`http://localhost:3003/usuarios/${id}`, { method: 'DELETE' })
                .then(response => {
                    if (!response.ok) throw new Error('Erro ao excluir usuário.');
                    alert('Usuário excluído com sucesso!');
                    listarUsuarios();
                })
                .catch(error => alert(error.message));
        }
    }

    // Iniciar listagem automaticamente se a lista existir na página
    listarUsuarios();
});
