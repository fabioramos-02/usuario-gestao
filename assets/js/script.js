document.addEventListener('DOMContentLoaded', function () {
    // Função para exibir o modal
    function showModal(message) {
        const modal = document.getElementById('modal');
        const modalMessage = document.getElementById('modalMessage');
        modalMessage.textContent = message;
        modal.style.display = 'block';

        const closeBtn = document.querySelector('.close-btn');
        closeBtn.onclick = function() {
            modal.style.display = 'none';
        }
    }

    // Função para fazer login usando JSON Server
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function (e) {
            e.preventDefault();
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;

            fetch('http://localhost:5000/users?username=' + username + '&password=' + password)
                .then(response => response.json())
                .then(data => {
                    if (data.length > 0) {
                        window.location.href = 'home.html';
                    } else {
                        showModal('Credenciais incorretas.');
                    }
                })
                .catch(error => showModal('Erro ao tentar login.'));
        });
    }

    // Função para registrar um novo usuário no JSON Server
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', function (e) {
            e.preventDefault();
            const newUsername = document.getElementById('newUsername').value;
            const newPassword = document.getElementById('newPassword').value;

            const user = {
                username: newUsername,
                password: newPassword
            };

            fetch('http://localhost:5000/users', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(user)
            })
            .then(response => response.json())
            .then(data => {
                showModal(`Usuário ${data.username} cadastrado com sucesso!`);
                setTimeout(() => {
                    window.location.href = 'login.html';
                }, 2500);
            })
            .catch(error => showModal('Erro ao tentar cadastrar usuário.'));
        });
    }
});
