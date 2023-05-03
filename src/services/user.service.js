const UserModel = require('../database/models/user.model');
const bcrypt = require('bcrypt');

class UserService {
  constructor() {}

  async findAllUsers() {
    return UserModel.find();
  }
  
  async findUserByEmail(email) {
    return UserModel.findOne({email});
  }
  
  async  findUser(email) {
    return UserModel.findOne({email});
  }
  
  async createUser(user) {
    const newUser = await new UserModel(user);
    newUser.save();
    console.log(newUser);
    return newUser;
  }
  
  async updateUser(id, user) {
    return UserModel.findByIdAndUpdate(id, {$set: user}, {new: true});
  }
  
  async deleteUser(id) {
    const user = UserModel.findByIdAndDelete(id);
    return user.id;
  }
}

module.exports = new UserService();