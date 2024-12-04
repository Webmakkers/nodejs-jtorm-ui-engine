/*! (c) jTorm and other contributors | www.jtorm.com/license */

const
    fs = require('fs'),
    {EntityDoesNotExistsError} = require('@jtorm/error-handler'),

    fileRepositoryModel = {
        path: function (file) {
            let p;

            try {
                p = require.resolve(file);
            } catch (e) {
                p = /(['])(\\?.)*?\1/.exec(e.message)[0];
                p = p.substring(1, p.length - 1);
            }

            return p;
        },

        get: function (file) {
            return new Promise((resolve, reject) => {
                fs.readFile(this.path(file), {'encoding': 'utf8'}, (err, data) => {
                    if (err) {
                        if (err.code === 'ENOENT')
                            return reject(new EntityDoesNotExistsError(this.path(file)))
                        ;

                        return reject(err);
                    }

                    return resolve(data);
                });
            });
        }
    }
;

module.exports = {
    fileRepositoryModel
};
