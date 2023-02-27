
function tickerSearch(searchedValue) {
  console.log("busqueda API: ");
  var requestOptions = {
      method: 'GET',
      redirect: 'follow'
    };

    const searchResult = document.getElementById("search-results");
    searchResult.innerHTML = "";

    let url = "https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords="+searchedValue+"&apikey=ZPWHHJ1VEJJFZYLS";
    url = "https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=tesco&apikey=demo"



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
          div.innerHTML = "<strong>"+ticker +"</strong>" + "&nbsp;-&nbsp;" + name;
          // 
          searchResult.appendChild(div);

          // when click on a search result, the search bar will be filled with the ticker
          div.addEventListener("click", function () {
            tickerSearched(ticker, name, currency);
          });
          


        }
        
      })
      .catch(error => {console.log('error', error)});



}

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



function tickerSearched(tickerSearched, stockName, currency) {
  // =================== CONTENT ===================
  // show the element with class "loading"
  $(".loading").show();
  // hide the element with class "content"
  $(".content").hide();  
  document.title = stockName + " (" + tickerSearched + ") - Stockify";
  $("#content").load("../html/stockInfo.html");  
  
  // =================== API CALLS ===================
  var requestOptions = {
    method: 'GET',
    redirect: 'follow'
  };

  let url = "https://www.alphavantage.co/query?function=TIME_SERIES_DAILY_ADJUSTED&symbol="+tickerSearched+"&outputsize=full&apikey=ZPWHHJ1VEJJFZYLS";
  url = "https://www.alphavantage.co/query?function=TIME_SERIES_DAILY_ADJUSTED&symbol=IBM&outputsize=full&apikey=demo"
  
  fetch(url, requestOptions)
    .then(response => response.text())
    .then(result => {
      let data = JSON.parse(result);

      let timeSeries = data["Time Series (Daily)"];
      let dates = Object.keys(timeSeries);
      let latestDate = dates[0];
      let latestData = timeSeries[latestDate];
      let latestClose = latestData["4. close"];

  //     <div id = "stock-info">
  //     <div id = "stock-info-header">
  //         <div id = "stock-info-header-name"></div>
  //         <div id = "stock-info-header-price"></div>
  //     </div>
  //     <div id = "stock-info-body">
  //         <canvas id="chart"></canvas>
  //     </div>
  // </div>

      let stockInfoHeaderName = document.getElementById("stock-info-header-name");
      stockInfoHeaderName.innerHTML = stockName + " (" + tickerSearched + ")";
      let stockInfoHeaderPrice = document.getElementById("stock-info-header-price");
      stockInfoHeaderPrice.innerHTML = getCurrencySymbol(currency) + latestClose;

      // chart with chart.js
      let chart = document.getElementById("chart").getContext("2d");
      let chartData = {
        type: "line",
        data: {
          labels: dates,
          datasets: [{
            label: "Price",
            data: dates.map(date => timeSeries[date]["4. close"]),
            backgroundColor: "rgba(0, 0, 0, 0)",
            borderColor: "rgba(0, 0, 0, 1)",
            borderWidth: 1
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            yAxes: [{
              ticks: {
                beginAtZero: false
              }
            }]
          }
        }
      };

      let chartInstance = new Chart(chart, chartData);

      // hide the element with class "loading"
      $(".loading").hide();
      // show the element with class "content"
      $(".content").show();







    })
    .catch(error => console.log('error', error));

  // =================== CONTENT ===================
}

