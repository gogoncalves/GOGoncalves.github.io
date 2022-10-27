var database = require("../database/config")

function listar() {
    console.log("ACESSEI O USUARIO MODEL \n \n\t\t >> Se aqui der erro de 'Error: connect ECONNREFUSED',\n \t\t >> verifique suas credenciais de acesso ao banco\n \t\t >> e se o servidor de seu BD está rodando corretamente. \n\n function listar()");
    var instrucao = `
        SELECT * FROM usuario;
    `;
    console.log("Executando a instrução SQL: \n" + instrucao);
    return database.executar(instrucao);
}

function entrar(email, senha) {
    console.log("ACESSEI O USUARIO MODEL \n \n\t\t >> Se aqui der erro de 'Error: connect ECONNREFUSED',\n \t\t >> verifique suas credenciais de acesso ao banco\n \t\t >> e se o servidor de seu BD está rodando corretamente. \n\n function entrar(): ", email, senha)
    var instrucao = `
        SELECT * FROM usuario WHERE email = '${email}' AND senha = '${senha}';
    `;
    console.log("Executando a instrução SQL: \n" + instrucao);
    return database.executar(instrucao);
}

// Coloque os mesmos parâmetros aqui. Vá para a var instrucao
function cadastrar(nome, email, senha) {
    console.log("ACESSEI O USUARIO MODEL \n \n\t\t >> Se aqui der erro de 'Error: connect ECONNREFUSED',\n \t\t >> verifique suas credenciais de acesso ao banco\n \t\t >> e se o servidor de seu BD está rodando corretamente. \n\n function cadastrar():", nome, email, senha);
    
    // Insira exatamente a query do banco aqui, lembrando da nomenclatura exata nos valores
    //  e na ordem de inserção dos dados.
    var instrucao = `
        INSERT INTO usuario (nome, email, senha) VALUES ('${nome}', '${email}', '${senha}');
    `;
    console.log("Executando a instrução SQL: \n" + instrucao);
    return database.executar(instrucao);
}

function enviarResultadoQuiz(fkUsuario, porcentagem)
{
    let instrucao = `
    INSERT INTO quiz (fkUsuario, porcentagem) VALUES
	(${fkUsuario},${porcentagem});
    `
    
    console.log(`Executando a instrução: ${instrucao}`);
    return database.executar(instrucao);
}

function pegarDadosGraficoTentativas()
{
    let instrucao = `
    SELECT nome AS coluna, round(avg(porcentagem)) AS contagem
	FROM quiz
		JOIN usuario
			ON fkUsuario = idUsuario
				GROUP BY nome
                    ORDER BY round(avg(porcentagem)) ASC
						LIMIT 5; 
    `
    
    return database.executar(instrucao);
}



module.exports = {
    entrar,
    cadastrar,
    listar,
    enviarResultadoQuiz,
    pegarDadosGraficoTentativas
};