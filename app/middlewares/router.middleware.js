/*! (c) jTorm and other contributors | www.jtorm.com/license */

const {getFileActionModel} = require('@models/service/get-file-action.model');

module.exports = function (app) {
    app.use(async function (ctx, next) {
        if (ctx.request.method !== 'GET')
            return next()
        ;

        const
            now = new Date(),
            expires = new Date(now.getFullYear() + 1, now.getMonth(), now.getDate())
        ;

        ctx.set('Cache-Control', 'public,max-age=315360000,immutable');
        ctx.set('X-Content-Type-Options', 'nosniff');
        ctx.set('Access-Control-Allow-Origin', '*');
        ctx.set('Vary', 'Accept-Encoding');
        ctx.set('Expires', expires.toUTCString());
        ctx.set('Last-Modified', now.toUTCString());

        ctx.compress = true;

        try {
            if (
                !/\.(html|tss)$/.test(ctx.url)
                || !/^\/jtorm\//.test(ctx.url)
            )
                return next()
            ;

            const
                path = '@' + ctx.url.substring(1),
                result = await getFileActionModel(path)
            ;

            ctx.status = 200;
            ctx.body = result;

            if (/\.html$/.test(ctx.url))
                ctx.set('Content-Type', 'text/html; charset=utf-8')
            ; else
                ctx.set('Content-Type', 'text/plain; charset=utf-8')
            ;
        } catch (e) {
            const {EntityDoesNotExistsError, errorHandlerModel} = require('@jtorm/nodejs-error-handler');

            if (e instanceof EntityDoesNotExistsError) {
                errorHandlerModel.error(e);

                ctx.status = 404;
                ctx.body = e.message;
                return;
            }

            errorHandlerModel.emerg(e);
            ctx.status = 500;
            ctx.body = 'Internal server error.';
        }
    });
};
