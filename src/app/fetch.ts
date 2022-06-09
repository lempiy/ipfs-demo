import { IUploadedFile } from './definitions';


const MAIN_API = 'https://playlist-api-rc1.k8s-rc-101.it.megogo.dev/api/v1';
const SUCCESSFUL_RESPONSE_STATUS_CODES = [200, 204];

let renewTokenPromise: Promise<any> | undefined;

export async function makeRequest<T = any>(
  url: string,
  options: RequestInit = {},
  expectedErrorCodes?: number[],
) {
  if (renewTokenPromise) {
    await renewTokenPromise;
  }
  const requestHeaders = new Headers(options.headers);
  if (options.body) {
    requestHeaders.append('Content-Type', 'application/json; charset=utf-8');
  }

  return requestFunc<T>(
    url,
    {
      ...options,
      headers: requestHeaders,
    },
    expectedErrorCodes,
  );
}

export function requestFunc<T>(
  url: string,
  extraOptions: RequestInit = {},
  expectedErrorCodes?: number[],
) {
  return new Promise<T>((resolve, reject) => {
    fetch(url, extraOptions)
      .then((res) => {
        if (SUCCESSFUL_RESPONSE_STATUS_CODES.includes(res.status)) {
          if (res.headers.get('Content-Type')?.includes('application/json')) {
            res.json().then(resolve);
          } else {
            resolve(undefined as any);
          }
        } else if (expectedErrorCodes?.includes(res.status)) {
          resolve(undefined as any);
        } else {
          reject(res);
        }
      })
      .catch((error) => {
        error.url = url;
        reject(error);
      });
  });
}

export const fetchFuncs = {
  // files
  createUpload: (filename: string, content_type: string) =>
    makeRequest<IUploadedFile>(`${MAIN_API}/uploads`, {
      method: 'POST',
      body: JSON.stringify({
        filename,
        content_type,
      }),
    }),
  getUploadedFile: (fileId: string) =>
    makeRequest<IUploadedFile>(`${MAIN_API}/uploads/${fileId}`),
  deleteUploadedFile: (fileId: string) =>
    makeRequest(`${MAIN_API}/uploads/${fileId}`, { method: 'DELETE' }),
};
