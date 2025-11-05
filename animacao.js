// Espera a página carregar
window.addEventListener("load", () => {
  // Após 4 segundos, redireciona para o login
  setTimeout(() => {
    window.location.href = "./../html/login.html";
  }, 4000);
});
