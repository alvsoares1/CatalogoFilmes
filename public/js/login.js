document.getElementById("loginForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("email").value;
  const senha = document.getElementById("senha").value;

  const resposta = await fetch("/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, senha })
  });

  const resultado = await resposta.json();
  if (resultado.sucesso) {
    alert("Login bem-sucedido!");
    localStorage.setItem("usuarioLogado", email);
    window.location.href = "index.html";
  } else {
    alert("Email ou senha incorretos!");
  }
});
