const AppError = require("../errors/AppError.js");
const quadrosModel = require("../models/quadrosModel.js");

async function criarQuadroService(id_usuario, nome, descricao) {
    const idUsuario = Number(id_usuario);

    if (!Number.isInteger(idUsuario) || idUsuario <= 0) {
        throw new AppError("Id inválido!", 400)
    }

    if (typeof nome !== "string" || nome.trim() === "") {
        throw new AppError("Nome inválido!", 400);
    }

    const buscarUsuarioPorId = await quadrosModel.buscarUsuarioPorId(idUsuario);

    if (buscarUsuarioPorId === null) {
        throw new AppError("Usuário não existe!", 404);
    }

    const resultado = await quadrosModel.criarQuadro(idUsuario, nome, descricao);

    return {
        id: resultado.insertId,
        nome: nome,
        descricao: descricao,
        id_usuario: idUsuario
    };
};

module.exports = {
    criarQuadroService,
};