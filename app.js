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

// displaystockInfo function renders the HTML to display the selected company content
const displayStockInfo = function () {
  $('#stocks-view').empty();
  const stock = $(this).attr('data-name');
  // Grab the stock symbol from the button clicked and add it to the queryURL
  const queryURL = `https://api.iextrading.com/1.0/stock/${stock}/batch?types=logo,quote,news&range=1m&last=10`;

  $.ajax({
    url: queryURL,
    method: 'GET'
  }).then(function (response) {
    const stockDiv = $('<div>').addClass('stock');
    // Storing the company logo
    const companyLogo = response.logo.url;
    const logoHolder = $(`<img src="${companyLogo}">`);
    stockDiv.append(logoHolder);
    // Storing the company name
    const companyName = response.quote.companyName;
    const nameHolder = $('<h3>').text(`${companyName}`);
    stockDiv.append(nameHolder);
    // Storing the price
    const stockPrice = response.quote.latestPrice;
    const priceHolder = $('<h6>').text(`Price: $${stockPrice}`);
    stockDiv.append(priceHolder);
    // Storing the 10 news summary
    for (let i = 0; i < response.news.length; i++) {
      const companyNews = response.news[i].summary;
      const summaryHolder = $('<p>').text(`${companyNews}`);
      stockDiv.append(summaryHolder);
    }
    // Adding the stockDiv to the DOM
    $('#stocks-view').prepend(stockDiv);
  });
}
// this function display all the buttons
const render = function () {
  $('#buttons-view').empty();

  for (let i = 0; i < stocksList.length; i++) {
    const newButton = $('<button>');
    newButton.addClass('stock-btn');
    newButton.attr('data-name', stocksList[i]);
    newButton.text(stocksList[i]);
    $('#buttons-view').append(newButton);
  }
}

const isValidSymbol = function (stock) {
  // console.log(stock);
  if (validationList.includes(stock)) {
    return true;
  } else {
    return false;
  }
}
// This function handles events when add stock button is clicked
const addButton = function (e) {
  e.preventDefault();
  const stock = $('#stock-input').val().trim().toUpperCase();
  
  if (isValidSymbol(stock)) {
    stocksList.push(stock);
    render();
  } else {
    alert('Please enter a valid Symbol!');
  }
  $('#stock-input').val('');
}

$('#add-stock').on('click', addButton);
$('#buttons-view').on('click', '.stock-btn', displayStockInfo);

render();
});