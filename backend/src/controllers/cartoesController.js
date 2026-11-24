const cartoesService = require("../services/cartoesService.js");

async function criarCartaoController(req, res) {
    const { titulo, descricao, prioridade, data_entrega } = req.body;
    const id_coluna = req.params.id;
    const id_usuario = req.usuario.id;

    const resultado = await cartoesService.criarCartaoService(id_coluna, titulo, descricao, prioridade, data_entrega, id_usuario);

    res.status(201).json(resultado);
};

async function listarCartoesController(req, res) {
    const id_coluna = req.params.id;
    const id_usuario = req.usuario.id;

    const resultado = await cartoesService.listarCartoesService(id_coluna, id_usuario);

    res.status(200).json(resultado);
};

async function atualizarCartoesController(req, res) {
    const id_cartao = req.params.id;
    const id_usuario = req.usuario.id;
    const { titulo, descricao, prioridade, data_entrega } = req.body;

    const resultado = await cartoesService.atualizarCartoesService(id_cartao, titulo, descricao, prioridade, data_entrega, id_usuario);

    res.status(200).json(resultado);
};

async function excluirCartaoController(req, res) {
    const id_cartao = req.params.id;
    const id_usuario = req.usuario.id;

    const resultado = await cartoesService.excluirCartaoService(id_cartao, id_usuario);

    res.status(200).json(resultado);
};

async function moverCartaoController(req, res) {
    const id_cartao = req.params.id;
    const id_usuario = req.usuario.id;

    const { id_coluna_destino, posicao_destino } = req.body;

    const resultado = await cartoesService.moverCartaoService(id_cartao, id_coluna_destino, posicao_destino, id_usuario);

    res.status(200).json(resultado);
};

module.exports = {
    criarCartaoController,
    listarCartoesController,
    atualizarCartoesController,
    excluirCartaoController,
    moverCartaoController,
};