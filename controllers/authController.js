const fs = require("fs");
const path = require("path");

const usuariosPath = path.join(__dirname, "..", "data", "usuarios.json");

exports.cadastro = (req, res) => {
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
};

exports.login = (req, res) => {
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
};
