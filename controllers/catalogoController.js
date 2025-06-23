const fs = require("fs");
const path = require("path");

const catalogoPath = path.join(__dirname, "..", "data", "catalogo.json");

exports.listar = (req, res) => {
  const dados = fs.existsSync(catalogoPath)
    ? JSON.parse(fs.readFileSync(catalogoPath))
    : [];
  res.json(dados);
};

exports.adicionar = (req, res) => {
  const { titulo, descricao, capa, tipo } = req.body;

  if (!titulo || !descricao || !capa || !tipo) {
    return res.json({ sucesso: false, mensagem: "Preencha todos os campos!" });
  }

  let catalogo = [];
  if (fs.existsSync(catalogoPath)) {
    catalogo = JSON.parse(fs.readFileSync(catalogoPath));
  }

  const novoId = catalogo.length > 0 ? catalogo[catalogo.length - 1].id + 1 : 1;

  const novoItem = {
    id: novoId,
    titulo,
    descricao,
    capa,
    tipo
  };

  catalogo.push(novoItem);
  fs.writeFileSync(catalogoPath, JSON.stringify(catalogo, null, 2));

  res.json({ sucesso: true });
};

exports.avaliar = (req, res) => {
  const { itemId, nota, comentario } = req.body;

  if (!itemId || !nota || nota < 1 || nota > 5) {
    return res.json({ sucesso: false, mensagem: "ID e nota válida (1 a 5) são obrigatórios." });
  }

  let catalogo = [];
  if (fs.existsSync(catalogoPath)) {
    catalogo = JSON.parse(fs.readFileSync(catalogoPath));
  }

  const item = catalogo.find(i => i.id === Number(itemId));
  if (!item) {
    return res.json({ sucesso: false, mensagem: "Item não encontrado." });
  }

  if (!item.avaliacoes) item.avaliacoes = [];
  item.avaliacoes.push(Number(nota));

  if (comentario && comentario.trim() !== "") {
    if (!item.comentarios) item.comentarios = [];
    item.comentarios.push(comentario.trim());
  }

  fs.writeFileSync(catalogoPath, JSON.stringify(catalogo, null, 2));
  res.json({ sucesso: true, mensagem: "Avaliação adicionada com sucesso!" });
};
