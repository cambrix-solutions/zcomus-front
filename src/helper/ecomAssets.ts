export const ECOM_BASE = '/ecom/assets';

/** Map template-relative paths like `assets/imgs/...` or `imgs/...` to public URLs. */
export function ecom(path: string): string {
  const clean = path.replace(/^\/?assets\//, '').replace(/^\//, '');
  return `${ECOM_BASE}/${clean}`;
}
