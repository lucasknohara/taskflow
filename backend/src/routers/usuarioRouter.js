const express = require("express");
const router = express.Router();
const { criarUsuarioController, loginUsuarioController } = require("../controllers/usuarioController.js");

router.post("/usuarios/cadastro", criarUsuarioController);
router.post("/usuarios/login", loginUsuarioController);

module.exports = router;