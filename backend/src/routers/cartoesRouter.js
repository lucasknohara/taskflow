const express = require("express");
const router = express.Router();
const { criarCartaoController, listarCartoesController, atualizarCartoesController, excluirCartaoController, moverCartaoController } = require("../controllers/cartoesController.js");
const { autenticarUsuario } = require("../middleware/authMiddleware.js");

router.post("/colunas/:id/cartoes", autenticarUsuario, criarCartaoController);
router.get("/colunas/:id/cartoes", autenticarUsuario, listarCartoesController);
router.put("/cartoes/:id", autenticarUsuario, atualizarCartoesController);
router.delete("/cartoes/:id", autenticarUsuario, excluirCartaoController);
router.patch("/cartoes/:id/mover", autenticarUsuario, moverCartaoController);

module.exports = router;