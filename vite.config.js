import { defineConfig, loadEnv } from 'vite';
import {
  appendFileSync,
  readdirSync,
  readFileSync,
  writeFileSync,
} from 'node:fs';
import { join, relative, resolve, sep } from 'node:path';
import { createHash } from 'node:crypto';

const LANGUAGES = ['en', 'ro', 'de', 'es', 'it', 'hu'];

const text = (html) =>
  html
    .replace(/<[^>]+>/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/\s+/g, ' ')
    .replace(/\s+([?.,;])/g, '$1')
    .replace(/\+$/, '')
    .trim();

// SEO tags that depend on the published address. Set SITE_URL (for example in
// a .env file: SITE_URL=https://www.example.ro) before `npm run build`.
function seo(siteUrl) {
  const base = siteUrl.replace(/\/+$/, '');
  let outDir = 'dist';
  return {
    name: 'elite-seo',
    configResolved(config) {
      outDir = resolve(config.root, config.build.outDir);
    },
    transformIndexHtml(html, ctx) {
      // The SEO tags below describe the home page only.
      if (!ctx.path.endsWith('/index.html') && ctx.path !== '/') return html;
      // FAQ rich results, generated from the visible FAQ so they never drift.
      const faq = html.match(/<section class="faq[\s\S]*?<\/section>/)?.[0];
      const questions = [
        ...(faq ?? '').matchAll(
          /<summary>([\s\S]*?)<\/summary>\s*<p>([\s\S]*?)<\/p>/g,
        ),
      ].map(([, question, answer]) => ({
        '@type': 'Question',
        name: text(question.replace(/<span[\s\S]*?<\/span\s*>/g, '')),
        acceptedAnswer: { '@type': 'Answer', text: text(answer) },
      }));
      const tags = [];
      if (questions.length)
        tags.push({
          tag: 'script',
          attrs: { type: 'application/ld+json' },
          children: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: questions,
          }),
          injectTo: 'head',
        });
      if (!base) return { html, tags };
      const absolute = (path) => `${base}${path}`;
      html = html
        .replace(/content="\/(og-image\.jpg)"/g, `content="${absolute('/$1')}"`)
        .replace(/"(image|logo)": "\//g, `"$1": "${base}/`)
        .replace(/"@id": "#/g, `"@id": "${base}/#`)
        .replace(
          /"@type": "AutoBodyShop",/,
          `"@type": "AutoBodyShop",\n            "url": "${base}/",`,
        )
        .replace(
          /"@type": "WebSite",/,
          `"@type": "WebSite",\n            "url": "${base}/",`,
        );
      tags.push(
        { tag: 'link', attrs: { rel: 'canonical', href: `${base}/` } },
        { tag: 'meta', attrs: { property: 'og:url', content: `${base}/` } },
        ...LANGUAGES.map((lang) => ({
          tag: 'link',
          attrs: {
            rel: 'alternate',
            hreflang: lang,
            href: lang === 'en' ? `${base}/` : `${base}/?lang=${lang}`,
          },
        })),
        {
          tag: 'link',
          attrs: { rel: 'alternate', hreflang: 'x-default', href: `${base}/` },
        },
      );
      return { html, tags };
    },
    closeBundle() {
      if (!base) return;
      const alternates = LANGUAGES.map(
        (lang) =>
          `    <xhtml:link rel="alternate" hreflang="${lang}" href="${lang === 'en' ? `${base}/` : `${base}/?lang=${lang}`}"/>`,
      ).join('\n');
      const urls = [
        ...LANGUAGES.map(
          (lang) =>
            `  <url>\n    <loc>${lang === 'en' ? `${base}/` : `${base}/?lang=${lang}`}</loc>\n${alternates}\n    <changefreq>monthly</changefreq>\n  </url>`,
        ),
        `  <url>\n    <loc>${base}/privacy.html</loc>\n    <changefreq>yearly</changefreq>\n  </url>`,
      ].join('\n');
      writeFileSync(
        resolve(outDir, 'sitemap.xml'),
        `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${urls}\n</urlset>\n`,
      );
      appendFileSync(
        resolve(outDir, 'robots.txt'),
        `\nSitemap: ${base}/sitemap.xml\n`,
      );
    },
  };
}

// Content Security Policy for the built site only (the dev server needs inline
// scripts for hot reload). blob:/wasm are required by the 3D model decoders.
// The early title script is allowed by its hash.
export const CSP = [
  "default-src 'self'",
  "script-src 'self' 'wasm-unsafe-eval'",
  "worker-src 'self' blob:",
  "style-src 'self' 'unsafe-inline'",
  // Google profile photos of reviewers in the reviews carousel.
  "img-src 'self' data: blob: https://*.googleusercontent.com",
  "font-src 'self'",
  "connect-src 'self' blob: data: https://formsubmit.co",
  "form-action 'self' https://formsubmit.co",
  "object-src 'none'",
  "base-uri 'self'",
].join('; ');

function security(inlineScripts) {
  const hashes = inlineScripts.map(
    (script) =>
      `'sha256-${createHash('sha256').update(script).digest('base64')}'`,
  );
  const csp = CSP.replace(
    "script-src 'self'",
    ["script-src 'self'", ...hashes].join(' '),
  );
  return {
    name: 'elite-security',
    apply: 'build',
    transformIndexHtml: () => [
      {
        tag: 'meta',
        attrs: { 'http-equiv': 'Content-Security-Policy', content: csp },
        injectTo: 'head-prepend',
      },
    ],
  };
}

// The static title is English (the translation key). Without this, visitors
// using another language would see the tab switch from English to their
// language once the app loads. Same language choice as src/i18n.js.
function earlyTitleScript(root) {
  const html = readFileSync(resolve(root, 'index.html'), 'utf8');
  const key = html
    .match(/<title>([\s\S]*?)<\/title>/)[1]
    .replace(/&amp;/g, '&')
    .trim();
  const titles = Object.fromEntries(
    LANGUAGES.map((lang) => [
      lang,
      lang === 'en'
        ? key
        : (JSON.parse(
            readFileSync(resolve(root, `src/locales/${lang}.json`), 'utf8'),
          )[key] ?? key),
    ]),
  );
  const json = JSON.stringify(titles).replace(/</g, '\\u003c');
  return `(()=>{const t=${json},s=(v)=>{v=typeof v=="string"?v.toLowerCase().split(/[-_]/)[0]:"";return Object.hasOwn(t,v)?v:""};let l;try{l=localStorage.getItem("elite-wrap-language-v1")}catch{}const c=s(new URLSearchParams(location.search).get("lang"))||s(l)||[...(navigator.languages||[]),navigator.language].map(s).find(Boolean)||"en",e=document.querySelector("title");e.dataset.key=e.textContent;document.title=t[c];document.documentElement.lang=c})()`;
}

function earlyTitle(script) {
  return {
    name: 'elite-early-title',
    transformIndexHtml(html, ctx) {
      if (!ctx.path.endsWith('/index.html') && ctx.path !== '/') return html;
      return html.replace(
        '</title>',
        `</title>\n    <script>${script}</script>`,
      );
    },
  };
}

// Starts downloading every translation file together with the main script, so
// they are ready by the time the page renders.
function preloadTranslations() {
  return {
    name: 'elite-preload-translations',
    apply: 'build',
    transformIndexHtml: {
      order: 'post',
      handler: (html, { bundle, path }) =>
        path.endsWith('/index.html')
          ? Object.values(bundle ?? {})
              .filter(
                (chunk) =>
                  chunk.type === 'chunk' &&
                  /[\\/]src[\\/]locales[\\/]/.test(chunk.facadeModuleId ?? ''),
              )
              .map((chunk) => ({
                tag: 'link',
                attrs: {
                  rel: 'modulepreload',
                  crossorigin: true,
                  href: `/${chunk.fileName}`,
                },
                injectTo: 'head',
              }))
          : [],
    },
  };
}

// Writes dist/sw.js from src/sw-template.js with the content hash of every
// model, decoder and font, so the cache never serves an outdated file.
function serviceWorker() {
  let outDir = 'dist';
  let root = '.';
  let assets = [];
  const files = (dir) =>
    readdirSync(dir, { withFileTypes: true }).flatMap((entry) =>
      entry.isDirectory()
        ? files(join(dir, entry.name))
        : [join(dir, entry.name)],
    );
  return {
    name: 'elite-service-worker',
    apply: 'build',
    configResolved(config) {
      root = config.root;
      outDir = resolve(config.root, config.build.outDir);
    },
    generateBundle(options, bundle) {
      assets = Object.keys(bundle)
        .filter((name) => name.startsWith('assets/'))
        .map((name) => `/${name}`);
    },
    closeBundle() {
      const versions = {};
      for (const folder of ['models', 'env', 'decoders', 'fonts'])
        for (const file of files(resolve(outDir, folder)))
          versions[`/${relative(outDir, file).split(sep).join('/')}`] =
            createHash('sha256')
              .update(readFileSync(file))
              .digest('hex')
              .slice(0, 12);
      const template = readFileSync(
        resolve(root, 'src/sw-template.js'),
        'utf8',
      );
      writeFileSync(
        resolve(outDir, 'sw.js'),
        template
          .replace('self.__FILES__', JSON.stringify(versions))
          .replace('self.__ASSETS__', JSON.stringify(assets)),
      );
    },
  };
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const titleScript = earlyTitleScript(process.cwd());
  return {
    plugins: [
      security([titleScript]),
      earlyTitle(titleScript),
      seo(env.SITE_URL ?? ''),
      preloadTranslations(),
      serviceWorker(),
    ],
    build: {
      // Three.js is split into its own lazily loaded chunk.
      chunkSizeWarningLimit: 800,
      rollupOptions: {
        input: {
          main: resolve(process.cwd(), 'index.html'),
          privacy: resolve(process.cwd(), 'privacy.html'),
        },
      },
    },
  };
});
