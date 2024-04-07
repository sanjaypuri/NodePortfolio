const express = require('express');
const bodyParser = require('body-parser');

const db = require('./database');

const port = 5000;

const app = express();

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.set('view engine', 'ejs');

app.get('/', (req, res)=>{
  res.clearCookie("Owner");
  const sql = "SELECT * FROM PortfolioAll";
  const data = db.prepare(sql).all();
  const netWorth = data[0].TotalNetWorth;
  let netWorthSanjay = 0, netWorthShobit = 0;
  let buySanjay = 0, buyShobit = 0;
  let gainTodaySanjay = 0, gainTodayShobit = 0;
  for(i=0; i<data.length;i++){
    if(data[i].owner === 'Sanjay'){
      netWorthSanjay = data[i].OwnerMarketValue;
      buySanjay = data[i].OwnerBuyTotal;
      gainTodaySanjay += data[i].Change*data[i].BuyQty;
    }
    if(data[i].owner === 'Shobit'){
      netWorthShobit = data[i].OwnerMarketValue;
      buyShobit = data[i].OwnerBuyTotal
      gainTodayShobit += data[i].Change*data[i].BuyQty;
    }
  }
  const info = {
    totalNetWorth: netWorth,
    netWorthSanjay: netWorthSanjay,
    netWorthShobit: netWorthShobit,
    buySanjay: buySanjay,
    buyShobit:buyShobit,
    gainTodaySanjay: gainTodaySanjay,
    gainTodayShobit: gainTodayShobit,
  }
  res.render('home', {info});
});

app.get('/portfolioSanjay', (req, res)=>{
  let sql = "SELECT Name from Closing";
  const list = db.prepare(sql).all();
  sql = "SELECT * FROM PortfolioSanjay";
  const data = db.prepare(sql).all();
  const netWorth = data[0].TotalMarketValue;
  const totalBuy = data[0].TotalBuyValue;
  const totalGain = data[0].OverAllGain;
  let dayGain = 0;
  for(i=0; i<data.length;i++){
    dayGain += data[i].Change*data[i].BuyQty;
  }
  const info = {
    netWorth: netWorth,
    buyValue: totalBuy,
    totalGain: totalGain,
    dayGain: dayGain,
    portfolio: data,
    owner: "Sanjay",
    shares: list,
  };
  res.cookie("Owner", "Sanjay");
  res.render('portfolioSanjay', {info});
})

app.get('/portfolioShobit', (req, res)=>{
  let sql = "SELECT Name from Closing";
  const list = db.prepare(sql).all();
  sql = "SELECT * FROM PortfolioShobit";
  const data = db.prepare(sql).all();
  const netWorth = data[0].TotalMarketValue;
  const totalBuy = data[0].TotalBuyValue;
  const totalGain = data[0].OverAllGain;
  let dayGain = 0;
  for(i=0; i<data.length;i++){
    dayGain += data[i].Change*data[i].BuyQty;
  }
  const info = {
    netWorth: netWorth,
    buyValue: totalBuy,
    totalGain: totalGain,
    dayGain: dayGain,
    portfolio: data,
    owner: "Shobit",
    shares: list,
  };
  res.cookie("Owner", "Shobit");
  res.render('portfolioShobit', {info});
})

app.listen(port, (err)=>{
  if(err){
    console.log(`Error creating server: ${err.message}`);
  } else{
    console.log(`Server running at http:\\127.0.0.1:${port}`);
  }
});