const express = require("express");
const cors = require("cors");
const errorHandler = require("../src/middleware/errorHandler.js");
const usuarioRouter = require("./routers/usuarioRouter.js");
const quadrosRouter = require("./routers/quadrosRouter.js");
const colunasRouter = require("./routers/colunasRouter.js");

const app = express();

app.use(cors());

app.use(express.json());

app.use("/api", usuarioRouter);
app.use("/api", quadrosRouter);
app.use("/api", colunasRouter);

app.get("/api/teste", (req, res) => {
    return res.status(200).json({
        message: "API rodando!"
    })
});

app.use(errorHandler);

module.exports = app