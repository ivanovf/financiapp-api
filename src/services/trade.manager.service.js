const finnhub = require('finnhub');
const fs = require('fs');

class TradeManager {

  constructor() {
    const api_key = finnhub.ApiClient.instance.authentications['api_key'];
    api_key.apiKey = process.env.FINHUB_KEY;
    this.finnhubClient = new finnhub.DefaultApi();

    fs.open(`${__dirname}/../../data/local-shares.json`, 'r', (err, fd) => {
      if (err) {
        console.log(err);
      }
      else {
        this.localShare = JSON.parse(fs.readFileSync(fd, 'utf8'));
      }
    });
  }

  async getAssetPrice(cod) {
    return new Promise((resolve, reject) => {
      if (cod) {
        this.finnhubClient.quote(cod, (error, data, response) => {
          if (error) {
            reject(error);
          }
          resolve(data);
        });
      
      } else {
        reject('Invalid transaction');
      }
    });
  }

  async getAssetPriceCop(cod = '') {
    return new Promise((resolve, reject) => {
      if (cod.includes('.CL')) {
        const share = this.localShare.filter(share => share.symbol === cod);
        resolve(share);
      
      } else {
        reject('Invalid transaction');
      }
    });
  }

}

module.exports = new TradeManager();