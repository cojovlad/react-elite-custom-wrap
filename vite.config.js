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
    transformIndexHtml(html) {
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
      const urls = LANGUAGES.map(
        (lang) =>
          `  <url>\n    <loc>${lang === 'en' ? `${base}/` : `${base}/?lang=${lang}`}</loc>\n${alternates}\n    <changefreq>monthly</changefreq>\n  </url>`,
      ).join('\n');
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
export const CSP = [
  "default-src 'self'",
  "script-src 'self' 'wasm-unsafe-eval'",
  "worker-src 'self' blob:",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "font-src 'self'",
  "connect-src 'self' blob: data: https://formsubmit.co",
  "form-action 'self' https://formsubmit.co",
  "object-src 'none'",
  "base-uri 'self'",
].join('; ');

function security() {
  return {
    name: 'elite-security',
    apply: 'build',
    transformIndexHtml: () => [
      {
        tag: 'meta',
        attrs: { 'http-equiv': 'Content-Security-Policy', content: CSP },
        injectTo: 'head-prepend',
      },
    ],
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
      handler: (html, { bundle }) =>
        Object.values(bundle ?? {})
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
          })),
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
      for (const folder of ['models', 'decoders', 'fonts'])
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
  return {
    plugins: [
      security(),
      seo(env.SITE_URL ?? ''),
      preloadTranslations(),
      serviceWorker(),
    ],
    build: {
      // Three.js is split into its own lazily loaded chunk.
      chunkSizeWarningLimit: 800,
    },
  };
});
