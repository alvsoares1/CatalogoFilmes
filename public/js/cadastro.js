document.getElementById("cadastroForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const nome = document.getElementById("nome").value;
  const email = document.getElementById("email").value;
  const senha = document.getElementById("senha").value;
  const mensagem = document.getElementById("cadastroMensagem");

  mensagem.style.display = "none";
  mensagem.textContent = "";
  mensagem.className = "mensagem"; // limpa classes antigas

  try {
    const resposta = await fetch("/cadastro", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nome, email, senha })
    });

    const resultado = await resposta.json();

    mensagem.style.display = "block";

    if (resultado.sucesso) {
      mensagem.textContent = "Cadastro realizado com sucesso!";
      mensagem.classList.add("sucesso");
      setTimeout(() => {
        window.location.href = "login.html";
      }, 1500);
    } else {
      mensagem.textContent = resultado.mensagem;
      mensagem.classList.add("erro");
    }
  } catch (error) {
    mensagem.style.display = "block";
    mensagem.textContent = "Erro ao tentar cadastrar.";
    mensagem.classList.add("erro");
  }
});
