const express = require("express");
const router = express.Router();
const catalogoController = require("../controllers/catalogoController");

router.get("/catalogo", catalogoController.listar);
router.post("/adicionar", catalogoController.adicionar);
router.post("/avaliar", catalogoController.avaliar);

module.exports = router;
