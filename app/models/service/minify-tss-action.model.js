/*! (c) jTorm and other contributors | www.jtorm.com/license */

const
    {jTormTSSParser} = require('@jtorm/tss-parser'),

    minifyTSSActionModel = function (tss) {
        tss = tss.replace(jTormTSSParser.regexes.clean, '$1');
        tss = tss.replace(jTormTSSParser.regexes.cleanWhiteSpace, ' ');
        tss = tss.replace(/\s+(?=(?:[^'"]*['"][^'"]*['"])*[^'"]*$)/gm, ' ');

        return tss;
    }

module.exports = {
    minifyTSSActionModel
};
