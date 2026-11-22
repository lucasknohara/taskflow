const AppError = require("../errors/AppError.js");
const quadrosModel = require("../models/quadrosModel.js");

async function criarQuadroService(id_usuario, nome, descricao) {
    if (typeof nome !== "string" || nome.trim() === "") {
        throw new AppError("Nome inválido!", 400);
    }

    const buscarUsuarioPorId = await quadrosModel.buscarUsuarioPorId(id_usuario);

    if (buscarUsuarioPorId === null) {
        throw new AppError("Usuário não existe!", 404);
    }

    const resultado = await quadrosModel.criarQuadro(id_usuario, nome, descricao);

    return {
        "quadro": {
            id: resultado.insertId,
            nome: nome,
            descricao: descricao,  
        },
        "usuario": {
            id_usuario: id_usuario
        }
    };
};

async function listarQuadrosService(id_usuario) {
    const buscarUsuarioPorId = await quadrosModel.buscarUsuarioPorId(id_usuario);

    if (buscarUsuarioPorId === null) {
        throw new AppError("Usuário não existe!", 404);
    }

    const resultado = await quadrosModel.listarQuadros(id_usuario);

    return {
        "quadros": resultado
    };
};

async function atualizarQuadroService(id_quadro, nome, descricao, id_usuario) {
    if (typeof nome !== "string" || nome.trim() === "") {
        throw new AppError("Nome inválido!", 400);
    }

    const buscarUsuarioPorId = await quadrosModel.buscarUsuarioPorId(id_usuario);

    if (buscarUsuarioPorId === null) {
        throw new AppError("Usuário não existe!", 404);
    }

    const buscarQuadroPorId = await quadrosModel.buscarQuadroPorId(id_quadro);

    if (buscarQuadroPorId === null) {
        throw new AppError("Quadro não existe!", 404);
    }

    const resultado = await quadrosModel.atualizarQuadro(id_quadro, nome, descricao, id_usuario);

    if (resultado.affectedRows === 0) {
        throw new AppError("Você não tem permissão para atualizá-lo!", 404);
    }

    return {
        message: "Quadro atualizado com sucesso!"
    };
};

async function deletarQuadroService(id_quadro, id_usuario) {
    const buscarUsuarioPorId = await quadrosModel.buscarUsuarioPorId(id_usuario);

    if (buscarUsuarioPorId === null) {
        throw new AppError("Usuário não existe!", 404);
    }

    const buscarQuadroPorId = await quadrosModel.buscarQuadroPorId(id_quadro);

    if (buscarQuadroPorId === null) {
        throw new AppError("Quadro não encontrado!", 404);
    }

    const resultado = await quadrosModel.deletarQuadro(id_quadro, id_usuario);

    if (resultado.affectedRows === 0) {
        throw new AppError("Você não tem permissão para exclui-lo!", 404);
    }

    return {
        message: "Quadro excluido com sucesso!"
    }
};

module.exports = {
    criarQuadroService,
    listarQuadrosService,
    atualizarQuadroService,
    deletarQuadroService,
};