/*! (c) jTorm and other contributors | www.jtorm.com/license */

const createDOMPurify = require('dompurify');

const config = Object.freeze({
    USE_PROFILES: { html: true },
    ADD_TAGS: Object.freeze(['source', 'track']),
    ADD_ATTR: Object.freeze([
        'autoplay',
        'controls',
        'default',
        'height',
        'kind',
        'label',
        'loop',
        'muted',
        'playsinline',
        'poster',
        'preload',
        'selected',
        'src',
        'srclang',
        'type',
        'value',
        'width'
    ]),
    FORBID_TAGS: Object.freeze(['base', 'embed', 'iframe', 'link', 'meta', 'object', 'script']),
    FORBID_ATTR: Object.freeze(['srcdoc'])
});

function createSanitizer(window) {
    if (!window || !window.document)
        throw new TypeError('createSanitizer requires a DOM window')
    ;

    const purify = createDOMPurify(window);

    return function sanitize(html) {
        return purify.sanitize(String(html), config);
    };
}

module.exports = { createSanitizer, config };
