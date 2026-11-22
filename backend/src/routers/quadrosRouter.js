const express = require("express");
const router = express.Router();
const { criarQuadroController, listarQuadrosController, atualizarQuadroController, deletarQuadroController } = require("../controllers/quadrosController.js");
const { autenticarUsuario } = require("../middleware/authMiddleware.js");

router.post("/quadros", autenticarUsuario, criarQuadroController);
router.get("/quadros", autenticarUsuario, listarQuadrosController);
router.put("/quadros/:id", autenticarUsuario, atualizarQuadroController);
router.delete("/quadros/:id", autenticarUsuario, deletarQuadroController);

module.exports = router;