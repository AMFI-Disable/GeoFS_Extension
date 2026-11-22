export type ModeBannerTone = 'accent' | 'danger';

const BANNER_ID = 'geofs-ext-mode-banner';

export function ensureModeBanner(tone: ModeBannerTone = 'accent'): HTMLDivElement | null {
  if (typeof document === 'undefined' || !document.body) return null;
  let el = document.getElementById(BANNER_ID) as HTMLDivElement | null;
  if (!el) {
    el = document.createElement('div');
    el.id = BANNER_ID;
    document.body.appendChild(el);
  }
  const color = tone === 'danger' ? '#d50000' : 'var(--geofs-ext-accent,#ffc107)';
  el.style.cssText =
    `position:fixed;top:8px;left:10px;z-index:2147483640;padding:4px 8px;border-radius:4px;` +
    `background:var(--geofs-ext-bg,rgba(0,0,0,0.8));border:1px solid ${color};color:${color};` +
    `font:700 11px ui-monospace,SFMono-Regular,Menlo,monospace;pointer-events:none;`;
  return el;
}

export function removeModeBanner(el: HTMLDivElement | null): void {
  el?.remove();
}
