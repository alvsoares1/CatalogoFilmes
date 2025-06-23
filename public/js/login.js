document.getElementById("loginForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("email").value;
  const senha = document.getElementById("senha").value;
  const mensagem = document.getElementById("loginMensagem");

  mensagem.style.display = "none";
  mensagem.textContent = "";
  mensagem.className = "mensagem"; 

  try {
    const resposta = await fetch("/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, senha })
    });

    const resultado = await resposta.json();

    mensagem.style.display = "block";

    if (resultado.sucesso) {
      mensagem.textContent = "Login bem-sucedido!";
      mensagem.classList.add("sucesso");
      localStorage.setItem("usuarioLogado", email);
      setTimeout(() => {
        window.location.href = "index.html";
      }, 1000);
    } else {
      mensagem.textContent = resultado.mensagem;
      mensagem.classList.add("erro");
    }
  } catch (error) {
    mensagem.style.display = "block";
    mensagem.textContent = "Erro ao tentar fazer login.";
    mensagem.classList.add("erro");
  }
});
