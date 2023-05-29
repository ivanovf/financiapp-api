const puppeteer = require('puppeteer');
const fs = require('fs');

require('dotenv').config();


(async () => {
  try {

    fs.readFile('./data/local-shares.json', 'utf8', async (err, data) => {
      if (err) {
        console.log(err);
      } else {
        const symbols = data ? JSON.parse(data) : [];
        const currentPriceShares = [];
        console.log(symbols);
        
        try {
          const browser = await puppeteer.launch({
            executablePath: '/usr/bin/chromium-browser'
          });
          symbols.forEach(async (symbol) => {
            try {
              const page = await browser.newPage();
              const url = `${process.env.BVC_API}${symbol.symbol}?p=${symbol.symbol}&.tsrc=fin-srch`;
              console.log(url);
              await page.goto(url);
              await page.waitForSelector('#quote-header-info', { timeout: 1000 });
              const body = await page.evaluate((symbol) => {
                return document.querySelector(`fin-streamer[data-symbol="${symbol.symbol}"]`).value;
              }, symbol);
              currentPriceShares.push({ symbol: symbol.symbol, price: body });
              
              const jsonContent = JSON.stringify(currentPriceShares);
  
              fs.writeFile('./data/local-prices.json', jsonContent, 'utf8', (err) => {
                if (err) {
                  console.error('Error writing to file:', err);
                } else {
                  console.log('Data saved to local-prices.json');
                }
              });
              
            } catch (error) {
              console.log(error);
            }
          })
  
          if(browser) await browser.close();

        } catch (error) {
          console.log(error);
        }
      }
    });

  } catch (error) {
    console.log(error);
  }
})();