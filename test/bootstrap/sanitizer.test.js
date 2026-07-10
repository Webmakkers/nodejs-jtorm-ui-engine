'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const { JSDOM } = require('jsdom');
const { createSanitizer, config } = require('../../bootstrap/sanitizer.js');

function sanitizer() {
    return createSanitizer(new JSDOM('').window);
}

test('createSanitizer requires a DOM window', () => {
    assert.throws(() => createSanitizer(), /DOM window/);
});

test('sanitizer strips executable markup and attributes', () => {
    const clean = sanitizer()(
        '<p onclick="alert(1)">ok<script>alert(2)</script><a href="javascript:alert(3)">x</a><iframe srcdoc="<script>x()</script>"></iframe></p>'
    );

    assert.equal(clean.includes('onclick'), false);
    assert.equal(clean.includes('<script'), false);
    assert.equal(clean.includes('javascript:'), false);
    assert.equal(clean.includes('<iframe'), false);
    assert.match(clean, /<p>ok<a>x<\/a><\/p>/);
});

test('sanitizer preserves rich article body markup', () => {
    const clean = sanitizer()(
        '<article><h2>Title</h2><p><strong>safe</strong> <em>copy</em> <a href="/x">link</a></p><ul><li>one</li></ul></article>'
    );

    assert.match(clean, /<article>/);
    assert.match(clean, /<h2>Title<\/h2>/);
    assert.match(clean, /<strong>safe<\/strong>/);
    assert.match(clean, /<em>copy<\/em>/);
    assert.match(clean, /<a href="\/x">link<\/a>/);
    assert.match(clean, /<ul><li>one<\/li><\/ul>/);
});

test('sanitizer preserves jTorm composition tags for select and media', () => {
    const clean = sanitizer()(
        '<select><option value="a" selected>Alpha</option></select><video controls poster="/p.jpg"><source src="/v.mp4" type="video/mp4"><track kind="captions" srclang="en" src="/c.vtt" label="English" default></video>'
    );

    assert.match(clean, /<select><option value="a" selected="">Alpha<\/option><\/select>/);
    assert.match(clean, /<video controls="" poster="\/p.jpg">/);
    assert.match(clean, /<source src="\/v.mp4" type="video\/mp4">/);
    assert.match(clean, /<track kind="captions" srclang="en" src="\/c.vtt" label="English" default="">/);
});

test('sanitizer uses the HTML profile only', () => {
    const clean = sanitizer()('<math><mi>x</mi></math><svg><circle></circle></svg><p>x</p>');

    assert.equal(clean, '<p>x</p>');
});

test('policy explicitly forbids high-risk raw containers', () => {
    for (const tag of ['script', 'iframe', 'object', 'embed'])
        assert.ok(config.FORBID_TAGS.includes(tag), tag + ' must stay forbidden')
    ;
});
