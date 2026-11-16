export const $ = (selector) => document.querySelector(selector);

export const reducedMotion = () =>
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export function downloadFile(content, type, filename) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  document.body.append(anchor);
  anchor.click();
  anchor.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}

// Fades the loading skeleton out once the brand font is ready.
export function revealPage() {
  Promise.race([
    document.fonts?.ready,
    new Promise((resolve) => setTimeout(resolve, 1500)),
  ]).then(() =>
    requestAnimationFrame(() => {
      const skeleton = $('#page-skeleton');
      skeleton.classList.add('is-done');
      setTimeout(() => skeleton.remove(), 600);
    }),
  );
}
