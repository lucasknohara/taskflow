const express = require("express");
const router = express.Router();
const { criarQuadroController, listarQuadrosController, atualizarQuadroController } = require("../controllers/quadrosController.js");
const { autenticarUsuario } = require("../middleware/authMiddleware.js");

router.post("/", autenticarUsuario, criarQuadroController);
router.get("/", autenticarUsuario, listarQuadrosController);
router.put("/:id", autenticarUsuario, atualizarQuadroController);

module.exports = router;