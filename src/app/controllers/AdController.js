const Ad = require('../models/Ad');

class AdController {
  async index(req, res) {

    const ads = await Ad.paginate(req.filters, {
      page: req.query.page || 1,
      limit: 10,
      sort: '-createdAt',
      populate: ['author']
    });

    return res.json(ads);
  }

  async show(req, res) {
    const ad = await Ad.findById(req.params.id);

    return res.json(ad);
  }

  async store(req, res) {
    const ad = await Ad.create({ ...req.body, author: req.userId });

    return res.json(ad);
  }

  async update(req, res) {
    const ad = await Ad.findByIdAndUpdate(req.params.id, req.body, {
      new: true
    });

    return res.json(ad);
  }

  async destroy(req, res) {
    await Ad.findByIdAndDelete(req.params.id);

    return res.send();
  }
};

module.exports = new AdController();