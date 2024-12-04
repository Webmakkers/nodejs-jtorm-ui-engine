/*! (c) jTorm and other contributors | www.jtorm.com/license */

const
    fileCache = {},
    {fileRepositoryModel} = require('@models/file/file-repository.model'),
    {minifyHTMLActionModel} = require('@models/service/minify-html-action.model'),
    {minifyTSSActionModel} = require('@models/service/minify-tss-action.model'),

    getFileActionModel = function (path) {
        return new Promise(async (res, rej) => {
            if (fileCache[path])
                return res(fileCache[path])
            ;

            try {
                let result = await fileRepositoryModel.get(path);

                if (/\.tss$/.test(path))
                    result = minifyTSSActionModel(result)
                ; else if (/\.html$/.test(path))
                    result = minifyHTMLActionModel(result)
                ;

                fileCache[path] = result;

                return res(result);
            } catch (e) {
                return rej(e);
            }
        });
    }
;

module.exports = {
    getFileActionModel
};
