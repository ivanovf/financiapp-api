const { default: mongoose } = require("mongoose");

const userSchema = mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    validate: {
      validator: function (value) {
        return /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(value);
      }
    }
  },
  password: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  }
});

const UserModel = mongoose.model("User", userSchema);

module.exports = UserModel;