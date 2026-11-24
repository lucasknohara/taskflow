const usuarioService = require("../services/usuarioService.js");

async function criarUsuarioController(req, res) {
    const { nome, email, senha } =  req.body;

    const resultado = await usuarioService.criarUsuarioService(nome, email, senha);

    res.status(201).json(resultado);
};

async function loginUsuarioController(req, res) {
    const { email, senha } = req.body;

    const resultado = await usuarioService.loginUsuarioService(email, senha);

    res.status(200).json(resultado);
};

async function buscarUsuarioPorIdController(req, res) {
    const id_usuario = req.usuario.id;

    const resultado = await usuarioService.buscarUsuarioPorIdService(id_usuario);

    res.status(200).json(resultado);
};

async function atualizarUsuarioController(req, res) {
    const id_usuario = req.usuario.id;
    const { nome, email } = req.body;

    const resultado = await usuarioService.atualizarUsuarioService(id_usuario, nome, email);

    res.status(200).json(resultado);
};

module.exports = {
    criarUsuarioController,
    loginUsuarioController,
    buscarUsuarioPorIdController,
    atualizarUsuarioController,
};