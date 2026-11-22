const express = require("express");
const router = express.Router();
const { criarQuadroController, listarQuadrosController, atualizarQuadroController, deletarQuadroController } = require("../controllers/quadrosController.js");
const { autenticarUsuario } = require("../middleware/authMiddleware.js");

router.post("/", autenticarUsuario, criarQuadroController);
router.get("/", autenticarUsuario, listarQuadrosController);
router.put("/:id", autenticarUsuario, atualizarQuadroController);
router.delete("/:id", autenticarUsuario, deletarQuadroController);

module.exports = router;