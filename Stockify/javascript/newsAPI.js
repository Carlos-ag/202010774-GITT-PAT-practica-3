const stocksToWatch = ["SPY"];
function returnStocksToWatchForURL() {
  if (stocksToWatch.length == 0) {
    return "";
  }
  else if (stocksToWatch.length == 1) {
    return stocksToWatch[0];
  }

    let stocksToWatchForURL = "";
    stocksToWatch.forEach(stock => {
        stocksToWatchForURL += stock + ",";
    });
    return stocksToWatchForURL;
}

function beautifyDate(date) {
    // the date looks like this "2023-03-11T00:48:40.000000Z" and we want to make it look like this "11-03-2023 00:48:40"
    console.log(date);
    const dateArray = date.split("T");
    const dateArray2 = dateArray[0].split("-");
    const dateArray3 = dateArray[1].split(".");
    return `${dateArray2[2]}-${dateArray2[1]}-${dateArray2[0]} ${dateArray3[0]}`;
}


function loadNewsFeed() {
    const newsContainer = document.getElementById('news-container');
  
    fetch(`https://api.marketaux.com/v1/news/all?symbols=${returnStocksToWatchForURL()}&filter_entities=true&language=en&api_token=48to6hG5ktxHQp0EcBCRhkcH3EGXwhfPbJLuqlOI`)
      .then(response => response.json())
      .then(data => {
        console.log(data);
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
        console.log(error);
        newsContainer.insertAdjacentHTML('beforeend', '<h3>Sorry, we could not load the news feed</h3>');
      });
  }

    loadNewsFeed();