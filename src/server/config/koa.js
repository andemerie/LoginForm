const path = require('path');
const session = require('koa-generic-session');
const redisStore = require('koa-redis');
const views = require('koa-views');
const logger = require('koa-logger');
const serve = require('koa-static');
const validator = require('koa-validator');
const koaBody = require('koa-body');
const { devMiddleware } = require('koa-webpack-middleware');
const webpack = require('webpack');
const handlebars = require('handlebars');

const config = require('config');
const webpackConfig = require('webpack.config');
const routes = require('./routes');

const compile = webpack(webpackConfig);
const publicPath = path.join(__dirname, './../../client');
handlebars.registerHelper('json', context => JSON.stringify(context));

module.exports = (app) => {
  app.use(logger());

  app.use(views(publicPath, {
    default: 'html',
    map: { html: 'handlebars' },
  }));

  app.use(serve(publicPath));

  app.use(validator());

  app.use(koaBody({ multipart: true, formidable: { keepExtensions: true } }));

  app.use(session({
    store: redisStore({
      host: config.redis.host,
      port: config.redis.port,
    }),
    ttl: 3600 * 10000,
    cookie: {
      expires: false,
    },
  }));

  app.use(async (ctx, next) => {
    try {
      await next();
    } catch (err) {
      // eslint-disable-next-line no-console
      console.log(err);
      ctx.status = err.status || 500;
      ctx.body = err.message;
      ctx.app.emit('error', err, ctx);
    }
  });

  app.use(routes);

  app.use(devMiddleware(compile));
};
