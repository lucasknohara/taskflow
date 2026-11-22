const express = require("express");
const cors = require("cors");
const errorHandler = require("../src/middleware/errorHandler.js");
const usuarioRouter = require("./routers/usuarioRouter.js");
const quadrosRouter = require("./routers/quadrosRouter.js");

const app = express();

app.use(cors());

app.use(express.json());

app.use("/api/usuarios", usuarioRouter);
app.use("/api/quadros", quadrosRouter);

app.get("/api/teste", (req, res) => {
    return res.status(200).json({
        message: "API rodando!"
    })
});

app.use(errorHandler);

module.exports = app