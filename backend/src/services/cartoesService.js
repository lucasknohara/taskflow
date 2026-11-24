const cartoesModel = require("../models/cartoesModel.js");
const AppError = require("../errors/AppError.js");
const pool = require("../config/database.js");

async function criarCartaoService(id_coluna, titulo, descricao, prioridade, data_entrega, id_usuario) {
    const [ano, mes, dia] = data_entrega.split("-").map(Number);
    let dataValidade = new Date(ano, mes - 1, dia);
    const hoje = new Date();
    const hojeFormatado = `${hoje.getFullYear()}-${String(hoje.getMonth() + 1).padStart(2, "0")}-${String(hoje.getDate()).padStart(2, "0")}`;

    if (dataValidade.getFullYear() !== ano || dataValidade.getMonth() !== mes - 1 || dataValidade.getDate() !== dia) {
        throw new AppError("Data de validade inexistente!", 400);
    }

    if (data_entrega < hojeFormatado) {
        throw new AppError("A validade não pode ser anterior à data atual!", 400);
    }
    
    if (typeof titulo !== "string" || titulo.trim() === "") {
        throw new AppError("Titulo inválido!", 400);
    }

    if (typeof prioridade !== "string" || prioridade.trim() === "") {
        throw new AppError("Prioridade inválida!", 400);
    }

    const buscarColunaPorId = await cartoesModel.buscarColunaPorId(id_coluna, id_usuario);

    if (buscarColunaPorId === null) {
        throw new AppError("Coluna não encontrado!", 404);
    }

    const posicao = await cartoesModel.buscarProximaPosicao(id_coluna);

    const resultado = await cartoesModel.criarCartao(id_coluna, titulo, descricao, prioridade, data_entrega, posicao);

    return {
        "cartão": {
            titulo: titulo,
            descricao: descricao,
            prioridade: prioridade,
            posicao: posicao,
            data_entrega: data_entrega
        }, 
        "coluna": {
            id: id_coluna
        },
        "usuario": {
            id: id_usuario
        }
    };
};

async function listarCartoesService(id_coluna, id_usuario) {
    const buscarColunaPorId = await cartoesModel.buscarColunaPorId(id_coluna, id_usuario);

    if (buscarColunaPorId === null) {
        throw new AppError("Coluna não encontrado!", 404);
    }

    const resultado = await cartoesModel.listarCartoes(id_coluna);

    return {
        "cartões": resultado
    };
};

async function atualizarCartoesService(id_cartao, titulo, descricao, prioridade, data_entrega, id_usuario) {
    const [ano, mes, dia] = data_entrega.split("-").map(Number);
    let dataValidade = new Date(ano, mes - 1, dia);
    const hoje = new Date();
    const hojeFormatado = `${hoje.getFullYear()}-${String(hoje.getMonth() + 1).padStart(2, "0")}-${String(hoje.getDate()).padStart(2, "0")}`;

    if (dataValidade.getFullYear() !== ano || dataValidade.getMonth() !== mes - 1 || dataValidade.getDate() !== dia) {
        throw new AppError("Data de validade inexistente!", 400);
    }

    if (data_entrega < hojeFormatado) {
        throw new AppError("A validade não pode ser anterior à data atual!", 400);
    }
    
    if (typeof titulo !== "string" || titulo.trim() === "") {
        throw new AppError("Titulo inválido!", 400);
    }

    if (typeof prioridade !== "string" || prioridade.trim() === "") {
        throw new AppError("Prioridade inválida!", 400);
    }

    const buscarCartaoPorId = await cartoesModel.buscarCartaoPorId(id_cartao, id_usuario);

    if (buscarCartaoPorId === null) {
        throw new AppError("Cartão não encontrado!", 404);
    }

    const resultado = await cartoesModel.atualizarCartoes(id_cartao, titulo, descricao, prioridade, data_entrega, id_usuario);

    if (resultado.affectedRows === 0) {
        throw new AppError("Você não tem permissão para atualizá-lo!", 404);
    }

    return {
        message: "Cartão atualizado com sucesso!"
    };
};

async function excluirCartaoService(id_cartao, id_usuario) {
    const buscarCartaoPorId = await cartoesModel.buscarCartaoPorId(id_cartao, id_usuario);

    if (buscarCartaoPorId === null) {
        throw new AppError("Cartão não encontrado!", 404);
    }

    const resultado = await cartoesModel.excluirCartao(id_cartao, id_usuario);
    
    if (resultado.affectedRows === 0) {
        throw new AppError("Você não tem permissão para exclui-lo!", 404);
    }

    return {
        message: "Cartão excluido com sucesso!"
    }
};

async function moverCartaoService(id_cartao, id_coluna_destino, posicao_destino, id_usuario) {
    const conn = await pool.getConnection();

    let transacaoIniciada = false;

    try {
        if (!Number.isInteger(posicao_destino) || posicao_destino < 0) {
            throw new AppError("Posição inválida!", 400);
        }

        await conn.beginTransaction();
        transacaoIniciada = true;

        const cartao = await cartoesModel.buscarCartaoPorIdMover(id_cartao, id_usuario, conn);

        if (cartao === null) {
            throw new AppError("Cartão não encontrado!", 404);
        }

        const colunaDestino = await cartoesModel.buscarColunaDestino(id_coluna_destino, id_usuario, conn);

        if (colunaDestino === null) {
            throw new AppError("Coluna não encontrada!", 404);
        }

        if (Number(cartao.id_quadro) !== Number(colunaDestino.id_quadro)) {
            throw new AppError("A coluna de destino pertence a outro quadro!", 400);
        }

        const id_coluna_origem = cartao.id_coluna;
        const posicao_antiga = cartao.posicao;

        if (
            Number(id_coluna_origem) === Number(id_coluna_destino) &&
            Number(posicao_antiga) === posicao_destino
        ) {
            await conn.commit();
            transacaoIniciada = false;

            return {
                message: "O cartão já está nessa posição!"
            };
        }

        if (Number(id_coluna_origem) === Number(id_coluna_destino)) {

            await cartoesModel.reordenarCartoesMesmaColuna(id_coluna_origem, posicao_antiga, posicao_destino, conn);

        } else {

            await cartoesModel.atualizarPosicoesOrigem(id_coluna_origem, posicao_antiga, conn);

            await cartoesModel.atualizarPosicoesDestino(id_coluna_destino, posicao_destino, conn);
        }

        const resultado = await cartoesModel.moverCartao(id_cartao, id_coluna_destino, posicao_destino, conn);

        if (resultado.affectedRows === 0) {
            throw new AppError("Não foi possível movimentar o cartão!", 404);
        }

        await conn.commit();
        transacaoIniciada = false;

        return {
            message: "Cartão movimentado com sucesso!"
        };

    } catch (erro) {

        if (transacaoIniciada) {
            await conn.rollback();
        }

        throw erro;

    } finally {
        conn.release();
    }
};

module.exports = {
    criarCartaoService,
    listarCartoesService,
    atualizarCartoesService,
    excluirCartaoService,
    moverCartaoService,
};