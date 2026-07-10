'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const { assertSecurityGates, multiTenantSsrGate } = require('../../bootstrap/security-gates.js');

const root = path.join(__dirname, '..', '..');

test('multi-tenant and untrusted-data SSR flags fail closed', () => {
    for (const k of multiTenantSsrGate.enableEnv) {
        assert.throws(
            () => assertSecurityGates({ [k]: '1' }),
            /disabled until sanitizer DI is wired/
        );
        assert.throws(
            () => assertSecurityGates({ [k]: 'true' }),
            /disabled until sanitizer DI is wired/
        );
    }

    assert.doesNotThrow(() => assertSecurityGates({}));
    assert.doesNotThrow(() => assertSecurityGates({
        JTORM_MULTI_TENANT_SSR: '0',
        JTORM_UNTRUSTED_DATA_SSR: 'false'
    }));
});

test('bootstrap runs security gates before jTorm initialization', () => {
    const src = fs.readFileSync(path.join(root, 'bootstrap.js'), 'utf8');

    assert.match(src, /assertSecurityGates\(process\.env\)/);
    assert.ok(
        src.indexOf('assertSecurityGates(process.env)') < src.indexOf("require('./bootstrap/jtorm')"),
        'security gate must run before framework boot'
    );
});

test('blocked SSR flags make the normal entrypoint exit non-zero', async () => {
    const src = fs.readFileSync(path.join(root, 'bin', 'jtorm-static.js'), 'utf8');
    const p = { env: {}, exitCode: 0, on: () => {} };

    vm.runInNewContext(src, {
        require: m => {
            if (m === 'cluster')
                return { isPrimary: true, fork: async () => {}, on: () => {} }
            ;
            if (m === 'koa')
                return function Koa() {}
            ;
            if (m === './../bootstrap')
                return async () => { throw new Error('JTORM_MULTI_TENANT_SSR is disabled'); }
            ;

            throw new Error('unexpected require ' + m);
        },
        process: p,
        console: { error: () => {} }
    }, { filename: 'bin/jtorm-static.js' });

    await new Promise(resolve => setImmediate(resolve));
    assert.equal(p.exitCode, 1);
});

test('sanitizer DI is not wired while seam-capable packages are blocked', () => {
    const src = fs.readFileSync(path.join(root, 'bootstrap', 'jtorm.js'), 'utf8');

    assert.equal(multiTenantSsrGate.sanitizerDIWired, false);
    assert.deepEqual(multiTenantSsrGate.requiredFrameworkPackages, {
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
    });
    assert.doesNotMatch(src, /createSanitizer/);
    assert.doesNotMatch(src, /\.sanitize\s*=/);
});
