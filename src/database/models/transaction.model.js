const { ObjectId } = require('mongodb');
const mongoose = require('mongoose');
const TradeManager = require('../../services/trade.manager.service');

const transactionSchema = new mongoose.Schema({

  name: {
    type: String,
    required: true,
  },
  cod: {
    type: String,
    required: false,
  },
  value: {
    type: Number,
    required: true
  },
  quantity: {
    type: Number,
    required: false,
    default: 1
  },
  currency: {
    type: String,
    required: true,
    validate: function(value) {
      return ['COP', 'USD'].includes(value);
    }
  },
  platformId: {
    type: ObjectId,
    ref: 'Platform',
    required: true,
  },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now
  },
  purchaseTRM: {
    type: Number,
    required: false,
    default: 0
  },
  expireAt: {
    type: Date,
    required: false,
  },
  box: {
    type: String,
    required: true,
  },
  owner: {
    type: String,
    required: true
  }
});

transactionSchema.virtual('currentPrice').get(async function() {
  if (this.currency  === 'USD') {
    const price = await TradeManager.getAssetPrice(this.cod);
    return price.c * this.quantity;
  }
  else if (this.currency === 'COP' && this.cod) {
    const price = await TradeManager.getAssetPriceCop(this.cod);
    console.log(price[0].price);
    return price[0].price * this.quantity;
  }
  else {
    return this.value;
  }
})

const TransactionModel = mongoose.model('Transaction', transactionSchema);

module.exports = TransactionModel;
