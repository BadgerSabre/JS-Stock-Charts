async function main() {
    const timeChartCanvas = document.querySelector('#time-chart');
    const highestPriceChartCanvas = document.querySelector('#highest-price-chart');
    const averagePriceChartCanvas = document.querySelector('#average-price-chart');
    
    let result = await fetch('https://api.twelvedata.com/time_series?symbol=GME,MSFT,DIS,BNTX&interval=1min&apikey=ae4bf80cd848465bb15ae550fc2f5bbb')
    let resJson = await result.json()
    const { GME, MSFT, DIS, BNTX } = mockData;
    const stocks = [GME, MSFT, DIS, BNTX];
    console.log(resJson)
    console.log(stocks.map( value => value.values.high).sort((a,b) => parseFloat(b) - parseFloat(a))[0])
    
    stocks.forEach( stock => stock.values.reverse())
    //Time Chart
    new Chart(timeChartCanvas.getContext('2d'), {
        type: 'line',
        data: {
            labels: stocks[0].values.map(value => value.datetime),
            datasets: stocks.map( stock => ({
                label: stock.meta.symbol,
                data: stock.values.map(value => parseFloat(value.high)),
                backgroundColor:  getColor(stock.meta.symbol),
                borderColor: getColor(stock.meta.symbol),
            }))
        }
    });
    //Highest Price Chart
    new Chart(highestPriceChartCanvas.getContext('2d'), {
        type: 'bar',
        data: {
            labels: stocks.map(value => value.meta.symbol),
            datasets: [{
                label: `Highest`,
                data: stocks.map(value => getHighestValue(value.values)),
                backgroundColor:  stocks.map(value => getColor(value.meta.symbol)),
                borderColor: stocks.map(value => getColor(value.meta.symbol)),
            }]
        }
    });
    //Average Stock Price Chart
    new Chart(averagePriceChartCanvas.getContext('2d'), {
        type: 'pie',
        data: {
            labels: stocks.map(value => value.meta.symbol),
            datasets: [{
                label: 'Average',
                data: stocks.map(value => getAverage(value.values)),
                backgroundColor:  stocks.map(value => getColor(value.meta.symbol)),
                borderColor: stocks.map(value => getColor(value.meta.symbol)),
            }]
        }
    });

    console.log(stocks[0].values)
}

function getColor(stock){
    if(stock === "GME"){
        return 'rgba(61, 161, 61, 0.7)'
    }
    if(stock === "MSFT"){
        return 'rgba(209, 4, 25, 0.7)'
    }
    if(stock === "DIS"){
        return 'rgba(18, 4, 209, 0.7)'
    }
    if(stock === "BNTX"){
        return 'rgba(166, 43, 158, 0.7)'
    }
}

function getHighestValue(values) {
    return values.map(value => value.high).sort((a,b) => parseFloat(b) - parseFloat(a))[0]
}

function getAverage(values) {
    return values.map(value => value.high).reduce((a,b) => parseFloat(a) + parseFloat(b)) / values.length
}

main()