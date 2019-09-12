module.exports = async (req, res, next) => {
  const filters = {};

    if(req.query.price_min || req.query.price_max) {
      filters.price = {};

      if(req.query.price_min) {
        filters.price.$gte = req.query.price_min;
      }

      if(req.query.price_max) {
        filters.price.$lte = req.query.price_max;
      }
    }

    if(req.query.title) {
      filters.title = new RegExp(req.query.title, 'i');
    }

    filters.purchasedBy = null;

    req.filters = filters;

    return next();
}