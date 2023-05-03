const transactionResolvers = require('./transaction.resolver');
const platformResolvers = require('./platform.resolver');
const userResolvers = require('./user.resolver');

const { GraphQLScalarType } = require('graphql');

const dateScalar = new GraphQLScalarType({
  name: 'Date',
  description: 'Date custom scalar type',
  parseValue(value) {
    return new Date(value); // value from the client
  },
  parseLiteral(ast) {
    if (ast.kind === 'StringValue') {
      return new Date(ast.value); // ast value is always in string format
    }
    return null;
  },
  serialize(value) {
    return value.getTime(); // value sent to the client
  }
});

const rootResolver = {};
const resolvers = [
  rootResolver,
  transactionResolvers,
  platformResolvers,
  userResolvers,
  { Date: dateScalar }
];

module.exports = resolvers;