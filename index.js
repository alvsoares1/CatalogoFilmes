const express = require("express");
const path = require("path");

const app = express();
app.use(express.json());
app.use(express.static("public"));


const authRoutes = require("./routes/auth");
const catalogoRoutes = require("./routes/catalogo");

app.use("/", authRoutes);
app.use("/", catalogoRoutes);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
