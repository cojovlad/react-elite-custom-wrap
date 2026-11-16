// Registers the offline cache in production. It only speeds up repeat visits:
// pages and requests behave exactly as without it.
export function registerServiceWorker() {
  if (!import.meta.env.PROD || !('serviceWorker' in navigator)) return;
  const register = async () => {
    try {
      await navigator.serviceWorker.register('/sw.js');
      const worker = (await navigator.serviceWorker.ready).active;
      // Models fetched before the worker took over are cached as well.
      worker?.postMessage({
        type: 'cache',
        urls: performance
          .getEntriesByType('resource')
          .map(({ name }) => name)
          .filter((url) => url.startsWith(location.origin)),
      });
    } catch (error) {
      console.warn('Offline cache unavailable:', error);
    }
  };
  if (document.readyState === 'complete') register();
  else window.addEventListener('load', register, { once: true });
}
