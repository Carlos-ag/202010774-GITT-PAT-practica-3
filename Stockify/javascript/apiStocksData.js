// this function is called when the user clicks on the search button

function tickerSearch(searchedValue) {
  var requestOptions = {
    method: 'GET',
    redirect: 'follow'
  };

  const searchResult = document.getElementById("search-results");
  searchResult.innerHTML = "";

  let url = "https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=" + searchedValue + "&apikey=ZPWHHJ1VEJJFZYLS";
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
    .catch(error => { console.log('error', error) });
}



///////////////////////// 

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



function createChartData(dates, mapStockData) {
  mapStockData
  let chartData = {
    type: "line",
    data: {
      labels: dates.reverse(), // reverse the order of the dates array
      datasets: [{
        label: "Price",
        data: dates.map(date => {
          mapStockData[date]["5. adjusted close"]}), // reverse the order of the data array
        backgroundColor: "rgba(0, 0, 0, 0)",
        borderColor: "rgba(241, 158, 58, 0.5)",
        borderWidth: 1
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        xAxes: [{
          ticks: {
            reverse: true // set reverse to true to invert x-axis labels
          }
        }],
        yAxes: [{
          ticks: {
            beginAtZero: false
          }
        }]
      }
    }
  };
  return chartData;
}




function filterData(period) {
  console.log(mapStockData);
  let filteredDates = [];
  let filteredData = {};

  if (period == "max") {
    filteredDates = dates;
    filteredData = mapStockData;
  }
  else {
    let today = new Date();
    let todayString = today.toISOString().split("T")[0];
    let todayIndex = dates.indexOf(todayString);
    let numberOfDays = 0;

    switch (period) {
      case "1d":
        numberOfDays = 1;
        break;
      case "5d":
        numberOfDays = 5;
        break;
      case "1m":
        numberOfDays = 30;
        break;
      case "3m":
        numberOfDays = 90;
        break;
      case "6m":
        numberOfDays = 180;
        break;
      case "1y":
        numberOfDays = 365;
        break;
      case "5y":
        numberOfDays = 1825;
        break;
      default:
        numberOfDays = 0;
    }

    let startIndex = todayIndex - numberOfDays;
    if (startIndex < 0) {
      startIndex = 0;
    }

    filteredDates = dates.slice(startIndex, todayIndex + 1);
    filteredDates.reverse();

    for (let i = 0; i < filteredDates.length; i++) {
      let date = filteredDates[i];
      filteredData[date] = mapStockData[date];
    }
  }
  console.log(filteredData);
  return { dates: filteredDates, data: filteredData };
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
  // url = "https://www.alphavantage.co/query?function=TIME_SERIES_DAILY_ADJUSTED&symbol=IBM&outputsize=full&apikey=demo"

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
    .catch(error => console.log('error', error));

  // =================== CONTENT ===================
}

var chartInstance = null;
function createChart(period) {
  // let filteredData = filterData(period);
  let filteredData = mapStockData;
  dates = filteredData.dates;
  mapStockData = filteredData.data;
  let chartData = createChartData(dates, mapStockData);

  let chart = document.getElementById("chart").getContext("2d");
  if (chartInstance) {
    chartInstance.destroy();
  }
  chartInstance = new Chart(chart, chartData);

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

