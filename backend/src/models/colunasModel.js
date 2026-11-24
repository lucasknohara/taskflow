const connection = require("../config/database.js");

async function criarColunas(id_quadro, nome, posicao) {
    const [resultado] = await connection.query(`
        INSERT INTO colunas(id_quadro, nome, posicao)
        VALUES (?, ?, ?)      
    `, [id_quadro, nome, posicao]);

    return resultado;
};

async function listarColunas(id_quadro) {
    const [resultado] = await connection.query(`
        SELECT * FROM colunas
        WHERE id_quadro = ? 
        ORDER BY posicao ASC
    `, [id_quadro]);

    return resultado;
};

async function atualizarColunas(id_coluna, nome, id_usuario) {
    const [resultado] = await connection.query(`
        UPDATE colunas c
        INNER JOIN quadros q ON q.id = c.id_quadro
        SET c.nome = ?
        WHERE c.id = ? AND q.id_usuario = ?
    `, [nome, id_coluna, id_usuario]);

    return resultado;
};

async function buscarColunaPorId(id_coluna, id_usuario) {
    const [resultado] = await connection.query(`
        SELECT c.id FROM colunas c
        INNER JOIN quadros q ON q.id = c.id_quadro
        WHERE c.id = ? AND q.id_usuario = ?
        LIMIT 1
    `, [id_coluna, id_usuario]);
    
    return resultado[0] ?? null;
};

async function deletarColuna(id_coluna, id_usuario) {
    const [resultado] = await connection.query(`
        DELETE c 
        FROM colunas AS c
        INNER JOIN quadros AS q ON q.id = c.id_quadro
        WHERE c.id = ? AND q.id_usuario = ?
    `, [id_coluna, id_usuario]);

    return resultado;
};

module.exports = {
    criarColunas,
    listarColunas,
    atualizarColunas,
    buscarColunaPorId,
    deletarColuna,
};