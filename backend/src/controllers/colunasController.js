const colunasService = require("../services/colunasService.js");

async function criarColunasController(req, res) {
    const id_quadro = req.params.id;
    const id_usuario = req.usuario.id;
    const { nome, posicao } = req.body;

    const resultado = await colunasService.criarColunasServices(id_quadro, nome, posicao, id_usuario);

    res.status(201).json(resultado);
};

async function listarColunasController(req, res) {
    const id_quadro = req.params.id;
    const id_usuario = req.usuario.id;

    const resultado = await colunasService.listarColunasService(id_quadro, id_usuario);

    res.status(200).json(resultado);
};

async function atualizarColunasController(req, res) {
    const id_coluna = req.params.id;
    const id_usuario = req.usuario.id;
    const { nome } = req.body;

    const resultado = await colunasService.atualizarColunasService(id_coluna, nome, id_usuario);

    res.status(200).json(resultado);
};

async function deletarColunaController(req, res) {
    const id_coluna = req.params.id;
    const id_usuario = req.usuario.id;

    const resultado = await colunasService.deletarColunaService(id_coluna, id_usuario);

    res.status(200).json(resultado);
};

module.exports = {
    criarColunasController,
    listarColunasController,
    atualizarColunasController,
    deletarColunaController,
};