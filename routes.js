require('./models/Advert');
const adverts = require('./controllers/advertsController');
const useCache = require('./services/cache');
const { query } = require('express-validator/check');
const { CACHE_TTL } = require('./config/constants/');
const wrapAsync = require('./middleware/wrapAsync');

module.exports = app => {
  // TEST
  app.get('/api/test', (req, res) => res.status(200).send());

  // ADVERTS
  app.get(
    '/api/search',
    [
      query('q', 'Consulta mal formada')
        .trim()
        .escape()
        .not()
        .isEmpty()
    ],
    useCache(CACHE_TTL),
    wrapAsync(adverts.search)
  );

  return app;
};
