'use strict';

const Koa = require('koa');
const Router = require('koa-router');
const serve = require('koa2-static-middleware');

const readStream = require('./lib/read-stream');
const extractVersion = require('./lib/extract-version');
const enableDestroy = require('server-destroy');

const ROOT_DIRECTORY = '/sunset-clock';

module.exports = function(directory, port, version) {
  const app = new Koa();
  const router = new Router();

  router.get('/', function(ctx) {
    ctx.status = 301;
    ctx.redirect(ROOT_DIRECTORY + '/');
  });

  router.get(ROOT_DIRECTORY, function(ctx, next) {
    if (ctx.request.path.endsWith('/')) {
      return next();
    }

    ctx.redirect(ROOT_DIRECTORY + '/');
    ctx.status = 301;
    return null;
  });

  router.get(ROOT_DIRECTORY + '/*', modifiedPublicDir);
  router.get(ROOT_DIRECTORY + '/', modifiedPublicDir);

  async function modifiedPublicDir(ctx) {
    await serve(directory, { index: 'index.html' })(ctx);
    if (ctx.request.path === `${ROOT_DIRECTORY}/service-worker.js` && version) {
      const originalBody = await readStream(ctx.body);
      const originalVersion = extractVersion(originalBody);
      ctx.body = replaceAll(originalBody, originalVersion, version);
    }

    if (ctx.request.path === `${ROOT_DIRECTORY}/main.html` && version) {
      const originalBody = await readStream(ctx.body);
      ctx.body = originalBody.replace('</body>', `<p>version set to ${version} by test server</p></body>`);
    }
  }

  app.use(router.routes());

  return new Promise(function(resolve, reject) {
    const server = app.listen(port, function() {
      // thanks https://github.com/koajs/koa/issues/659#issuecomment-184171204
      enableDestroy(server);
      resolve({
        stop: function() {
          return new Promise(function(r) {
            server.destroy(function() {
              r();
            });
          });
        },
      });
    });
  });
};

function replaceAll(string, o, n) {
  let newVersion = string;
  while (newVersion.indexOf(o) !== -1) {
    newVersion = newVersion.replace(o, n);
  }
  return newVersion;
}


