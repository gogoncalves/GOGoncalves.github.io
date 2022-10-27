var database = require("../database/config");

function buscarUltimasMedidas(idMaquina, limite_linhas) {

    instrucaoSql = ''

    instrucaoSql = ''

    if (process.env.AMBIENTE_PROCESSO == "producao") {
        instrucaoSql = `select top ${limite_linhas}
        dht11_temperatura as temperatura, 
        dht11_umidade as umidade,  
                        momento,
                        FORMAT(momento, 'HH:mm:ss') as momento_grafico
                    from medida
                    where fk_aquario = ${idAquario}
                    order by id desc`;
    } else if (process.env.AMBIENTE_PROCESSO == "desenvolvimento") {
        instrucaoSql = `select valor as valor,
        DATE_FORMAT(momento,'%H:%i:%s') as momentoGrafico,
           idEquipamento as idEquipamento, nomeComponente as nomeComponente
       from leitura join equipamento 
           join componente where fkEquipamento= idEquipamento 
               and fkcomponente = idcomponente and fkEquipamento = ${idMaquina};`;
    } else {
        console.log("\nO AMBIENTE (produção OU desenvolvimento) NÃO FOI DEFINIDO EM app.js\n");
        return
    }

    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}



    // const hoje = new Date();
    // const horaInicial = 8;
    // const data = `${hoje.getFullYear()}-${hoje.getMonth()+1}-${hoje.getDate()}`;

    // instrucaoSql = 'select * from (';
    // instrucaoSql += `
    // (select SUM(chave) as contagem, '${horaInicial.toString().padStart(2, '0')}:00' as 'momento_grafico' from medida 
    //     where momento >= '${data} ${horaInicial}:00:00' and momento < '${data} ${horaInicial+1}:00:00')
    // `;
    
    
    // const horaFinal = new Date().getHours() + 1;
    // for (let hora = horaInicial+1; hora < horaFinal; hora++) {
    //     instrucaoSql += ` UNION 
    //     (select SUM(chave) as contagem, '${hora.toString().padStart(2, '0')}:00' as 'momento_grafico' from medida 
    //     where momento >= '${data} ${hora}:00:00' and momento < '${data} ${hora+1}:00:00')
    //    `
    // }

    // instrucaoSql += ') as u ORDER by u.momento_grafico;';
        
    // console.log("Executando a instrução SQL: \n" + instrucaoSql);
    // return database.executar(instrucaoSql);


function buscarMedidasEmTempoReal(idAquario) {

    instrucaoSql = ''

/*     if (process.env.AMBIENTE_PROCESSO == "producao") {
        instrucaoSql = `select top 1
        dht11_temperatura as temperatura, 
        dht11_umidade as umidade,  
                        CONVERT(varchar, momento, 108) as momento_grafico, 
                        fkAquario 
                        from medida where fkAquario = ${idAquario} 
                    order by id desc`;

    } else if (process.env.AMBIENTE_PROCESSO == "desenvolvimento") {
        instrucaoSql = `select sum(chave), DATE_FORMAT(momento, '%H:%i:%s') as momento_grafico, fk_Aquario
		from medida 
				join aquario
					on fk_Aquario = ${idAquario}
		order by idMedida`;
    } else {
        console.log("\nO AMBIENTE (produção OU desenvolvimento) NÃO FOI DEFINIDO EM app.js\n");
        return
    }
 */
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function buscarMaquinas() {

    instrucaoSql = ''

     if (process.env.AMBIENTE_PROCESSO == "producao") {
        instrucaoSql = `select top 1
        dht11_temperatura as temperatura, 
        dht11_umidade as umidade,  
                        CONVERT(varchar, momento, 108) as momento_grafico, 
                        fkAquario 
                        from medida where fkAquario = ${idAquario} 
                    order by id desc`;

    } else if (process.env.AMBIENTE_PROCESSO == "desenvolvimento") {
        instrucaoSql = `select count(idEquipamento) as maquinas from equipamento;`;
    } else {
        console.log("\nO AMBIENTE (produção OU desenvolvimento) NÃO FOI DEFINIDO EM app.js\n");
        return
    }
 
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}


module.exports = {
    buscarUltimasMedidas,
    buscarMedidasEmTempoReal,
    buscarMaquinas
}
