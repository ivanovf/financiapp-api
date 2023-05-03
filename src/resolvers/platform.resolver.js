const PlatformModel = require('../database/models/platform.model');

const platformResolvers = {
  Query: {
    platform: async (_, args) => await PlatformModel.findById(args.id),
    platforms: async () => await PlatformModel.find()
  },
  Mutation: {
    createPlatform: async (_, { newInput  }) => {
      try {
        const t = await new PlatformModel(newInput);
        t.save();

        return t;
      } catch (error) {
        console.log(error);
      }
    },

    updatePlatform: async (_, { id, newPlatform }) => {
      try {
        const t = await PlatformModel.findByIdAndUpdate(id, newPlatform, { new: true });
        return t;
      } catch (error) {
        console.log(error);
      }
    },

    deletePlatform: async (_, { id }) => {
      try {
        const t = await PlatformModel.findByIdAndDelete(id);
        return t;
      } catch (error) {
        console.log(error);
      }
    }
  }
}

module.exports = platformResolvers;