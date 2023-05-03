const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const mongoose = require('mongoose');
const cors = require('cors');
const { makeExecutableSchema } = require('@graphql-tools/schema');
const { loadSchemaSync } = require('@graphql-tools/load');
const { GraphQLFileLoader } = require('@graphql-tools/graphql-file-loader');
const puppeteer = require('puppeteer');

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

  console.log(operationName);

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
  app.listen(process.env.PORT || 4000, () => {
    console.log(`Server ready at http://localhost:${process.env.PORT} ${server.graphqlPath}`);
  });
}

startServer();

(async () => {
  try {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(process.env.BVC_API);
    await page.waitForSelector('#quote-header-info', { timeout: 1000 });

    const body = await page.evaluate(() => {
      return document.querySelector('fin-streamer[data-symbol="ECOPETROL.CL"]').value;
    });
    console.log(body);

    await browser.close();
  } catch (error) {
    console.log(error);
  }
})();
