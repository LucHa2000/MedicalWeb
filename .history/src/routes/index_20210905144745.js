const storeRouter = require('./store');
const adminRouter = require('./admin');
const authRouter = require('./auth');
const articleRouter = require('./article');
const homeRouter = require('./home');
const accountRouter = require('./account');

function route(app) {
  app.use('/store', storeRouter);
  app.use('/account', accountRouter);
  app.use('/article',articleRouter);
  app.use('/auth', authRouter);
  app.use('/admin', adminRouter);
  app.use('/', homeRouter);
}
module.exports = route;