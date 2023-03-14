var stocksToWatch = ["SPY", "MSFT", "AAPL", "AMZN", "FB", "GOOG", "TSLA", "NVDA", "PYPL", "NFLX", "ADBE"];
// change the order of the stocks to watch randomly
stocksToWatch.sort(() => Math.random() - 0.5);
var API_KEYS = ["8KZJnlpVSnFGbGw2Di6Uw3E7doSpfSotzgay7yV2","olrrHn3cOLueBfPnFFQbAPHZDZsuS3KWu9L6XcdO", "48to6hG5ktxHQp0EcBCRhkcH3EGXwhfPbJLuqlOI","wTrA5KhDgUQ76JlzLIVH90C4Chqf6rXwFb7eSqYk",
"jylPjj8hPAAeNDagJRVoBYo29zsVYW1VZWsPzYNK"];
var apiIndex = 0;
var errorMessageShown = false;

function getAPIKeyNews() {
  return API_KEYS[apiIndex];
}

function changeAPIIndex() { 
  if (apiIndex < (API_KEYS.length-1) ) {
    apiIndex++;
    return true;
  }
  else {
    apiIndex = 0;
    return false;
  }
}



// function returnStocksToWatchForURL() {
//   if (stocksToWatch.length == 0) {
//     return "";
//   }
//   else if (stocksToWatch.length == 1) {
//     return stocksToWatch[0];
//   }

//     let stocksToWatchForURL = "";
//     stocksToWatch.forEach(stock => {
//         stocksToWatchForURL += stock + ",";
//     });
//     return stocksToWatchForURL;
// }

function beautifyDate(date) {
    // the date looks like this "2023-03-11T00:48:40.000000Z" and we want to make it look like this "11-03-2023 00:48:40"
    const dateArray = date.split("T");
    const dateArray2 = dateArray[0].split("-");
    const dateArray3 = dateArray[1].split(".");
    return `${dateArray2[2]}-${dateArray2[1]}-${dateArray2[0]} ${dateArray3[0]}`;
}


 async function loadNewsFeed(stockToSearch) {
    const newsContainer = document.getElementById('news-container');
  
     await fetch(`https://api.marketaux.com/v1/news/all?symbols=${stockToSearch}&filter_entities=true&language=en&api_token=${getAPIKeyNews()}`)
      .then(response => response.json())
      .then(data => {
        if (data["error"]) {
          throw new Error(data["error"]["message"]);
        }
        data = data["data"];
        data.forEach(article => {
          const articleHTML = `
            <a class="link-news" href="${article.url}">
              <img src="${article.image_url}" alt="${article.title}">
              <div>
                <h3>${article.title}</h3>
                <p>${article.description}</p>
                <h4>${beautifyDate(article.published_at)}</h4>
              </div>
            </a>
          `;
          newsContainer.insertAdjacentHTML('beforeend', articleHTML);
        });
      })
      .catch(error => {
        // if this error: {"error":{"code":"usage_limit_reached","message":"The usage limit for this account has been reached."}}
        // then change the API key
        if (error.message == "The usage limit for this account has been reached.") {
          if (changeAPIIndex()) {
            loadNewsFeed(stockToSearch);
          }
          else {
            if (!errorMessageShown) {
              errorMessageShown = true;
              newsContainer.insertAdjacentHTML('beforeend', `<h1 class="error-message">Se ha llegado al límite de la API de noticias, por favor inténtalo de nuevo mañana.</h1>`);
            }
          }
        }
        
      });
  }


Promise.all(stocksToWatch.map(stock => loadNewsFeed(stock)))
  .then(() => console.log("All news loaded successfully"))
  .catch(error => console.log("Error loading news:", error));