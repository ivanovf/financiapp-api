const PlatformModel = require('../database/models/platform.model');

class PlatformService {
  async create(data) {
    const platform = await new PlatformModel(data);
    await platform.save();
    return platform;
  }

  async findAll() {
    const platforms = await PlatformModel.find()
    return platforms
  }

  async findById(id) {
    const platform = await PlatformModel.findById(id)
    return platform
  }

  async update(id, data) {
    const platform = await PlatformModel.findByIdAndUpdate(id, data, { new: true })
    return platform
  }

  async delete(id) {
    const platform = await PlatformModel.findByIdAndDelete(id)
    return platform
  }
}

module.exports = new PlatformService();