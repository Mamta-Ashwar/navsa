export function getApiUrl(path = '') {
  const base = import.meta.env.VITE_API_URL || '/api';
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${base}${cleanPath}`;
}

export function getProductImageUrl(webImage) {
  if (!webImage) return '';
  if (webImage.startsWith('http://') || webImage.startsWith('https://')) {
    return webImage;
  }
  if (webImage.startsWith('/')) {
    return webImage;
  }
  return `/products/${webImage}`;
}
