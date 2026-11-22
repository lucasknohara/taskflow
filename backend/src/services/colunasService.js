const colunasModel = require("../models/colunasModel.js");
const AppError = require("../errors/AppError.js");
const quadrosModel = require("../models/quadrosModel.js");

async function criarColunasServices(id_quadro, nome, posicao, id_usuario) {
    if (typeof nome !== "string" || nome.trim() === "") {
        throw new AppError("Nome inválido!", 400);
    }

    if (typeof posicao !== "number" || posicao < 0) {
        throw new AppError("Posição inválida!", 400);
    }

    const buscarQuadroPorId = await quadrosModel.buscarQuadroPorId(id_quadro, id_usuario);

    if (buscarQuadroPorId === null) {
        throw new AppError("Quadro não existe!", 404);
    }

    const resultado = await colunasModel.criarColunas(id_quadro, nome, posicao);

    return {
        "coluna": {
            id: resultado.insertId,
            nome: nome,
            posicao: posicao
        }, 
        "quadro": {
            id: id_quadro
        }
    };
};

async function listarColunasService(id_quadro, id_usuario) {
    const buscarQuadroPorId = await quadrosModel.buscarQuadroPorId(id_quadro, id_usuario);

    if (buscarQuadroPorId === null) {
        throw new AppError("Quadro não existe!", 404);
    }

    const resultado = await colunasModel.listarColunas(id_quadro);

    return {
        "colunas": resultado
    };
};

async function atualizarColunasService(id_coluna, nome, id_usuario) {
    if (typeof nome !== "string" || nome.trim() === "") {
        throw new AppError("Nome inválido!", 400);
    }

    const buscarColunaPorId = await colunasModel.buscarColunaPorId(id_coluna);

    if (buscarColunaPorId === null) {
        throw new AppError("Coluna não existe!", 404);
    }

    const resultado = await colunasModel.atualizarColunas(id_coluna, nome, id_usuario);

    if (resultado.affectedRows === 0) {
        throw new AppError("Você não tem permissão para atualizá-la!", 404);
    }

    return {
        message: "Coluna atualizada com sucesso!"
    };
};

async function deletarColunaService(id_coluna, id_usuario) {
    const buscarColunaPorId = await colunasModel.buscarColunaPorId(id_coluna);

    if (buscarColunaPorId === null) {
        throw new AppError("Coluna não existe!", 404);
    }

    const resultado = await colunasModel.deletarColuna(id_coluna, id_usuario);

    if (resultado.affectedRows === 0) {
        throw new AppError("Você não tem permissão para exclui-la!", 404);
    }

    return {
        message: "Coluna excluida com sucesso!"
    };
};

module.exports = {
    criarColunasServices,
    listarColunasService,
    atualizarColunasService,
    deletarColunaService,
};