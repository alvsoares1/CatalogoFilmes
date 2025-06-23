// Função para pegar o valor do parâmetro id da URL
function getIdFromUrl() {
  const params = new URLSearchParams(window.location.search);
  return params.get("id");
}

// Calcula a média das avaliações ou retorna "Sem avaliações"
function calcularMedia(avaliacoes) {
  if (!avaliacoes || avaliacoes.length === 0) return "Sem avaliações";
  const soma = avaliacoes.reduce((acc, nota) => acc + nota, 0);
  return (soma / avaliacoes.length).toFixed(1);
}

async function carregarDetalhes() {
  const id = getIdFromUrl();
  if (!id) {
    document.getElementById("detalhesContainer").innerHTML = "<p>ID inválido.</p>";
    return;
  }

  try {
    const resposta = await fetch("/catalogo");
    const catalogo = await resposta.json();

    const item = catalogo.find(i => i.id === Number(id));
    if (!item) {
      document.getElementById("detalhesContainer").innerHTML = "<p>Item não encontrado.</p>";
      return;
    }

    const media = calcularMedia(item.avaliacoes);
    const comentarios = item.comentarios || [];

    // Monta o HTML para exibir os detalhes
    const html = `
      <h1>${item.titulo}</h1>
      <img src="${item.capa}" alt="${item.titulo}" style="max-width: 300px;"/>
      <p><strong>Descrição:</strong> ${item.descricao}</p>
      <p><strong>Média das avaliações:</strong> ${media}</p>
      <h3>Comentários:</h3>
      ${comentarios.length > 0 ? `<ul>${comentarios.map(c => `<li>${c}</li>`).join("")}</ul>` : "<p>Sem comentários.</p>"}
    `;

    document.getElementById("detalhesContainer").innerHTML = html;

  } catch (error) {
    document.getElementById("detalhesContainer").innerHTML = "<p>Erro ao carregar detalhes.</p>";
    console.error(error);
  }
}

carregarDetalhes();
