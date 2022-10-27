const ctx = document.getElementById('myChart').getContext('2d');
let labels = [];
let dados = [];    
                                    
const data = {
    labels,
    datasets: [{
        data: dados,
        label: 'Analise de Desenvolvimento Sustentavel',
        fill: true,
        color: ['#000000'],
        backgroundColor: [
        'rgba(0, 255, 55, 0.583)'
        ],
        borderColor: [
            '#000000',
          ],
          borderWidth: 1 
    }]
};

let config = {
    type: 'bar',
    data,
    options: {
        responsive: true,
        scales: {
            yAxes: [{
            	ticks: {
                	beginAtZero: true,
                    stepSize: 5,
                }
        	}],
            y : {
                ticks: {
                    callback: function(value)
                        {
                            let finalValue = value
                                return finalValue + '%';
                        },
                }
            }            
    	},
        
    }
};

const myChart = new Chart(ctx, config);

const pegarDadosGrafico = () => {

    fetch('/usuarios/dados-grafico',{cache: 'no-store'})
        .then((resposta) =>{
            if(resposta.ok)
            {
                resposta.json()
                    .then(json =>{
                        console.log(JSON.stringify(json));
                        plotarGrafico(json);
                    })
                    .catch((erro) =>{
                        console.log(erro);
                    })
                    
            }
        })
        .catch((erro) => {
            console.log(erro);
        })

}

const plotarGrafico = (json) => 
{
    labels.length = 0;
    dados.length = 0;

    config.options.y = {"max": 100};  
    for(let i = 0; i < json.length; i++)
    {
        let registro = json[i]
    
        labels.push(registro.coluna);
        dados.push(registro.contagem);
    }
        
    myChart.update()
}



