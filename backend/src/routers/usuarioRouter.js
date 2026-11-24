const express = require("express");
const router = express.Router();
const { criarUsuarioController, loginUsuarioController, buscarUsuarioPorIdController, atualizarUsuarioController } = require("../controllers/usuarioController.js");
const { autenticarUsuario } = require("../middleware/authMiddleware.js");

router.post("/usuarios/cadastro", criarUsuarioController);
router.post("/usuarios/login", loginUsuarioController);
router.get("/usuarios/me", autenticarUsuario, buscarUsuarioPorIdController);
router.patch("/usuarios/me", autenticarUsuario, atualizarUsuarioController);

module.exports = router;