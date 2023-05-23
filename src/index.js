const express = require('express');
const fs = require('fs');
const { ApolloServer } = require('apollo-server-express');
const mongoose = require('mongoose');
const cors = require('cors');
const { makeExecutableSchema } = require('@graphql-tools/schema');
const { loadSchemaSync } = require('@graphql-tools/load');
const { GraphQLFileLoader } = require('@graphql-tools/graphql-file-loader');

bodyParser = require('body-parser');
require('dotenv').config();

const resolvers = require('./resolvers');
const { authService } = require('./services/auth.service');

const dbUser = process.env.DB_USER;
const dbPass = process.env.DB_PASS;
const dbHost = process.env.DB_HOST;
const dbPort = process.env.DB_PORT;
const dbName = process.env.DB_NAME;

const dbUrl = `mongodb://${dbUser}:${dbPass}@${dbHost}:${dbPort}/${dbName}`;
const app = express();
  
mongoose.connect(dbUrl, {

  authSource: "admin",
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  console.log('MongoDB connected');
})
.catch((err) => {
  console.error(`MongoDB connection error: ${err}`);
});

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

const port = process.env.PORT || 3000;

async function startServer() {
  await server.start();

  // Apply the Apollo middleware to the Express app
  server.applyMiddleware({ app });

  // Start the server
  app.listen(port, () => {
    console.log(`Server ready at http://localhost:${process.env.PORT} ${server.graphqlPath}`);
  });
}

startServer();
