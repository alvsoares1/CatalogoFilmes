const usuarioLogado = localStorage.getItem("usuarioLogado");

const botoesUsuario = document.getElementById("botoesUsuario");
const botoesVisitante = document.getElementById("botoesVisitante");

botoesUsuario.style.display = "none";
botoesVisitante.style.display = "none";

if (usuarioLogado) {
  botoesUsuario.style.display = "flex";
} else {
  botoesVisitante.style.display = "flex";
}

async function carregarCatalogo() {
  try {
    const resposta = await fetch('/catalogo');
    if (!resposta.ok) throw new Error("Erro ao carregar catálogo");
    let catalogo = await resposta.json();

    catalogo = catalogo.filter(item => item.tipo === "filme");

    exibirCatalogo(catalogo);

    document.getElementById("busca").addEventListener("input", () => {
      const termo = document.getElementById("busca").value.toLowerCase();
      const filtrado = catalogo.filter(item =>
        item.titulo.toLowerCase().includes(termo)
      );
      exibirCatalogo(filtrado);
    });
  } catch (error) {
    console.error(error);
    const mensagem = document.getElementById("favoritoMensagem");
    mensagem.style.display = "block";
    mensagem.textContent = "Erro ao carregar catálogo.";
    mensagem.className = "mensagem erro";
  }
}

function exibirCatalogo(itens) {
  const container = document.getElementById("catalogo");
  container.innerHTML = "";

  if (itens.length === 0) {
    container.innerHTML = "<p>Nenhum item encontrado.</p>";
    return;
  }

  itens.forEach(item => {
    const media = item.avaliacoes && item.avaliacoes.length > 0
      ? (item.avaliacoes.reduce((soma, nota) => soma + nota, 0) / item.avaliacoes.length).toFixed(1)
      : "Sem avaliações";

    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <img src="${item.capa}" alt="${item.titulo}" />
      <h3>${item.titulo}</h3>
      <p>Média de avaliação: ${media}</p>
      <div class="botoes-card">
        <button onclick="verDetalhes(${item.id})">Ver Detalhes</button>
        ${usuarioLogado ? `<button onclick="favoritar(${item.id})">Favoritar</button>` : ""}
      </div>
    `;
    container.appendChild(card);
  });
}

function verDetalhes(id) {
  window.location.href = `detalhes.html?id=${id}`;
}

function favoritar(id) {
  const mensagem = document.getElementById("favoritoMensagem");
  mensagem.style.display = "none";
  mensagem.textContent = "";
  mensagem.className = "mensagem";

  let favoritos = JSON.parse(localStorage.getItem("favoritos") || "[]");
  if (!favoritos.includes(id)) {
    favoritos.push(id);
    localStorage.setItem("favoritos", JSON.stringify(favoritos));
    mensagem.style.display = "block";
    mensagem.textContent = "Adicionado aos favoritos!";
    mensagem.classList.add("sucesso");
  } else {
    mensagem.style.display = "block";
    mensagem.textContent = "Já está nos favoritos.";
    mensagem.classList.add("erro");
  }

  setTimeout(() => {
    mensagem.style.display = "none";
  }, 2000);
}

function logout() {
  localStorage.removeItem("usuarioLogado");
  localStorage.removeItem("favoritos");

  setTimeout(() => {
    window.location.href = "index.html";
    window.location.reload();
  }, 1000);
}

carregarCatalogo();
