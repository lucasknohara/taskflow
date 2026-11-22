const express = require("express");
const cors = require("cors");
const errorHandler = require("../src/middleware/errorHandler.js");
const usuarioRouter = require("../src/routers/usuarioRouter.js");

const app = express();

app.use(cors());

app.use(express.json());

app.use("/api/usuarios", usuarioRouter);

app.get("/api/teste", (req, res) => {
    return res.status(200).json({
        message: "API rodando!"
    })
});

app.use(errorHandler);

module.exports = app