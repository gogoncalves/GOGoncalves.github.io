/* Variaveis */
let tentativas = 6;
let listaDinamica = [];
let palavraSecretadica;
let palavraSecretaSorteada;

/* Lista de palavras/objetos: */
const palavras = [
    palavra001 = {
        nome: "CPU",
        dica: "Qual é a sigla para Central Process Unit?"
    },
    palavra002 = {
        nome: "ULA",
        dica: "Circuito digital que realiza operações lógicas e aritméticas."
    },
    palavra003 = {
        nome: "REGISTRADORES",
        dica: "Tipo de memória que se encontra no topo da hierarquia de memória."
    },
    palavra004 = {
        nome: "RAM",
        dica: "Tipo de memória volátil que tem como nome Random Acess Memory."
    },
    palavra005 = {
        nome: "ROM",
        dica: "Tipo de memória não volátil que oferece dados apenas para leitura."
    },
    palavra006 = {
        nome: "EPROM",
        dica: "Tipo de memória não volátil que precisa ter seu chip exposto a luz ultravioleta para apagar seu conteúdo."
    },
    palavra007 = {
        nome: "FLASH",
        dica: "Tipo particular de EEPROM que mantém as informações armazenadas sem a necessidade de uma fonte de energia elétrica."
    },
    palavra008 = {
        nome: "MEMORIADEMASSA",
        dica: "Tipo de memória que precisa ter seu conteúdo copiado na RAM para poder ser executado pela CPU."
    },
    palavra009 = {
        nome: "DMA",
        dica: "Permite que periféricos acessem diretamente a RAM sem ocupar processamento."
    },
    palavra010 = {
        nome: "CS",
        dica: "Utilizado para selecionar um ou um conjunto de circuitos que estão conectados no computador."
    },
    palavra011 = {
        nome: "ADRESSBUS",
        dica: "Trilhas frequentemente utilizadas para se referir a um endereço físico na memória."
    },
    palavra012 = {
        nome: "DATABUS",
        dica: "Também chamado de Memory Bus. É responsável para carregar os dados."
    },
    palavra013 = {
        nome: "DUALCORE",
        dica: "Tipo de processador que possui dois processadores no mesmo circuito integrado."
    },
    palavra014 = {
        nome: "QUADCORE",
        dica: "Segue o mesmo princípio de um dual-core, mas agora em teoria tem o dobro da capacidade de processamento."
    },
    palavra015 = {
        nome: "ICINCO",
        dica: "É uma das séries de processadores para desktops e notebooks da Intel e possui quatro núcleos."
    },
    palavra016 = {
        nome: "ISETE",
        dica: "Faz parte das séries de processadores da Intel, tanto para desktop quanto para notebooks e seu lançamento foi em 2008."
    }
];

/* Palavra que precisa ser descoberta: */
criarPalavraSecreta();
function criarPalavraSecreta() {
    /* Gerar um numero aleatorio: */
    const indexPalavra = parseInt(Math.random() * palavras.length) /* Multiplicar pelo Tamanho da lista */

    palavraSecretaSorteada = palavras[indexPalavra].nome;
    palavraSecretadica = palavras[indexPalavra].dica;
}

montarPalavraNaTela();
function montarPalavraNaTela() {
    const dica = document.getElementById("dica");
    dica.innerHTML = palavraSecretadica;

    const palavraTela = document.getElementById("palavra-secreta");
    palavraTela.innerHTML = "";

    for (i = 0; i < palavraSecretaSorteada.length; i++) {
        if (listaDinamica[i] == undefined) {
            listaDinamica[i] = "&nbsp;"
            palavraTela.innerHTML = palavraTela.innerHTML + "<div class='letras'>" + listaDinamica[i] + "</div>"
        }
        else {
            palavraTela.innerHTML = palavraTela.innerHTML + "<div class='letras'>" + listaDinamica[i] + "</div>"
        }
    }
}

function verificaLetraEscolhida(letra) {
    document.getElementById("tecla-" + letra).disabled = true;
    if (tentativas > 0) {
        mudarStyleLetra("tecla-" + letra);
        comparalistas(letra);
        montarPalavraNaTela();
    }
}

function mudarStyleLetra(tecla) {
    document.getElementById(tecla).style.background = "#000000";
    document.getElementById(tecla).style.color = "#ffffff";
}

function comparalistas(letra) {
    const pos = palavraSecretaSorteada.indexOf(letra)
    if (pos < 0) {
        tentativas--
        carregaImagemForca();

        if (tentativas == 0) {
            abreModal("OPS!", "Não foi dessa vez ... A palavra secreta era <br>" + palavraSecretaSorteada);
        }
    }
    else {
        for (i = 0; i < palavraSecretaSorteada.length; i++) {
            if (palavraSecretaSorteada[i] == letra) {
                listaDinamica[i] = letra;
            }
        }
    }

    let vitoria = true;
    for (i = 0; i < palavraSecretaSorteada.length; i++) {
        if (palavraSecretaSorteada[i] != listaDinamica[i]) {
            vitoria = false;
        }
    }

    if (vitoria == true) {
        abreModal("PARABÉNS!", "Você venceu...");
        tentativas = 0;
    }
}

function carregaImagemForca() {
    switch (tentativas) {
        case 5:
            document.getElementById("imagem").style.background = "url('forca01.png')";
            break;
        case 4:
            document.getElementById("imagem").style.background = "url('forca02.png')";
            break;
        case 3:
            document.getElementById("imagem").style.background = "url('forca03.png')";
            break;
        case 2:
            document.getElementById("imagem").style.background = "url('forca04.png')";
            break;
        case 1:
            document.getElementById("imagem").style.background = "url('forca05.png')";
            break;
        case 0:
            document.getElementById("imagem").style.background = "url('forca06.png')";
            break;
        default:
            document.getElementById("imagem").style.background = "url('forca.png')";
            break;
    }
}

function abreModal(titulo, mensagem) {
    let modalTitulo = document.getElementById("exampleModalLabel");
    modalTitulo.innerText = titulo;

    let modalBody = document.getElementById("modalBody");
    modalBody.innerHTML = mensagem;

    $("#myModal").modal({
        show: true
    });
}

let bntReiniciar = document.querySelector("#btnReiniciar")
bntReiniciar.addEventListener("click", function () {
    location.reload();
});




