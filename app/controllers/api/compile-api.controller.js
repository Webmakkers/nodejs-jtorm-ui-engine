/*! (c) jTorm and other contributors | https://jtorm.com/license */

const
    {errorHandlerModel} = require("@jtorm/nodejs-error-handler"),
    {jTormLanguageModel} = require("@jtorm/language-model"),
    {jTormEventModel} = require("@jtorm/event-model"),
    {jTormHandler} = require("@jtorm/handler"),
    {jTormViewModel} = require("@jtorm/view-model"),
    {minifyHTMLActionModel} = require('@models/service/minify-html-action.model')
;

const compileApiController = {
    postAction: async (ctx, next, action) => {
        if (Array.isArray(ctx.request.body.tss))
            ctx.request.body.tss = ctx.request.body.tss.join(' ')
        ;

        if (!ctx.request.body.html)
            ctx.request.body.html = '<html><body></body></html>';
        ;

        try {
            jTormLanguageModel.setLanguage(ctx.params.language);

            const v = await jTormViewModel.create(ctx.request.body.html, ctx.request.body.tss, ctx.request.body.data);

            await jTormEventModel.handle(v, 'before', 'view');
            const doc = await jTormHandler.handle(null, null, null, 1, v);

            const v2 = await jTormViewModel.create(doc, null, ctx.request.body.data, 0);
            await jTormEventModel.handle(v2, 'after', 'view');

            ctx.status = 200;

            if (parseInt(process.env.MINIFY_HTML)) {
                if (ctx.request.body.return_body) {
                    const doc2 = await jTormHandler.handle(minifyHTMLActionModel(v2.h.html()));
                    ctx.body = doc2.body();
                } else
                    ctx.body = minifyHTMLActionModel(v2.h.html())
                ;
            } else {
                if (ctx.request.body.return_body)
                    ctx.body = v2.h.body()
                ; else
                    ctx.body = v2.h.html()
                ;
            }

            ctx.type = 'text/html; charset=utf-8';
        } catch (error) {
            console.error(error);
            console.error(error.stack);

            errorHandlerModel.error(error);

            ctx.body = error;
            ctx.status = 500;
        }
    }
};

module.exports = {
    compileApiController
};
