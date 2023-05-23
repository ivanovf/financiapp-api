const fs = require('fs');

require('dotenv').config();
const { GraphQLClient } = require('graphql-request');

(async () => {
  try {
    const endpoint = `http://localhost:${process.env.PORT}/graphql`;
    const client = new GraphQLClient(endpoint);

    const mutation = `
      mutation Login($email: String!, $password: String!) {
        login(email: $email, password: $password) {
          access_token
        }
      }
    `;

    const variables = {
      email: process.env.API_USER_MAIL,
      password: process.env.API_USER_PASSWORD
    };
    
    const login = await client.request(mutation, variables)

    const query = `
      query Transactions {
        transactions {
            cod
            value
            quantity
            currency
            currentPrice
        }
    }`;

    const headers = {
      Authorization: `Bearer ${login.login.access_token}`
    };

    const data = await client.request(query, variables, headers)
    const transactions = data.transactions??[];
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