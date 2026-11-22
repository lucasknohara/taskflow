const quadrosService = require("../services/quadroService.js")

async function criarQuadroController(req, res) {
    const { nome, descricao } = req.body;
    const id_usuario = req.usuario.id;

    const resultado = await quadrosService.criarQuadroService(id_usuario, nome, descricao);

    res.status(201).json(resultado);
};

async function listarQuadrosController(req, res) {
    const id_usuario = req.usuario.id;

    const resultado = await quadrosService.listarQuadrosService(id_usuario);

    res.status(200).json(resultado);
};

module.exports = {
    criarQuadroController,
    listarQuadrosController,
};