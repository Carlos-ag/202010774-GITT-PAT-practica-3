// this function is called when the user clicks on the search button

var API_KEYS = ["2B176BA76YRHIWDI", "ZPWHHJ1VEJJFZYLS", "KL69KTDSTMYQ86TB", "5G7XH8VXOPD5ZNHS", "J024F2FKA2OZQ6WF", "0E8ZUXMLUG8GJGUR"]
var apiIndex = 0;

function getAPIKey() {
  return API_KEYS[apiIndex];
}

function changeAPIIndex(functionToReload) {
  // add a tracking to know if all the API keys have been used
  console.log("API index: " + apiIndex);
  if (apiIndex < API_KEYS.length - 1) {
    apiIndex++;
    functionToReload();
    return true;
  }
  else {
    console.log("All the API keys have been used");
    apiIndex = 0;
    return false;
  }
}



function tickerSearch(searchedValue) {
  var requestOptions = {
    method: 'GET',
    redirect: 'follow'
  };

  const searchResult = document.getElementById("search-results");
  searchResult.innerHTML = "";

  let url = "https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=" + searchedValue + "&apikey=" + getAPIKey();
  // url = "https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=tesco&apikey=demo"

  fetch(url, requestOptions)
    .then(response => response.text())
    .then(result => {
      let data = JSON.parse(result);
      let matches = data.bestMatches;
      // search-results is the id of the div that will contain the search results
      for (let i = 0; i < matches.length; i++) {
        let match = matches[i];
        let ticker = match["1. symbol"];
        let name = match["2. name"];
        let currency = match["8. currency"];

        // create a div for each search result
        let div = document.createElement("div");
        div.classList.add("search-result");
        div.innerHTML = "<strong>" + ticker + "</strong>" + "&nbsp;-&nbsp;" + name;
        // 
        searchResult.appendChild(div);

        // when click on a search result, the search bar will be filled with the ticker
        div.addEventListener("click", function () {
          stockInfoScreen(ticker, name, currency);
        });
      }

    })
    .catch(error => { 
      if (changeAPIIndex(tickerSearch(searchedValue))) {
        return;
      }
      else {
        alert("Error: " + error);
      }
       });
}

////////////////////////////////////////////////////////////////////////

///////////////////////////////////////////

function getCurrencySymbol(currency) {
  switch (currency) {
    case "USD":
      return "$";
    case "EUR":
      return "€";
    case "GBP":
      return "£";
    default:
      return "";
  }
}

function createChartData(mapStockData) {
  const dates = Object.keys(mapStockData);
  const chartData = {
    labels: dates.reverse(),
    datasets: [{
      label: "Stock Data",
      data: [],
      fill: false,
      backgroundColor: "rgba(0, 0, 0, 0)",
      borderColor: "rgba(241, 158, 58, 0.5)",
      borderWidth: 1
    }]
  };

  chartData.labels.forEach(date => {
    const stockData = mapStockData[date];
    const closePrice = parseFloat(stockData["5. adjusted close"]);
    chartData.datasets[0].data.push(closePrice);
  });

  return chartData;
}




function filterData(period) {
  let filteredData = {};

  if (period === "max") {
    filteredData = mapStockData;
  }
  else if (period === "1d"){
    let date = dates[0];
    filteredData[date] = mapStockData[date];
  }
  else {
    let numberOfDays = 0;

    switch (period) {
      case "5d":
        numberOfDays = 5;
        break;
      case "1m":
        numberOfDays = 30 - 2*4;
        break;
      case "3m":
        numberOfDays = 90 - 2*4*3;
        break;
      case "6m":
        numberOfDays = 180 - 2*4*6;
        break;
      case "1y":
        numberOfDays = 365 - 2*4*12;
        break;
      case "5y":
        numberOfDays = 1825 - 2*4*12*5;
        break;
      default:
        numberOfDays = 0;
    }

    let filteredDates = dates.slice().reverse().slice(-numberOfDays);
 
      for (let i = filteredDates.length - 1; i >= 0; i--) {

      let date = filteredDates[i];
      filteredData[date] = mapStockData[date];
    }
  }

  return filteredData;
}

















function startLoading() {
  const loaderCenterScreen = document.getElementById("loader-right-screen");
  loaderCenterScreen.style.visibility = "visible";
  $("#content").hide();
}

function stopLoading() {
  const loaderCenterScreen = document.getElementById("loader-right-screen");
  loaderCenterScreen.style.visibility = "hidden";
      $("#content").show();
}


var mapStockData;
var dates;

function stockInfoScreen(tickerSearched, stockName, currency, period = "max") {
  
  startLoading();

  document.title = stockName + " (" + tickerSearched + ") - Stockify";
  $("#content").load("../html/stockInfo.html");

  // =================== API CALLS ===================
  var requestOptions = {
    method: 'GET',
    redirect: 'follow'
  };

  let url = "https://www.alphavantage.co/query?function=TIME_SERIES_DAILY_ADJUSTED&symbol=" + tickerSearched + "&outputsize=full&adjusted=true&apikey=ZPWHHJ1VEJJFZYLS";
  
  fetch(url, requestOptions)
    .then(response => response.text())
    .then(result => {
      let data = JSON.parse(result);

      mapStockData = data["Time Series (Daily)"];
      dates = Object.keys(mapStockData);
      let latestDate = dates[0];
      let latestData = mapStockData[latestDate];
      let latestClose = latestData["5. adjusted close"];


      let stockInfoHeaderName = document.getElementById("stock-info-header-name");
      stockInfoHeaderName.innerHTML = stockName + " (" + tickerSearched + ")";
      let stockInfoHeaderPrice = document.getElementById("stock-info-header-price");
      stockInfoHeaderPrice.innerHTML = getCurrencySymbol(currency) + "&nbsp;" + latestClose;

      // chart with chart.js

      createChart("max");
      changePeriodListners();

      stopLoading();
      


    })
    .catch(error => {
      console.log('error', error);
      if (changeAPIIndex(stockInfoScreen(tickerSearched, stockName, currency, period))) {
        return;
      }
      else {
        let stockInfoHeaderName = document.getElementById("stock-info-header-name");
        stockInfoHeaderName.innerHTML = "There was an error loading the stock data.";
        stopLoading();
        alert("Error: " + error);
      }

    });

  // =================== CONTENT ===================
}


var chartInstance = null;
function createChart(period) {
  let filteredData = filterData(period);
  // let filteredData = mapStockData;
  let chartData = createChartData(filteredData);

  const ctx = document.getElementById('chart').getContext('2d');
  if (chartInstance) {
    chartInstance.destroy();
  }
  chartInstance = new Chart(ctx, {
    type: 'line',
    data: chartData,
    options: {
      responsive: true,
      scales: {
        yAxes: [{
          ticks: {
            beginAtZero: true
          }
        }]
      }
    }
  });
  

}



function changePeriodListners() {
const radioButtons = {"1d-radio-button": "1d", "5d-radio-button": "5d", "1m-radio-button": "1m", "6m-radio-button": "6m", "1y-radio-button": "1y", "5y-radio-button": "5y", "max-radio-button": "max"};
  for (const [key, value] of Object.entries(radioButtons)) {
    let radioButton = document.getElementById(key);

    radioButton.addEventListener("click", function() {
      startLoading();
      createChart(value);
      stopLoading();
    });
  }
}

