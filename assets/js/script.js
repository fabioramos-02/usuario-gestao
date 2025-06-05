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

// Função para simular cadastro (apenas para fins demonstrativos)
document.getElementById('registerForm').addEventListener('submit', function (e) {
    e.preventDefault();
    const newUsername = document.getElementById('newUsername').value;
    const newPassword = document.getElementById('newPassword').value;

    // Simulação de cadastro
    alert(`Usuário ${newUsername} cadastrado com sucesso!`);
});
