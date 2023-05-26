const fs = require('fs');
require('dotenv').config();
const connect = require('./database/connection');
const transactionService = require('./services/transaction.service');

(async () => {
  try {
    await connect();
    const transactions = await transactionService.findAll(false);
    const currentPriceShares = [];

    for (const transaction of transactions) {
      try {
        if (transaction.currency === 'COP' && transaction.cod) {
          currentPriceShares.push({ symbol: transaction.cod });
        }
      } catch (error) {
        console.log(error);
      }
    }

    const jsonContent = JSON.stringify(currentPriceShares);

    fs.writeFile('./data/local-shares.json', jsonContent, 'utf8', (err) => {
      if (err) {
        console.error('Error writing to file:', err);
      } else {
        console.log('Data saved to local-shares.json');
      }
    });

  } catch (error) {
    console.log(error);
  }
})();