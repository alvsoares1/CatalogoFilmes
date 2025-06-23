document.getElementById("cadastroForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const nome = document.getElementById("nome").value;
  const email = document.getElementById("email").value;
  const senha = document.getElementById("senha").value;

  const resposta = await fetch("/cadastro", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ nome, email, senha })
  });

  const resultado = await resposta.json();
  if (resultado.sucesso) {
    alert("Cadastro realizado com sucesso! Faça login.");
    window.location.href = "login.html";
  } else {
    alert("Erro: " + resultado.mensagem);
  }
});
