$(document).ready(function () {
  const stocksList = ['FB', 'AAPL', 'TSLA', 'GOOG'];
  const validationList = [];

  // create an array for all stock symbols available in iexTrading
  const getAllStockSymbols = function () {
    const allSymbols = 'https://api.iextrading.com/1.0/ref-data/symbols#';
    $.ajax({
      url: `${allSymbols}`,
      method: 'GET'
    }).then(function (response) {
      for (let i = 0; i < response.length; i++) {
        validationList.push(response[i].symbol);
      }
    });
  }
  getAllStockSymbols();

  // display all the symbol buttons
  const render = function () {
    $('#buttons-view').empty();
    for (let i = 0; i < stocksList.length; i++) {
      const newButton = $('<button class="btn btn-info">');
      newButton.addClass('stock-btn');
      newButton.attr('data-name', stocksList[i]);
      newButton.text(stocksList[i]);
      $('#buttons-view').append(newButton);
    }
  }
  render();

  const isValidSymbol = function (stock) {
    return (validationList.includes(stock)) ? true : false;
  }

  const isInStocksList = function (stock) {
    let result = (stocksList.includes(stock)) ? true : false;
    return result;
  }

  // This function handles events when add stock button is clicked
  const addButton = function (e) {
    e.preventDefault();
    const stock = $('#stock-input').val().trim().toUpperCase();
    if (isValidSymbol(stock) && !isInStocksList(stock)) {
      stocksList.push(stock);
      render();
    } else {
      alert('Try again! Either exists or invalid Symbol!');
    }
    $('#stock-input').val('');
  }
  $('#add-stock').on('click', addButton);

  const displayCEO = function (companyCEO) {
    const ceoDiv = $('<div>');
    const ceoHolder = $('<small>').text(`CEO: ${companyCEO}`);
    ceoDiv.append(ceoHolder);
    $('#ceo-view').append(ceoDiv);
  }

  const storeLogo = function (stockDiv, companyLogo) {
    const logoHolder = $(`<img src="${companyLogo}">`);
    stockDiv.append(logoHolder);
  }

  const storeCompanyName = function (stockDiv, companyName) {
    const nameHolder = $('<h3>').text(`${companyName}`);
    stockDiv.append(nameHolder);
  }

  const storePrice = function (stockDiv, stockPrice, change) {
    const priceHolder = $('<h6>').text(`Price: $${stockPrice} `);
    if (parseFloat(change) >= 0) {
      priceHolder.append(`<span id="change" style="color:green">  +${change}</span>`);
    } else {
      priceHolder.append(`<span id="change" style="color:red">  ${change}</span>`);
    }
    priceHolder.append(`<small>(IEX real-time price)</small>`);
    stockDiv.append(priceHolder);
  }

  const storeNews = function (stockDiv, news) {
    // console.log(news);
    for (let i = 0; i < news.length; i++) {
      const headline = news[i].headline;
      const companyNews = news[i].summary;
      const summaryHolder = $('<div>').addClass('news');
      summaryHolder.append(`<p><strong>Headline:</strong> ${headline}</p><hr><p>${companyNews}</p>`);
      stockDiv.append(summaryHolder);
    }
  }

  // renderCompanyInfo function renders the HTML to display the selected company content
  const renderCompanyInfo = function (response) {
    const stockDiv = $('<div>').addClass('stock');
    displayCEO(response.company.CEO);
    storeLogo(stockDiv, response.logo.url);
    storeCompanyName(stockDiv, response.quote.companyName);
    storePrice(stockDiv, response.quote.latestPrice, response.quote.change);
    storeNews(stockDiv, response.news);
    $('#stocks-view').prepend(stockDiv);
  }

  const getStockInfo = function () {
    $('#ceo-view').empty();
    $('#stocks-view').empty();
    const stock = $(this).attr('data-name');
    // Grab the stock symbol from the button clicked and add it to the queryURL
    const queryURL = `https://api.iextrading.com/1.0/stock/${stock}/batch?types=logo,company,quote,news&range=1m&last=10`;

    $.ajax({
      url: queryURL,
      method: 'GET'
    }).then(function (response) {
      renderCompanyInfo(response);
    });
  }
  $('#buttons-view').on('click', '.stock-btn', getStockInfo);

});