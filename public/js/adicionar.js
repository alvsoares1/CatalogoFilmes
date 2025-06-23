document.getElementById("adicionarForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const titulo = document.getElementById("titulo").value.trim();
  const descricao = document.getElementById("descricao").value.trim();
  const capa = document.getElementById("capa").value.trim();
  const tipo = document.getElementById("tipo").value;

  console.log("Dados do formulário:", { titulo, descricao, capa, tipo });

  if (!titulo || !descricao || !capa || !tipo) {
    alert("Preencha todos os campos, incluindo o tipo!");
    return;
  }

  const resposta = await fetch("/adicionar", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ titulo, descricao, capa, tipo }),
  });

  const resultado = await resposta.json();
  console.log("Resposta do backend:", resultado);

  if (resultado.sucesso) {
    alert("Novo item adicionado com sucesso!");
    window.location.href = "index.html";
  } else {
    alert("Erro: " + resultado.mensagem);
  }
});
