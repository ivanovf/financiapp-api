const finnhub = require('finnhub');

class TradeManager {

  constructor() {
    const api_key = finnhub.ApiClient.instance.authentications['api_key'];
    api_key.apiKey = process.env.FINHUB_KEY;
    this.finnhubClient = new finnhub.DefaultApi();
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
      }
      else {
        reject('Invalid transaction');
      }
    });
  }
}

module.exports = new TradeManager();