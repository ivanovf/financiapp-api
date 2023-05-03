const { shield  } = require("graphql-shield");
const { isAuthenticated } = require("./auth.service");

const permissions = shield({
  Query: {
    users: isAuthenticated,
    user: true,
    userByEmail: true,
    platfroms: true,
    platform: true,
    createPlatform: true,
    updatePlatform: true,
    deletePlatform: true,
    transactions: true,
    transaction: true,
    createTransaction: true,
    updateTransaction: true,
    deleteTransaction: true,
  },
  Mutation: {
    createUser: true,
    updateUser: true,
    deleteUser: true,
    login: true,
    logout: true,
    register: true,
    forgotPassword: true,
    resetPassword: true,
    updatePassword: true,
  },
});

module.exports = permissions;