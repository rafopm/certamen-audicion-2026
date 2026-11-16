import { api } from './api.js';

const audioUrlCache = new Map();
const pendingAudioLoads = new Map();

export function isAudioCached(fileId) {
  return audioUrlCache.has(String(fileId || '').trim());
}

function retainSingleCachedAudio(fileId) {
  const key = String(fileId || '').trim();
  audioUrlCache.forEach((url, cachedId) => {
    if (cachedId !== key) {
      URL.revokeObjectURL(url);
      audioUrlCache.delete(cachedId);
    }
  });
}

export async function getCachedAudioUrl(fileId, loadDataUri) {
  const key = String(fileId || '').trim();
  if (!key) throw new Error('No se puede cargar audio sin un ID de archivo');
  if (typeof loadDataUri !== 'function') throw new Error('Se requiere una función para cargar el audio');

  retainSingleCachedAudio(key);
  if (audioUrlCache.has(key)) return audioUrlCache.get(key);
  if (pendingAudioLoads.has(key)) return pendingAudioLoads.get(key);

  const loadPromise = (async () => {
    const dataUri = await loadDataUri();
    if (typeof dataUri !== 'string' || !dataUri.startsWith('data:audio/')) {
      throw new Error('El servidor no devolvió un audio válido');
    }

    const response = await fetch(dataUri);
    if (!response.ok) throw new Error('No se pudo preparar el audio para reproducción');

    const blob = await response.blob();
    if (blob.size === 0) throw new Error('El archivo de audio está vacío');

    const objectUrl = URL.createObjectURL(blob);
    retainSingleCachedAudio(key);
    audioUrlCache.set(key, objectUrl);
    return objectUrl;
  })();

  pendingAudioLoads.set(key, loadPromise);
  try {
    return await loadPromise;
  } finally {
    pendingAudioLoads.delete(key);
  }
}

export function preloadAudio(fileId) {
  return getCachedAudioUrl(fileId, async () => {
    const response = await api.getAudioUrl(fileId, true);
    const dataUri = response && response.data && response.data.dataUri;
    if (!dataUri || typeof dataUri !== 'string') return '';
    if (
      dataUri.startsWith('data:video/') ||
      dataUri.startsWith('data:application/octet-stream') ||
      dataUri.startsWith('data:binary/')
    ) {
      return dataUri.replace(/^data:[^;]+;base64,/, 'data:audio/mpeg;base64,');
    }
    return dataUri;
  });
}

if (typeof window !== 'undefined') {
  window.addEventListener('pagehide', event => {
    if (event.persisted) return;
    audioUrlCache.forEach(url => URL.revokeObjectURL(url));
    audioUrlCache.clear();
  });
}
