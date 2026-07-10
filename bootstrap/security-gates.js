/*! (c) jTorm and other contributors | www.jtorm.com/license */

'use strict';

const multiTenantSsrGate = Object.freeze({
    enabled: false,
    sanitizerDIWired: false,
    enableEnv: Object.freeze([
        'JTORM_MULTI_TENANT_SSR',
        'JTORM_UNTRUSTED_DATA_SSR'
    ]),
    requiredFrameworkPackages: Object.freeze({
        '@jtorm/types': '1.0.6',
        '@jtorm/request-model': '1.1.2',
        '@jtorm/data-model': '1.0.4',
        '@jtorm/html-model': '1.0.4',
        '@jtorm/tss-model': '1.0.4',
        '@jtorm/handler-wrapper': '1.0.5',
        '@jtorm/insert-method': '1.0.5',
        '@jtorm/get-method': '1.0.7',
        '@jtorm/wrap-method': '1.0.4',
        '@jtorm/swap-method': '1.0.2'
    })
});

function on(v) {
    return v != null && !/^(|0|false|no|off)$/i.test(String(v).trim());
}

function assertSecurityGates(env) {
    env = env || {};

    for (const k of multiTenantSsrGate.enableEnv) {
        if (on(env[k]) && (!multiTenantSsrGate.enabled || !multiTenantSsrGate.sanitizerDIWired))
            throw new Error(k + ' is disabled until sanitizer DI is wired with seam-capable @jtorm packages')
        ;
    }
}

module.exports = { assertSecurityGates, multiTenantSsrGate };
