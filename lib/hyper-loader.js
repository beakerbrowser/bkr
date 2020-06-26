import { get } from 'https';

export function resolve(specifier, context, defaultResolve) {
  const { parentURL = null } = context
  if (specifier.startsWith('hyper://')) {
    return {url: specifier}
  } else if (parentURL && parentURL.startsWith('hyper://')) {
    return {url: new URL(specifier, parentURL).href}
  }
  return defaultResolve(specifier, context, defaultResolve)
}

export function getFormat(url, context, defaultGetFormat) {
  if (url.startsWith('hyper://')) {
    return {format: 'module'}
  }
  return defaultGetFormat(url, context, defaultGetFormat)
}

export function getSource(url, context, defaultGetSource) {
  if (url.startsWith('hyper://')) {
    return new Promise((resolve, reject) => {
      get(url.replace('hyper', 'https'), (res) => {
        let data = '';
        res.on('data', (chunk) => data += chunk);
        res.on('end', () => resolve({ source: data }));
      }).on('error', (err) => reject(err));
    });
  }
  return defaultGetSource(url, context, defaultGetSource)
}
