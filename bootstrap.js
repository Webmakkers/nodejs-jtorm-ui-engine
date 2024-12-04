/*! (c) jTorm and other contributors | https://jtorm.com/license */

module.exports = async () => {
    require('dotenv').config();
    require('better-module-alias')(process.env.PROJECT_CWD);

    await require('./bootstrap/jtorm')(
        process.env.DOMAIN + ':' + process.env.PORT + '/',
        JSON.parse(process.env.JTORM_CONFIG),
        JSON.parse(process.env.JTORM_CUSTOM_UI_MAPPER),
        parseInt(process.env.JTORM_DEBUG)
    );
};
