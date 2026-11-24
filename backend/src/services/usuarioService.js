const AppError = require("../errors/AppError.js");
const usuarioModel = require("../models/usuarioModel.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

async function criarUsuarioService(nome, email, senha) {
    if (typeof nome !== "string" || nome.trim() === "") {
        throw new AppError("Nome inválido!", 400);
    }

    if (typeof email !== "string" || email.trim() === "") {
        throw new AppError("Email inválido!", 400);
    }

    if (typeof senha !== "string" || senha.trim() === "" || senha.length < 8) {
        throw new AppError("Senha inválida!", 400);
    }

    const emailNormalizado = email.trim().toLowerCase();
    const usuarioExistente = await usuarioModel.buscarUsuarioPorEmail(emailNormalizado);

    if (usuarioExistente !== null) {
        throw new AppError("Email já cadastrado!", 409);
    }

    const senha_hash = await bcrypt.hash(senha, 10);

    const resultado = await usuarioModel.criarUsuario(nome, emailNormalizado, senha_hash);

    return {
        id: resultado.insertId,
        nome: nome,
        email: email
    };
};

async function loginUsuarioService(email, senha) {
    if (typeof email !== "string" || email.trim() === "") {
        throw new AppError("Email ou senha inválidos!", 400);
    }

    if (typeof senha !== "string" || senha.trim() === "" || senha.length < 8) {
        throw new AppError("Email ou senha inválidos!", 400);
    }

    const emailNormalizado = email.trim().toLowerCase();
    const usuarioExistente = await usuarioModel.buscarUsuarioPorEmail(emailNormalizado);

    if (usuarioExistente === null) {
        throw new AppError("Email ou senha inválidos!", 401);
    }

    const senhaNormalizada = await bcrypt.compare(senha, usuarioExistente.senha);

    if (!senhaNormalizada) {
        throw new AppError("Email ou senha inválidos!", 401);
    }

    const token = jwt.sign(
        {
            id: usuarioExistente.id
        },
        process.env.JWT_SECRET,
        {
            expiresIn: "1h"
        }
    )

    return {
        id: usuarioExistente.id,
        nome: usuarioExistente.nome,
        email: email,
        token: token
    };
};

async function buscarUsuarioPorIdService(id_usuario) {
    const resultado = await usuarioModel.buscarUsuarioPorId(id_usuario);

    if (resultado === null) {
        throw new AppError("Não foi possivel encontrar usuário!", 404);
    }

    return  {
        "usuario": {
          "nome": resultado.nome,
          "email": resultado.email
        }
    }
};

async function atualizarUsuarioService(id_usuario, nome, email) {
    const buscarUsuarioPorId = await usuarioModel.buscarUsuarioPorId(id_usuario);

    if (buscarUsuarioPorId === null) {
        throw new AppError("Não foi possivel encontrar usuário!", 404);
    }
    
    if (typeof nome !== "string" || nome.trim() === "") {
        throw new AppError("Nome inválido!", 400);
    }

    if (typeof email !== "string" || email.trim() === "") {
        throw new AppError("Email inválido!", 400);
    }

    const resultado = usuarioModel.atualizarUsuario(id_usuario, nome, email);

    return {
        message: "Usuário atualizado com sucesso!"
    };
};

module.exports = {
    criarUsuarioService,
    loginUsuarioService,
    buscarUsuarioPorIdService,
    atualizarUsuarioService,
};