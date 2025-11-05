document.getElementById("formLogin").addEventListener("submit", function(event) {
    event.preventDefault();
  
    const usuario = document.getElementById("usuario").value;
    const senha = document.getElementById("senha").value;
  
    if (usuario === "" || senha === "") {
      alert("Preencha todos os campos!");
    } else {
      alert("Login realizado com sucesso!");
      window.location.href = "index.html";
    }
  });
  