/*! (c) jTorm and other contributors | https://jtorm.com/license */

const
    cluster = require("cluster"),
    Koa = require('koa')
;

(async () => {
    try {
        await require('./../bootstrap')();

        const {errorHandlerModel} = require('@jtorm/nodejs-error-handler');

        process.on('warning', warning => {
            errorHandlerModel.debug(warning);
        });

        if (cluster.isPrimary) {
            errorHandlerModel.debug(`Master ${process.pid} is running`);

            const numClusterWorkers = parseInt(process.env.WORKERS);
            if (numClusterWorkers)
                for (let i = 1; i <= numClusterWorkers; i++)
                    await cluster.fork()
            ;

            cluster.on('exit', (worker) => {
                errorHandlerModel.error(`worker ${worker.process.pid} died`);

                cluster.fork();
            })
        } else {
            const
                app = new Koa({
                    proxy: !!parseInt(process.env.KOA_PROXY),// when true proxy header fields will be trusted
                    subdomainOffset: parseInt(process.env.KOA_SUBDOMAIN_OFFSET),// offset of .subdomains to ignore, default to 2
                    proxyIpHeader: process.env.KOA_PROXY_IP_HEADER,
                    maxIpsCount: parseInt(process.env.KOA_MAX_IPS_COUNT)// max ips read from proxy ip header, default to 0 (means infinity)
                })
            ;

            require('@middlewares/bodyparser.middleware')(app);
            require('@middlewares/compress.middleware')(app);
            require('@middlewares/router.middleware')(app);
            require('@middlewares/routes.middleware')(app);

            app.listen(process.env.PORT, () => errorHandlerModel.debug(process.env.DOMAIN + ":" + process.env.PORT));

            errorHandlerModel.debug(`Worker ${process.pid} started`);
        }
    } catch (e) {
        console.error(e);
    }
})();
