const express = require('express');
const https = require('https');
const fs = require('fs');
const { ApolloServer } = require('apollo-server-express');
const cors = require('cors');
const { makeExecutableSchema } = require('@graphql-tools/schema');
const { loadSchemaSync } = require('@graphql-tools/load');
const { GraphQLFileLoader } = require('@graphql-tools/graphql-file-loader');

bodyParser = require('body-parser');
require('dotenv').config();

const resolvers = require('./resolvers');
const { authService } = require('./services/auth.service');
const connect = require('./database/connection');
const app = express();

const schema = makeExecutableSchema({
  typeDefs: loadSchemaSync('./src/schemas/*.graphql', {
    loaders: [new GraphQLFileLoader()],
  }),
  resolvers,
});

const server = new ApolloServer({
  schema,
  graphiql: true,
});

const authenticate = (req, res, next) => {

  const authHeader = req.headers.authorization;
  const body = req.body;
  const operationName = body && body.operationName;

  if (operationName === 'Login') {
    // Skip authentication for login mutation
    return next();
  }

  if (!authHeader) {
    return res.status(401).send({ error: 'Missing Authorization header' });
  }

  const token = authHeader.split(' ')[1];
  if (!token) {
    return res.status(401).send({ error: 'Missing token' });
  }

  const isValid = authService.verifyJwt(token);

  if (!isValid) {
    return res.status(401).send({ error: 'Invalid token' });
  }

  next();
}

app.get('/local-shares', (req, res) => {
  fs.readFile('./data/local-prices.json', 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading file:', err);
      res.status(500).send('Internal Server Error');
    } else {
      const jsonData = JSON.parse(data);
      res.json(jsonData);
    }
  });
});

app.use(cors({
  origin: '*'
}));

app.use(bodyParser.json());
app.use(authenticate);

// Read the SSL certificate files
const privateKey = fs.readFileSync('./private/key.pem', 'utf8');
const certificate = fs.readFileSync('./private/certificate.pem', 'utf8');

// Create the HTTPS server options
const serverOptions = {
  key: privateKey,
  cert: certificate
};

// Create the HTTPS server using the Express app
const httpsServer = https.createServer(serverOptions, app);

const port = process.env.PORT || 3000;

async function startServer() {
  await connect();
  await server.start();

  // Apply the Apollo middleware to the Express app
  server.applyMiddleware({ app });

  // Start the server
  httpsServer.listen(port, () => {
    console.log(`Server ready at https://localhost:${process.env.PORT} ${server.graphqlPath}`);
  });
}

startServer();
