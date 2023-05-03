const transactionService = require('../services/transaction.service');

const transactionResolvers = {
  Query: {
    transaction: async (_, { id }) => {
      return await transactionService.findById(id);
    },
    transactions: async () => await transactionService.findAll(),
  },
  Mutation: {
    createTransaction: async (_, { newInput }) => {
      return await transactionService.create(newInput);
    },

    updateTransaction: async (_, { id, updateInput }) => {
      return await transactionService.update(id, updateInput);
    },

    deleteTransaction: async (_, { id }) => {
      return await transactionService.delete(id);
    }
  }
}

module.exports = transactionResolvers;