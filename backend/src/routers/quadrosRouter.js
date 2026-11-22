const express = require("express");
const router = express.Router();
const { criarQuadroController, listarQuadrosController } = require("../controllers/quadrosController.js");
const { autenticarUsuario } = require("../middleware/authMiddleware.js");

router.post("/", autenticarUsuario, criarQuadroController);
router.get("/", autenticarUsuario, listarQuadrosController);

module.exports = router;