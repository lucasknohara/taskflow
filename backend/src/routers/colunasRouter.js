const express = require("express");
const router = express.Router();
const { criarColunasController, listarColunasController, atualizarColunasController, deletarColunaController } = require("../controllers/colunasController.js");
const { autenticarUsuario } = require("../middleware/authMiddleware.js");

router.post("/quadros/:id/colunas", autenticarUsuario, criarColunasController);
router.get("/quadros/:id/colunas", autenticarUsuario, listarColunasController);
router.put("/colunas/:id", autenticarUsuario, atualizarColunasController);
router.delete("/colunas/:id", autenticarUsuario, deletarColunaController);

module.exports = router;