document.getElementById("formCadastro").addEventListener("submit", function(event) {
    event.preventDefault();
  
    const nome = document.getElementById("nome").value;
    const email = document.getElementById("email").value;
    const senha = document.getElementById("senha").value;
    const confirmar = document.getElementById("confirmar").value;
  
    if (!nome || !email || !senha || !confirmar) {
      alert("Preencha todos os campos!");
      return;
    }
  
    if (senha !== confirmar) {
      alert("As senhas não coincidem!");
      return;
    }
  
    alert("Cadastro realizado com sucesso!");
    window.location.href = "login.html";
  });
  