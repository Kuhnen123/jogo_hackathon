document.getElementById("formCadastro").addEventListener("submit", function(event) {
  event.preventDefault();

  const nome = document.getElementById("nome").value.trim();
  const email = document.getElementById("email").value.trim();
  const senha = document.getElementById("senha").value.trim();
  const confirmar = document.getElementById("confirmar").value.trim();

  // Verifica se os campos estão vazios
  if (nome === "" || email === "" || senha === "" || confirmar === "") {
    alert("Preencha todos os campos!");
    return;
  }

  // Verifica se a senha tem pelo menos 1 caractere
  if (senha.length < 1) {
    alert("A senha deve conter pelo menos 1 caractere!");
    return;
  }

  // Verifica se as senhas coincidem
  if (senha !== confirmar) {
    alert("As senhas não coincidem!");
    return;
  }

  // Mensagem e redirecionamento igual ao login
  alert("Cadastro realizado com sucesso!");
  window.location.href = "./../html/login.html";
});
