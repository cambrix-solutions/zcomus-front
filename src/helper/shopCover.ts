/** Default vendor cover — brand gradient (no stock photo). */
export const DEFAULT_SHOP_COVER =
  'data:image/svg+xml,' +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="420" viewBox="0 0 1200 420">' +
      '<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1">' +
      '<stop offset="0%" stop-color="#A6704D"/><stop offset="100%" stop-color="#3A322E"/>' +
      '</linearGradient></defs><rect width="1200" height="420" fill="url(#g)"/></svg>',
  );

/** Matches the old stock cover regardless of extension — covers persisted before the WebP switch. */
const LEGACY_COVER_SUFFIX = 'imgs/page/vendor/featured.';

export function isLegacyDefaultCover(cover: string): boolean {
  return !cover || cover.includes(LEGACY_COVER_SUFFIX);
}

export function normalizeShopCover(cover: string | undefined): string {
  if (!cover || isLegacyDefaultCover(cover)) return DEFAULT_SHOP_COVER;
  return cover;
}

export function isCustomShopCover(cover: string): boolean {
  return !!cover && cover !== DEFAULT_SHOP_COVER && !isLegacyDefaultCover(cover);
}
