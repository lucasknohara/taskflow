const connection = require("../config/database.js");

async function criarUsuario(nome, email, senha) {
    const [resultado] = await connection.query(`
        INSERT INTO usuarios(nome, email, senha)
        VALUES (?, ?, ?)
    `, [nome, email, senha]);

    return resultado
};

async function buscarUsuarioPorEmail(email) {
    const [resultado] = await connection.query(`
        SELECT id, nome, senha FROM usuarios
        WHERE email = ? 
        LIMIT 1
    `, [email]);

    return resultado[0] ?? null;
};

async function buscarUsuarioPorId(id_usuario) {
    const [resultado] = await connection.query(`
        SELECT nome, email FROM usuarios
        WHERE id = ?
        LIMIT 1
    `, [id_usuario]);

    return resultado[0] ?? null;
};

async function atualizarUsuario(id_usuario, nome, email) {
    const [resultado] = await connection.query(`
        UPDATE usuarios
        SET nome = ?, email = ?
        WHERE id = ?
    `, [nome, email, id_usuario]);

    return resultado;
};

module.exports = {
    criarUsuario,
    buscarUsuarioPorEmail,
    buscarUsuarioPorId,
    atualizarUsuario,
};