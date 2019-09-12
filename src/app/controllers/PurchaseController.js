const Ad = require('../models/Ad');
const Purchase = require('../models/Purchase');
const User = require('../models/User');
const Queue = require('../services/Queue');
const jobs = require('../jobs');

class PurchaseController {

  async index (req, res) {
    const purchases = await Purchase.find({}).populate('author');

    return res.json(purchases);
  }

  async store (req, res) {
    const { ad, content } = req.body;

    const purchaseAd = await Ad.findById(ad).populate('author');
    const user = await User.findById(req.userId);

    if(purchaseAd.purchasedBy) {
      return res.status(400).json({ error: 'Ad unavailable for purchase' });
    }

    const purchase = await Purchase.create({ content, ad, author: req.userId });

    Queue.create(jobs.PurchaseMail.key, { ad: purchaseAd, user, content }).save();

    return res.json(purchase);

  }

  async sell (req, res) {
    const { id } = req.params;

    const purchase = await Purchase.findById(id);
    const ad = await Ad.findById(purchase.ad);

    if(ad.purchasedBy){
      return res.status(400).json({ error: 'Ad sold' }); 
    }

    ad.purchasedBy = id;

    await ad.save();

    return res.json(ad);

  }
}

module.exports = new PurchaseController();