const userService = require('../services/user.service');
const { authService } = require('../services/auth.service');

const userResolver = {
  Query: {
    users: async () => {
      return await userService.findAllUsers();
    },
    user: async (_, { id }) => {
      return await userService.findById(id);
    },
    userByEmail: async (_, email) => {
      return await userService.findByEmail(email);
    }
  },
  Mutation: {
    login: async (_, { email, password }, context) => {
      return await authService.login(email, password);
    },
    register: async (_, { name, email, password}, context) => {
      return await authService.register(name, email, password);
    },
    updatePassword: async (_, { id, password }, context) => {
      return await authService.updatePassword(id, password);
    },
    updateUser: async (_, { id, name }) => {
      return await userService.updateUser(id, {name});
    },
    deleteUser: async (_, { id }) => {
      return await userService.deleteUser(id);
    }
  }
}

module.exports = userResolver;