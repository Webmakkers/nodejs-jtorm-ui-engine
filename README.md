# jTorm Node.js UI Engine

# Setup
Copy example.env to .env and update it accordingly.

MINIFY_HTML = minifies HTML, it might result in unexpected changes when you supply full webpages.

# Security gates
Multi-tenant and untrusted-data SSR are disabled in this host. `JTORM_MULTI_TENANT_SSR` and
`JTORM_UNTRUSTED_DATA_SSR` are reserved fail-closed flags: setting either one to a truthy value
aborts bootstrap.

Do not enable those flags until the seam-capable framework packages are published and
`bootstrap/jtorm.js` wires `bootstrap/sanitizer.js` into the framework sanitizer DI seam. Current
blocked package floor: `@jtorm/types@1.0.6`, `@jtorm/request-model@1.1.2`,
`@jtorm/data-model@1.0.4`, `@jtorm/html-model@1.0.4`, `@jtorm/tss-model@1.0.4`,
`@jtorm/handler-wrapper@1.0.5`, `@jtorm/insert-method@1.0.5`,
`@jtorm/get-method@1.0.7`, `@jtorm/wrap-method@1.0.4`, and `@jtorm/swap-method@1.0.2`.

```
# install packages
npm install

# dev
npm run dev

# production
npm run start

# restart
npm run restart

# stop
npm run stop
```
