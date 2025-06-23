// Busca lista de filmes para popular o select
async function carregarItens() {
  try {
    const resposta = await fetch('/catalogo');
    if (!resposta.ok) throw new Error('Erro ao buscar itens');
    const itens = await resposta.json();

    // Filtra só filmes (pode alterar conforme necessário)
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
    alert('Não foi possível carregar a lista de itens.');
  }
}

// Executa no carregamento da página
carregarItens();

document.getElementById("avaliacaoForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const itemId = Number(document.getElementById("itemId").value);
  const nota = Number(document.getElementById("nota").value.trim());
  const comentario = document.getElementById("comentario").value.trim();

  if (!itemId || !nota || nota < 1 || nota > 5) {
    alert("Informe um item válido e uma nota entre 1 e 5.");
    return;
  }

  try {
    const resposta = await fetch("/avaliar", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ itemId, nota, comentario }),
    });

    const resultado = await resposta.json();

    if (resultado.sucesso) {
      alert(resultado.mensagem);
      window.location.href = "index.html";
    } else {
      alert("Erro: " + resultado.mensagem);
    }
  } catch (error) {
    alert('Erro ao enviar avaliação.');
    console.error(error);
  }
});

// Controle da exibição dos botões conforme usuário logado
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


// Função para carregar catálogo e buscar filmes na página principal (opcional)
async function carregarCatalogo() {
  const resposta = await fetch('/catalogo');
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
  let favoritos = JSON.parse(localStorage.getItem("favoritos") || "[]");
  if (!favoritos.includes(id)) {
    favoritos.push(id);
    localStorage.setItem("favoritos", JSON.stringify(favoritos));
    alert("Adicionado aos favoritos!");
  } else {
    alert("Já está nos favoritos.");
  }
}

function logout() {
  localStorage.removeItem("usuarioLogado");
  localStorage.removeItem("favoritos");

  setTimeout(() => {
    window.location.href = "index.html";
    window.location.reload();
  }, 1000);
}

// Se você usar carregarCatalogo na página index, chame aqui:
// carregarCatalogo();
