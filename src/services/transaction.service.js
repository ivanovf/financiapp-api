const TransactionModel = require('../database/models/transaction.model');
const platformService = require('./platform.service');

class TransactionService {
  async create(data) {
    try {
      const transaction = await new TransactionModel(data);
      await transaction.save();
      
      const platform = await platformService.findById(data.platformId);
      return {...transaction._doc, platform, id: transaction._id};
    } catch(err) {
      console.log(err);
      return err;
    }
  }

  async update(id, data) {
    const transaction = await TransactionModel.findByIdAndUpdate(id, data, { new: true });
    return transaction;
  }

  async delete(id) {
    const transaction = await TransactionModel.findByIdAndDelete(id);
    return transaction;
  }

  async findAll() {
    try {
      const transactions = await TransactionModel.find().populate('platformId');
      
      // Get current price of each transaction
      const transactionsWithPrice = transactions.map(async (transaction) => {
  
        return {
          ...transaction.toObject(),
          currentPrice: await transaction.currentPrice,
          id:  transaction._id,
          platformId: transaction.platformId._id,
          platform: {
            name: transaction.platformId.name,
          }
        };
      });

      return transactionsWithPrice;
    } catch(err) {
      console.log(err);
      return err;
    }
  }

  async findById(id) { 
    const transaction = await TransactionModel.findById(id);
    return transaction;
  }
}

module.exports = new TransactionService();