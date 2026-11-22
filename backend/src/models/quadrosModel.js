const connection = require("../config/database.js");

async function criarQuadro(id_usuario, nome, descricao) {
    const [resultado] = await connection.query(`
        INSERT INTO quadros(id_usuario, nome, descricao)
        VALUES (?, ?, ?)
    `, [id_usuario, nome, descricao]);

    return resultado;
};

async function buscarUsuarioPorId(id_usuario) {
    const [resultado] = await connection.query(`
        SELECT id FROM usuarios
        WHERE id = ?
        LIMIT 1
    `, [id_usuario]);

    return resultado[0] ?? null;
};

async function listarQuadros(id_usuario) {
    const [resultado] = await connection.query(`
        SELECT * FROM quadros
        WHERE id_usuario = ?
    `, [id_usuario]);
    
    return resultado;
};

module.exports = {
    criarQuadro,
    buscarUsuarioPorId,
    listarQuadros,
};