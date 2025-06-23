const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
app.use(express.json());
app.use(express.static("public"));

const usuariosPath = path.join(__dirname, "data", "usuarios.json");

// Endpoint de cadastro
app.post("/cadastro", (req, res) => {
  const { nome, email, senha } = req.body;

  if (!nome || !email || !senha) {
    return res.json({ sucesso: false, mensagem: "Preencha todos os campos!" });
  }

  let usuarios = [];
  if (fs.existsSync(usuariosPath)) {
    usuarios = JSON.parse(fs.readFileSync(usuariosPath));
  }

  const existe = usuarios.find(u => u.email === email);
  if (existe) {
    return res.json({ sucesso: false, mensagem: "Email já cadastrado!" });
  }

  usuarios.push({ nome, email, senha });
  fs.writeFileSync(usuariosPath, JSON.stringify(usuarios, null, 2));
  res.json({ sucesso: true });
});

// Endpoint de login

const catalogoPath = path.join(__dirname, "data", "catalogo.json");

app.get("/catalogo", (req, res) => {
  const dados = fs.existsSync(catalogoPath)
    ? JSON.parse(fs.readFileSync(catalogoPath))
    : [];
  res.json(dados);
});


app.post("/login", (req, res) => {
  const { email, senha } = req.body;

  if (!email || !senha) {
    return res.json({ sucesso: false, mensagem: "Preencha todos os campos!" });
  }

  let usuarios = [];
  if (fs.existsSync(usuariosPath)) {
    usuarios = JSON.parse(fs.readFileSync(usuariosPath));
  }

  const usuario = usuarios.find(u => u.email === email && u.senha === senha);

  if (usuario) {
    res.json({ sucesso: true });
  } else {
    res.json({ sucesso: false, mensagem: "Email ou senha incorretos!" });
  }
});

// =============================
// ➕ Endpoint para adicionar novo item
// =============================
app.post("/adicionar", (req, res) => {
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
});

app.post("/avaliar", (req, res) => {
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

  // Cria o array de avaliações se não existir
  if (!item.avaliacoes) item.avaliacoes = [];
  item.avaliacoes.push(Number(nota));

  // Opcional: guardar comentários (crie um array se quiser)
  if (!item.comentarios) item.comentarios = [];
  if (comentario && comentario.trim() !== "") {
    item.comentarios.push(comentario.trim());
  }

  fs.writeFileSync(catalogoPath, JSON.stringify(catalogo, null, 2));

  res.json({ sucesso: true, mensagem: "Avaliação adicionada com sucesso!" });
});



// Servidor
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
