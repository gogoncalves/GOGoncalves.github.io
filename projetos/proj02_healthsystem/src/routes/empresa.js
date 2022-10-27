var express = require("express");
var router = express.Router();

var empresaController = require("../controllers/empresaController");

// router.get("/", function (req, res) {
//     usuarioController.testar(req, res);
// });

// router.get("/listar", function (req, res) {
//     usuarioController.listar(req, res);
// });

//Recebendo os dados do html e direcionando para a função cadastrar de empresaController.js
router.post("/cadastrarEmpresa", function (req, res) {
    empresaController.cadastrarEmpresa(req, res);
})

// router.post("/autenticar", function (req, res) {
//     usuarioController.entrar(req, res);
// });

module.exports = router;

console.log ("passei no routes")