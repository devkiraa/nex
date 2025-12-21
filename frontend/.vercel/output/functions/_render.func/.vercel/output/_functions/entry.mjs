import { renderers } from './renderers.mjs';
import { c as createExports } from './chunks/entrypoint_Dg1asFCP.mjs';
import { manifest } from './manifest_Ck2vjSLo.mjs';

const _page0 = () => import('./pages/_image.astro.mjs');
const _page1 = () => import('./pages/403.astro.mjs');
const _page2 = () => import('./pages/404.astro.mjs');
const _page3 = () => import('./pages/500.astro.mjs');
const _page4 = () => import('./pages/502.astro.mjs');
const _page5 = () => import('./pages/about.astro.mjs');
const _page6 = () => import('./pages/author/_name_.astro.mjs');
const _page7 = () => import('./pages/blog.astro.mjs');
const _page8 = () => import('./pages/cli-reference.astro.mjs');
const _page9 = () => import('./pages/contact.astro.mjs');
const _page10 = () => import('./pages/docs.astro.mjs');
const _page11 = () => import('./pages/faq.astro.mjs');
const _page12 = () => import('./pages/getting-started.astro.mjs');
const _page13 = () => import('./pages/nexdocs.astro.mjs');
const _page14 = () => import('./pages/nexpackages/_id_.astro.mjs');
const _page15 = () => import('./pages/nexpackages.astro.mjs');
const _page16 = () => import('./pages/packages/view.astro.mjs');
const _page17 = () => import('./pages/packages/_id_.astro.mjs');
const _page18 = () => import('./pages/packages.astro.mjs');
const _page19 = () => import('./pages/status.astro.mjs');
const _page20 = () => import('./pages/index.astro.mjs');

const pageMap = new Map([
    ["node_modules/astro/dist/assets/endpoint/generic.js", _page0],
    ["src/pages/403.astro", _page1],
    ["src/pages/404.astro", _page2],
    ["src/pages/500.astro", _page3],
    ["src/pages/502.astro", _page4],
    ["src/pages/about.astro", _page5],
    ["src/pages/author/[name].astro", _page6],
    ["src/pages/blog.astro", _page7],
    ["src/pages/cli-reference.astro", _page8],
    ["src/pages/contact.astro", _page9],
    ["src/pages/docs.astro", _page10],
    ["src/pages/faq.astro", _page11],
    ["src/pages/getting-started.astro", _page12],
    ["src/pages/nexdocs.astro", _page13],
    ["src/pages/nexpackages/[id].astro", _page14],
    ["src/pages/nexpackages/index.astro", _page15],
    ["src/pages/packages/view.astro", _page16],
    ["src/pages/packages/[id].astro", _page17],
    ["src/pages/packages/index.astro", _page18],
    ["src/pages/status.astro", _page19],
    ["src/pages/index.astro", _page20]
]);
const serverIslandMap = new Map();
const _manifest = Object.assign(manifest, {
    pageMap,
    serverIslandMap,
    renderers,
    middleware: () => import('./_noop-middleware.mjs')
});
const _args = {
    "middlewareSecret": "5c577039-f58e-443f-9d31-bd8e54ad5c78",
    "skewProtection": false
};
const _exports = createExports(_manifest, _args);
const __astrojsSsrVirtualEntry = _exports.default;

export { __astrojsSsrVirtualEntry as default, pageMap };
