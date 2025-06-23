document.getElementById("adicionarForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const titulo = document.getElementById("titulo").value.trim();
  const descricao = document.getElementById("descricao").value.trim();
  const capa = document.getElementById("capa").value.trim();
  const tipo = document.getElementById("tipo").value;
  const mensagem = document.getElementById("adicionarMensagem");

  mensagem.style.display = "none";
  mensagem.textContent = "";
  mensagem.className = "mensagem";

  try {
    const resposta = await fetch("/adicionar", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ titulo, descricao, capa, tipo }),
    });

    const resultado = await resposta.json();

    mensagem.style.display = "block";

    if (resultado.sucesso) {
      mensagem.textContent = "Novo item adicionado com sucesso! Redirecionando...";
      mensagem.classList.add("sucesso");
      setTimeout(() => {
        window.location.href = "index.html";
      }, 1500);
    } else {
      mensagem.textContent = resultado.mensagem;
      mensagem.classList.add("erro");
    }
  } catch (error) {
    console.error(error);
    mensagem.style.display = "block";
    mensagem.textContent = "Erro ao adicionar item.";
    mensagem.classList.add("erro");
  }
});
