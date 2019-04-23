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
      const newButton = $('<button class="btn btn-info">')
        .addClass('stock-btn')
        .attr('data-name', stocksList[i])
        .text(stocksList[i]);
      $('#buttons-view').append(newButton);
    }
  }
  render();

  const displayPrice = function (stockPrice, change) {
    const priceTag = $('<h6>').text(`Price: $${stockPrice} `);
    if (parseFloat(change) >= 0) {
      priceTag.append(`<span id="change" style="color:green">  +${change}</span>`);
    } else {
      priceTag.append(`<span id="change" style="color:red">  ${change}</span>`);
    }
    priceTag.append(`<small>(IEX real-time price)</small>`);
    return priceTag;
  }

  const storeNews = function (stockDiv, news) {
    // console.log(news);
    for (let i = 0; i < news.length; i++) {
      const headline = $('<strong>').text(news[i].headline);
      const companyNews = $('<p>').text(news[i].summary);
      const newsDiv = $('<div>').addClass('news')
        .append(headline, $('<hr>'), companyNews);
      stockDiv.append(newsDiv);
    }
  }

  // renderCompanyInfo function renders the HTML to display the selected company content
  const renderCompanyInfo = function (response) {

    const ceoDiv = $('<div>')
      .append($('<small>').text(`CEO: ${response.company.CEO}`));
    $('#ceo-view').append(ceoDiv);

    const stockDiv = $('<div>').addClass('stock')
      .append(
        $('<img>').attr('src', response.logo.url),
        $('<h3>').text(response.quote.companyName),
        displayPrice(response.quote.latestPrice, response.quote.change)
      );

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
    }).then(renderCompanyInfo);
  }

  const isValidSymbol = function (stock) {
    return (validationList.includes(stock)) ? true : false;
  }

  // This function handles events when add stock button is clicked
  const addButton = function (e) {
    e.preventDefault();
    const stock = $('#stock-input').val().trim().toUpperCase();
    if (isValidSymbol(stock) && !stocksList.includes(stock)) {
      stocksList.push(stock);
      render();
    } else {
      alert('Try again! Either exists or invalid Symbol!');
    }
    $('#stock-input').val('');
  }

  //==================================
  // Event Listeners
  //==================================
  $('#add-stock').on('click', addButton);
  $('#buttons-view').on('click', '.stock-btn', getStockInfo);

});