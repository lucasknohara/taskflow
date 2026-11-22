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
        SELECT id FROM usuarios
        WHERE email = ? 
        LIMIT 1
    `, [email]);

    return resultado[0] ?? null;
};

module.exports = {
    criarUsuario,
    buscarUsuarioPorEmail,
};