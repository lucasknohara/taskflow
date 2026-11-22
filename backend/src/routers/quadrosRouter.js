const express = require("express");
const router = express.Router();
const { criarQuadroController } = require("../controllers/quadrosController.js");
const { autenticarUsuario } = require("../middleware/authMiddleware.js");

router.post("/", autenticarUsuario, criarQuadroController);

module.exports = router;