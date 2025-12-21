import 'cookie';
import 'kleur/colors';
import { N as NOOP_MIDDLEWARE_FN } from './chunks/astro-designed-error-pages_dv-kwTDU.mjs';
import 'es-module-lexer';
import { h as decodeKey } from './chunks/astro/server_DCJjPpMh.mjs';
import 'clsx';

function sanitizeParams(params) {
  return Object.fromEntries(
    Object.entries(params).map(([key, value]) => {
      if (typeof value === "string") {
        return [key, value.normalize().replace(/#/g, "%23").replace(/\?/g, "%3F")];
      }
      return [key, value];
    })
  );
}
function getParameter(part, params) {
  if (part.spread) {
    return params[part.content.slice(3)] || "";
  }
  if (part.dynamic) {
    if (!params[part.content]) {
      throw new TypeError(`Missing parameter: ${part.content}`);
    }
    return params[part.content];
  }
  return part.content.normalize().replace(/\?/g, "%3F").replace(/#/g, "%23").replace(/%5B/g, "[").replace(/%5D/g, "]");
}
function getSegment(segment, params) {
  const segmentPath = segment.map((part) => getParameter(part, params)).join("");
  return segmentPath ? "/" + segmentPath : "";
}
function getRouteGenerator(segments, addTrailingSlash) {
  return (params) => {
    const sanitizedParams = sanitizeParams(params);
    let trailing = "";
    if (addTrailingSlash === "always" && segments.length) {
      trailing = "/";
    }
    const path = segments.map((segment) => getSegment(segment, sanitizedParams)).join("") + trailing;
    return path || "/";
  };
}

function deserializeRouteData(rawRouteData) {
  return {
    route: rawRouteData.route,
    type: rawRouteData.type,
    pattern: new RegExp(rawRouteData.pattern),
    params: rawRouteData.params,
    component: rawRouteData.component,
    generate: getRouteGenerator(rawRouteData.segments, rawRouteData._meta.trailingSlash),
    pathname: rawRouteData.pathname || void 0,
    segments: rawRouteData.segments,
    prerender: rawRouteData.prerender,
    redirect: rawRouteData.redirect,
    redirectRoute: rawRouteData.redirectRoute ? deserializeRouteData(rawRouteData.redirectRoute) : void 0,
    fallbackRoutes: rawRouteData.fallbackRoutes.map((fallback) => {
      return deserializeRouteData(fallback);
    }),
    isIndex: rawRouteData.isIndex
  };
}

function deserializeManifest(serializedManifest) {
  const routes = [];
  for (const serializedRoute of serializedManifest.routes) {
    routes.push({
      ...serializedRoute,
      routeData: deserializeRouteData(serializedRoute.routeData)
    });
    const route = serializedRoute;
    route.routeData = deserializeRouteData(serializedRoute.routeData);
  }
  const assets = new Set(serializedManifest.assets);
  const componentMetadata = new Map(serializedManifest.componentMetadata);
  const inlinedScripts = new Map(serializedManifest.inlinedScripts);
  const clientDirectives = new Map(serializedManifest.clientDirectives);
  const serverIslandNameMap = new Map(serializedManifest.serverIslandNameMap);
  const key = decodeKey(serializedManifest.key);
  return {
    // in case user middleware exists, this no-op middleware will be reassigned (see plugin-ssr.ts)
    middleware() {
      return { onRequest: NOOP_MIDDLEWARE_FN };
    },
    ...serializedManifest,
    assets,
    componentMetadata,
    inlinedScripts,
    clientDirectives,
    routes,
    serverIslandNameMap,
    key
  };
}

const manifest = deserializeManifest({"hrefRoot":"file:///D:/Repository/toolchain/frontend/","adapterName":"@astrojs/vercel/serverless","routes":[{"file":"403/index.html","links":[],"scripts":[],"styles":[],"routeData":{"route":"/403","isIndex":false,"type":"page","pattern":"^\\/403\\/?$","segments":[[{"content":"403","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/403.astro","pathname":"/403","prerender":true,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}},{"file":"404.html","links":[],"scripts":[],"styles":[],"routeData":{"route":"/404","isIndex":false,"type":"page","pattern":"^\\/404\\/?$","segments":[[{"content":"404","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/404.astro","pathname":"/404","prerender":true,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}},{"file":"500.html","links":[],"scripts":[],"styles":[],"routeData":{"route":"/500","isIndex":false,"type":"page","pattern":"^\\/500\\/?$","segments":[[{"content":"500","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/500.astro","pathname":"/500","prerender":true,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}},{"file":"502/index.html","links":[],"scripts":[],"styles":[],"routeData":{"route":"/502","isIndex":false,"type":"page","pattern":"^\\/502\\/?$","segments":[[{"content":"502","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/502.astro","pathname":"/502","prerender":true,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}},{"file":"about/index.html","links":[],"scripts":[],"styles":[],"routeData":{"route":"/about","isIndex":false,"type":"page","pattern":"^\\/about\\/?$","segments":[[{"content":"about","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/about.astro","pathname":"/about","prerender":true,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}},{"file":"blog/index.html","links":[],"scripts":[],"styles":[],"routeData":{"route":"/blog","isIndex":false,"type":"page","pattern":"^\\/blog\\/?$","segments":[[{"content":"blog","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/blog.astro","pathname":"/blog","prerender":true,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}},{"file":"cli-reference/index.html","links":[],"scripts":[],"styles":[],"routeData":{"route":"/cli-reference","isIndex":false,"type":"page","pattern":"^\\/cli-reference\\/?$","segments":[[{"content":"cli-reference","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/cli-reference.astro","pathname":"/cli-reference","prerender":true,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}},{"file":"contact/index.html","links":[],"scripts":[],"styles":[],"routeData":{"route":"/contact","isIndex":false,"type":"page","pattern":"^\\/contact\\/?$","segments":[[{"content":"contact","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/contact.astro","pathname":"/contact","prerender":true,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}},{"file":"docs/index.html","links":[],"scripts":[],"styles":[],"routeData":{"route":"/docs","isIndex":false,"type":"page","pattern":"^\\/docs\\/?$","segments":[[{"content":"docs","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/docs.astro","pathname":"/docs","prerender":true,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}},{"file":"faq/index.html","links":[],"scripts":[],"styles":[],"routeData":{"route":"/faq","isIndex":false,"type":"page","pattern":"^\\/faq\\/?$","segments":[[{"content":"faq","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/faq.astro","pathname":"/faq","prerender":true,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}},{"file":"getting-started/index.html","links":[],"scripts":[],"styles":[],"routeData":{"route":"/getting-started","isIndex":false,"type":"page","pattern":"^\\/getting-started\\/?$","segments":[[{"content":"getting-started","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/getting-started.astro","pathname":"/getting-started","prerender":true,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}},{"file":"nexdocs/index.html","links":[],"scripts":[],"styles":[],"routeData":{"route":"/nexdocs","isIndex":false,"type":"page","pattern":"^\\/nexdocs\\/?$","segments":[[{"content":"nexdocs","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/nexdocs.astro","pathname":"/nexdocs","prerender":true,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}},{"file":"nexpackages/index.html","links":[],"scripts":[],"styles":[],"routeData":{"route":"/nexpackages","isIndex":true,"type":"page","pattern":"^\\/nexpackages\\/?$","segments":[[{"content":"nexpackages","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/nexpackages/index.astro","pathname":"/nexpackages","prerender":true,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}},{"file":"packages/view/index.html","links":[],"scripts":[],"styles":[],"routeData":{"route":"/packages/view","isIndex":false,"type":"page","pattern":"^\\/packages\\/view\\/?$","segments":[[{"content":"packages","dynamic":false,"spread":false}],[{"content":"view","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/packages/view.astro","pathname":"/packages/view","prerender":true,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}},{"file":"packages/index.html","links":[],"scripts":[],"styles":[],"routeData":{"route":"/packages","isIndex":true,"type":"page","pattern":"^\\/packages\\/?$","segments":[[{"content":"packages","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/packages/index.astro","pathname":"/packages","prerender":true,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}},{"file":"status/index.html","links":[],"scripts":[],"styles":[],"routeData":{"route":"/status","isIndex":false,"type":"page","pattern":"^\\/status\\/?$","segments":[[{"content":"status","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/status.astro","pathname":"/status","prerender":true,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}},{"file":"index.html","links":[],"scripts":[],"styles":[],"routeData":{"route":"/","isIndex":true,"type":"page","pattern":"^\\/$","segments":[],"params":[],"component":"src/pages/index.astro","pathname":"/","prerender":true,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"endpoint","isIndex":false,"route":"/_image","pattern":"^\\/_image$","segments":[[{"content":"_image","dynamic":false,"spread":false}]],"params":[],"component":"node_modules/astro/dist/assets/endpoint/generic.js","pathname":"/_image","prerender":false,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[{"type":"external","value":"/_astro/hoisted.BjVGbqxF.js"}],"styles":[{"type":"external","src":"/_astro/about.BEQDDjDH.css"},{"type":"external","src":"/_astro/_id_.mdwe565a.css"}],"routeData":{"route":"/packages/[id]","isIndex":false,"type":"page","pattern":"^\\/packages\\/([^/]+?)\\/?$","segments":[[{"content":"packages","dynamic":false,"spread":false}],[{"content":"id","dynamic":true,"spread":false}]],"params":["id"],"component":"src/pages/packages/[id].astro","prerender":false,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}}],"site":"https://try-nex.vercel.app","base":"/","trailingSlash":"ignore","compressHTML":true,"componentMetadata":[["D:/Repository/toolchain/frontend/src/pages/403.astro",{"propagation":"none","containsHead":true}],["D:/Repository/toolchain/frontend/src/pages/404.astro",{"propagation":"none","containsHead":true}],["D:/Repository/toolchain/frontend/src/pages/500.astro",{"propagation":"none","containsHead":true}],["D:/Repository/toolchain/frontend/src/pages/502.astro",{"propagation":"none","containsHead":true}],["D:/Repository/toolchain/frontend/src/pages/about.astro",{"propagation":"none","containsHead":true}],["D:/Repository/toolchain/frontend/src/pages/author/[name].astro",{"propagation":"none","containsHead":true}],["D:/Repository/toolchain/frontend/src/pages/blog.astro",{"propagation":"none","containsHead":true}],["D:/Repository/toolchain/frontend/src/pages/cli-reference.astro",{"propagation":"none","containsHead":true}],["D:/Repository/toolchain/frontend/src/pages/contact.astro",{"propagation":"none","containsHead":true}],["D:/Repository/toolchain/frontend/src/pages/docs.astro",{"propagation":"none","containsHead":true}],["D:/Repository/toolchain/frontend/src/pages/faq.astro",{"propagation":"none","containsHead":true}],["D:/Repository/toolchain/frontend/src/pages/getting-started.astro",{"propagation":"none","containsHead":true}],["D:/Repository/toolchain/frontend/src/pages/index.astro",{"propagation":"none","containsHead":true}],["D:/Repository/toolchain/frontend/src/pages/packages/[id].astro",{"propagation":"none","containsHead":true}],["D:/Repository/toolchain/frontend/src/pages/packages/index.astro",{"propagation":"none","containsHead":true}],["D:/Repository/toolchain/frontend/src/pages/packages/view.astro",{"propagation":"none","containsHead":true}],["D:/Repository/toolchain/frontend/src/pages/status.astro",{"propagation":"none","containsHead":true}]],"renderers":[],"clientDirectives":[["idle","(()=>{var l=(o,t)=>{let i=async()=>{await(await o())()},e=typeof t.value==\"object\"?t.value:void 0,s={timeout:e==null?void 0:e.timeout};\"requestIdleCallback\"in window?window.requestIdleCallback(i,s):setTimeout(i,s.timeout||200)};(self.Astro||(self.Astro={})).idle=l;window.dispatchEvent(new Event(\"astro:idle\"));})();"],["load","(()=>{var e=async t=>{await(await t())()};(self.Astro||(self.Astro={})).load=e;window.dispatchEvent(new Event(\"astro:load\"));})();"],["media","(()=>{var s=(i,t)=>{let a=async()=>{await(await i())()};if(t.value){let e=matchMedia(t.value);e.matches?a():e.addEventListener(\"change\",a,{once:!0})}};(self.Astro||(self.Astro={})).media=s;window.dispatchEvent(new Event(\"astro:media\"));})();"],["only","(()=>{var e=async t=>{await(await t())()};(self.Astro||(self.Astro={})).only=e;window.dispatchEvent(new Event(\"astro:only\"));})();"],["visible","(()=>{var l=(s,i,o)=>{let r=async()=>{await(await s())()},t=typeof i.value==\"object\"?i.value:void 0,c={rootMargin:t==null?void 0:t.rootMargin},n=new IntersectionObserver(e=>{for(let a of e)if(a.isIntersecting){n.disconnect(),r();break}},c);for(let e of o.children)n.observe(e)};(self.Astro||(self.Astro={})).visible=l;window.dispatchEvent(new Event(\"astro:visible\"));})();"]],"entryModules":{"\u0000@astrojs-ssr-adapter":"_@astrojs-ssr-adapter.mjs","\u0000noop-middleware":"_noop-middleware.mjs","\u0000@astrojs-ssr-virtual-entry":"entry.mjs","\u0000@astro-renderers":"renderers.mjs","\u0000@astro-page:src/pages/403@_@astro":"pages/403.astro.mjs","\u0000@astro-page:src/pages/404@_@astro":"pages/404.astro.mjs","\u0000@astro-page:src/pages/500@_@astro":"pages/500.astro.mjs","\u0000@astro-page:src/pages/502@_@astro":"pages/502.astro.mjs","\u0000@astro-page:src/pages/about@_@astro":"pages/about.astro.mjs","\u0000@astro-page:src/pages/author/[name]@_@astro":"pages/author/_name_.astro.mjs","\u0000@astro-page:src/pages/blog@_@astro":"pages/blog.astro.mjs","\u0000@astro-page:src/pages/cli-reference@_@astro":"pages/cli-reference.astro.mjs","\u0000@astro-page:src/pages/contact@_@astro":"pages/contact.astro.mjs","\u0000@astro-page:src/pages/docs@_@astro":"pages/docs.astro.mjs","\u0000@astro-page:src/pages/faq@_@astro":"pages/faq.astro.mjs","\u0000@astro-page:src/pages/getting-started@_@astro":"pages/getting-started.astro.mjs","\u0000@astro-page:src/pages/nexdocs@_@astro":"pages/nexdocs.astro.mjs","\u0000@astro-page:src/pages/nexpackages/[id]@_@astro":"pages/nexpackages/_id_.astro.mjs","\u0000@astro-page:src/pages/nexpackages/index@_@astro":"pages/nexpackages.astro.mjs","\u0000@astro-page:src/pages/packages/view@_@astro":"pages/packages/view.astro.mjs","\u0000@astro-page:src/pages/packages/[id]@_@astro":"pages/packages/_id_.astro.mjs","\u0000@astro-page:src/pages/packages/index@_@astro":"pages/packages.astro.mjs","\u0000@astro-page:src/pages/status@_@astro":"pages/status.astro.mjs","\u0000@astro-page:src/pages/index@_@astro":"pages/index.astro.mjs","\u0000@astro-page:node_modules/astro/dist/assets/endpoint/generic@_@js":"pages/_image.astro.mjs","D:/Repository/toolchain/frontend/node_modules/astro/dist/env/setup.js":"chunks/astro/env-setup_Cr6XTFvb.mjs","\u0000@astrojs-manifest":"manifest_2F1oRLlo.mjs","/astro/hoisted.js?q=0":"_astro/hoisted._H_ypK55.js","/astro/hoisted.js?q=1":"_astro/hoisted.BUuvcK50.js","/astro/hoisted.js?q=2":"_astro/hoisted.BjVGbqxF.js","/astro/hoisted.js?q=3":"_astro/hoisted.BRtEQnZp.js","/astro/hoisted.js?q=4":"_astro/hoisted.DYdcTNv0.js","/astro/hoisted.js?q=5":"_astro/hoisted.-RDbmhVh.js","astro:scripts/before-hydration.js":""},"inlinedScripts":[],"assets":["/_astro/_id_.mdwe565a.css","/_astro/about.BEQDDjDH.css","/_astro/docs.Du7yMFql.css","/_astro/index.DfKK6_-z.css","/_astro/index.Bw5adv7b.css","/_astro/view.BcY6XAuX.css","/favicon.svg","/_astro/hoisted.BjVGbqxF.js","/_astro/hoisted.BRtEQnZp.js","/403/index.html","/404.html","/500.html","/502/index.html","/about/index.html","/blog/index.html","/cli-reference/index.html","/contact/index.html","/docs/index.html","/faq/index.html","/getting-started/index.html","/nexdocs/index.html","/nexpackages/index.html","/packages/view/index.html","/packages/index.html","/status/index.html","/index.html"],"buildFormat":"directory","checkOrigin":false,"serverIslandNameMap":[],"key":"ec/6YNdliIX4co0dTx+kAEyETG8otxW6vBKh7ocDeAE=","experimentalEnvGetSecretEnabled":false});

export { manifest };
