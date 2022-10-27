let express = require("express");
let router = express.Router();

let usuarioController = require("../controllers/usuarioController");

router.get("/", function (req, res) {
    usuarioController.testar(req, res);
});

router.get("/listar", function (req, res) {
    usuarioController.listar(req, res);
});

//Recebendo os dados do html e direcionando para a função cadastrar de usuarioController.js
router.post("/cadastrar", function (req, res) {
    usuarioController.cadastrar(req, res);
});

router.post("/autenticar", function (req, res) {
    usuarioController.entrar(req, res);
});

router.post("/quiz-resultado", function (req, res) {
    usuarioController.enviarResultadoQuiz(req, res);
});

router.get("/dados-grafico", (req, res) => {
    usuarioController.pegarDadosGraficoTentativas(req, res);
});

module.exports = router;