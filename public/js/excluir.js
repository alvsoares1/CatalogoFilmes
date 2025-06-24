async function carregarItens() {
  try {
    const resposta = await fetch('/catalogo');
    if (!resposta.ok) throw new Error('Erro ao buscar itens');
    const itens = await resposta.json();

    const filmes = itens.filter(item => item.tipo === "filme");

    const select = document.getElementById('itemId');
    filmes.forEach(item => {
      const option = document.createElement('option');
      option.value = item.id;
      option.textContent = item.titulo;
      select.appendChild(option);
    });
  } catch (error) {
    console.error('Erro ao carregar itens:', error);
    const mensagem = document.getElementById("excluirMensagem");
    mensagem.style.display = "block";
    mensagem.textContent = "Não foi possível carregar a lista de filmes.";
    mensagem.className = "mensagem erro";
  }
}

carregarItens();

document.getElementById("excluirForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const itemId = Number(document.getElementById("itemId").value);
  const mensagem = document.getElementById("excluirMensagem");

  mensagem.style.display = "none";
  mensagem.textContent = "";
  mensagem.className = "mensagem";

  if (!itemId) {
    mensagem.style.display = "block";
    mensagem.textContent = "Selecione um filme para excluir.";
    mensagem.classList.add("erro");
    return;
  }

  try {
    const resposta = await fetch(`/filmes/${itemId}`, {
      method: "DELETE",
    });

    const resultado = await resposta.json();

    mensagem.style.display = "block";

    if (resultado.sucesso) {
      mensagem.textContent = resultado.mensagem;
      mensagem.classList.add("sucesso");
      setTimeout(() => {
        window.location.href = "index.html";
      }, 1500);
    } else {
      mensagem.textContent = "Erro: " + resultado.mensagem;
      mensagem.classList.add("erro");
    }
  } catch (error) {
    console.error(error);
    mensagem.style.display = "block";
    mensagem.textContent = "Erro ao excluir filme.";
    mensagem.classList.add("erro");
  }
});
