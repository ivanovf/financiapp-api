const mongoose = require('mongoose');

const platformSchema = new mongoose.Schema({

  name: {
    type: String,
    required: true,
  },
  api: {
    type: String,
    required: false,
  }
});

const PlatformModel = mongoose.model('Platform', platformSchema);

module.exports = PlatformModel;
