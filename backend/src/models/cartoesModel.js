const connection = require("../config/database.js");

async function criarCartao(id_coluna, titulo, descricao, prioridade, data_entrega, posicao) {
    const [resultado] = await connection.query(`
        INSERT INTO cartoes(id_coluna, titulo, descricao, prioridade, data_entrega, posicao)
        VALUES (?, ?, ?, ?, ?, ?)
    `, [id_coluna, titulo, descricao, prioridade, data_entrega, posicao]);

    return resultado;
};

async function buscarColunaPorId(id_coluna, id_usuario) {
    const [resultado] = await connection.query(`
        SELECT c.id FROM colunas c
        INNER JOIN quadros q ON c.id_quadro = q.id
        WHERE c.id = ? AND q.id_usuario = ?
        LIMIT 1
    `, [id_coluna, id_usuario]);

    return resultado[0] ?? null;
};

async function buscarProximaPosicao(id_coluna) {
    const [resultado] = await connection.query(`
        SELECT COALESCE(MAX(posicao) + 1, 0) AS proxima_posicao
        FROM cartoes
        WHERE id_coluna = ?;
    `, [id_coluna]);

    return resultado[0].proxima_posicao;
};

async function listarCartoes(id_coluna) {
    const [resultado] = await connection.query(`
        SELECT * FROM cartoes 
        WHERE id_coluna = ?
        ORDER BY posicao ASC
    `, [id_coluna]);

    return resultado;
};

async function atualizarCartoes(id_cartao, titulo, descricao, prioridade, data_entrega, id_usuario) {
    const [resultado] = await connection.query(`
        UPDATE cartoes ca
        INNER JOIN colunas co ON co.id = ca.id_coluna
        INNER JOIN quadros q ON q.id = co.id_quadro
        SET ca.titulo = ?, ca.descricao = ?, ca.prioridade = ?, ca.data_entrega = ?
        WHERE ca.id = ? AND q.id_usuario = ?
    `, [titulo, descricao, prioridade, data_entrega, id_cartao, id_usuario]);

    return resultado;
};

async function buscarCartaoPorId(id_cartao, id_usuario) {
    const [resultado] = await connection.query(`
        SELECT ca.id FROM cartoes ca
        INNER JOIN colunas co ON co.id = ca.id_coluna
        INNER JOIN quadros q ON q.id = co.id_quadro
        WHERE ca.id = ? AND q.id_usuario = ?
        LIMIT 1
    `, [id_cartao, id_usuario]);

    return resultado[0] ?? null;
};

async function excluirCartao(id_cartao, id_usuario) {
    const [resultado] = await connection.query(`
        DELETE ca
        FROM cartoes AS ca
        INNER JOIN colunas co ON co.id = ca.id_coluna
        INNER JOIN quadros q ON q.id = co.id_quadro
        WHERE ca.id = ? AND q.id_usuario = ?
    `, [id_cartao, id_usuario]);

    return resultado;
};

async function buscarCartaoPorIdMover(id_cartao, id_usuario, conn) {
    const [resultado] = await conn.query(`
        SELECT ca.id AS id_cartao, ca.id_coluna, ca.posicao, co.id_quadro FROM cartoes ca
        INNER JOIN colunas co ON co.id = ca.id_coluna
        INNER JOIN quadros q ON q.id = co.id_quadro
        WHERE ca.id = ? AND q.id_usuario = ?
        LIMIT 1
    `, [id_cartao, id_usuario]);

    return resultado[0] ?? null;
};

async function buscarColunaDestino(id_coluna, id_usuario, conn) {
    const [resultado] = await conn.query(`
        SELECT co.id AS id_coluna, co.id_quadro FROM colunas co
        INNER JOIN quadros q ON q.id = co.id_quadro
        WHERE co.id = ? AND q.id_usuario = ?
        LIMIT 1
    `, [id_coluna, id_usuario]);

    return resultado[0] ?? null;
};

async function atualizarPosicoesOrigem(id_coluna, posicao_antiga, conn) {
    const [resultado] = await conn.query(`
        UPDATE cartoes
        SET posicao = posicao - 1
        WHERE id_coluna = ?
        AND posicao > ?
    `, [id_coluna, posicao_antiga]);

    return resultado;
};

async function moverCartao(id_cartao, id_coluna_destino, posicao_destino, conn) {
    const [resultado] = await conn.query(`
        UPDATE cartoes
        SET id_coluna = ?, posicao = ?
        WHERE id = ?
    `, [id_coluna_destino, posicao_destino, id_cartao]);

    return resultado;
};

async function atualizarPosicoesDestino(id_coluna, posicao_destino, conn) {
    const [resultado] = await conn.query(`
        UPDATE cartoes
        SET posicao = posicao + 1
        WHERE id_coluna = ?
        AND posicao >= ?
    `, [id_coluna, posicao_destino]);

    return resultado;
};

async function reordenarCartoesMesmaColuna(id_coluna, posicao_antiga, posicao_destino, conn) {
    if (posicao_antiga > posicao_destino) {

        const [resultado] = await conn.query(`
            UPDATE cartoes
            SET posicao = posicao + 1
            WHERE id_coluna = ?
            AND posicao >= ?
            AND posicao < ?
        `, [id_coluna, posicao_destino, posicao_antiga]);

        return resultado;

    } else if (posicao_antiga < posicao_destino) {

        const [resultado] = await conn.query(`
            UPDATE cartoes
            SET posicao = posicao - 1
            WHERE id_coluna = ?
            AND posicao > ?
            AND posicao <= ?
        `, [id_coluna, posicao_antiga, posicao_destino]);

        return resultado;
    }
};

module.exports = {
    criarCartao,
    buscarColunaPorId,
    buscarProximaPosicao,
    listarCartoes,
    atualizarCartoes,
    buscarCartaoPorId,
    excluirCartao,
    buscarCartaoPorIdMover,
    buscarColunaDestino,
    atualizarPosicoesOrigem,
    moverCartao,
    atualizarPosicoesDestino,
    reordenarCartoesMesmaColuna,
};