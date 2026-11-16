// English source strings are stable message keys. Placeholders use {name}.
// Each other language lives in src/locales/<code>.json and is built as its own
// cacheable file; loadTranslations() must finish before t() is used.
const loaders = import.meta.glob('./locales/*.json', { import: 'default' });
const messages = {};

export async function loadTranslations() {
  await Promise.all(
    Object.entries(loaders).map(async ([path, load]) => {
      messages[path.match(/(\w+)\.json$/)[1]] = await load();
    }),
  );
}

const storageKey = 'elite-wrap-language-v1';
export const languages = {
  en: 'English',
  ro: 'Română',
  de: 'Deutsch',
  es: 'Español',
  it: 'Italiano',
  hu: 'Magyar',
};

function supported(value) {
  const code =
    typeof value === 'string' ? value.toLowerCase().split(/[-_]/)[0] : '';
  return Object.hasOwn(languages, code) ? code : null;
}

let saved;
try {
  saved = localStorage.getItem(storageKey);
} catch (error) {
  console.warn('Language preference cannot be read:', error);
}
// A ?lang= link (used by search engines for each language) wins over the
// saved preference and the browser language.
const urlLocale = supported(new URLSearchParams(location.search).get('lang'));
let locale =
  urlLocale ||
  supported(saved) ||
  [...(navigator.languages || []), navigator.language]
    .map(supported)
    .find(Boolean) ||
  'en';

export function getLocale() {
  return locale;
}

export function setLocale(value, { persist = true } = {}) {
  locale = supported(value) || 'en';
  if (!persist) return;
  const url = new URL(location.href);
  if (url.searchParams.has('lang')) {
    url.searchParams.set('lang', locale);
    history.replaceState(history.state, '', url);
  }
  try {
    localStorage.setItem(storageKey, locale);
  } catch (error) {
    console.warn('Language preference cannot be saved:', error);
  }
}

export function t(key, params = {}) {
  const template = messages[locale]?.[key] ?? key;
  return template.replace(/\{(\w+)\}/g, (match, name) =>
    Object.hasOwn(params, name) ? String(params[name]) : match,
  );
}

// Capture the original static nodes once, so language changes never replace
// controls, erase user input, or disturb application state.
export function captureStaticTranslations(root = document) {
  const nodes = [];
  const walker = document.createTreeWalker(root.body, NodeFilter.SHOW_TEXT);
  while (walker.nextNode()) {
    const node = walker.currentNode;
    if (node.parentElement.closest('script, style')) continue;
    const original = node.nodeValue;
    const key = original.trim().replace(/\s+/g, ' ');
    if (key && Object.hasOwn(messages.ro, key)) {
      nodes.push({
        node,
        key,
        leading: original.match(/^\s*/)[0],
        trailing: original.match(/\s*$/)[0],
      });
    }
  }
  const attributes = [];
  root
    .querySelectorAll('[aria-label], [placeholder], [title]')
    .forEach((element) => {
      ['aria-label', 'placeholder', 'title'].forEach((name) => {
        const key = element.getAttribute(name);
        if (key && Object.hasOwn(messages.ro, key))
          attributes.push({ element, name, key });
      });
    });
  const description = root.querySelector('meta[name="description"]');
  const descriptionKey = description.content;
  const titleKey = root.title;
  // An optional scope limits the update to one subtree, without touching the
  // document language, for layout measurement.
  return (scope = null) => {
    const inScope = (node) => !scope || scope.contains(node);
    if (!scope) {
      root.documentElement.lang = locale;
      root.title = t(titleKey);
      description.content = t(descriptionKey);
      // Each ?lang= page is its own canonical, so hreflang alternates count.
      const canonical = root.querySelector('link[rel="canonical"]');
      if (canonical && new URLSearchParams(location.search).has('lang')) {
        const url = new URL(canonical.href);
        url.search = locale === 'en' ? '' : `?lang=${locale}`;
        canonical.href = url.href;
      }
    }
    nodes.forEach(({ node, key, leading, trailing }) => {
      if (inScope(node)) node.nodeValue = `${leading}${t(key)}${trailing}`;
    });
    attributes.forEach(({ element, name, key }) => {
      if (inScope(element)) element.setAttribute(name, t(key));
    });
  };
}
