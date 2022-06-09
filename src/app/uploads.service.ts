import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { IUploadedFile, UploadedFileState } from './definitions';
import { fetchFuncs } from './fetch';

const rootDomain = 'https://playlist-api-rc1.k8s-rc-101.it.megogo.dev';

const pathList = '/api/v1/uploads';

interface StreamingLinks {
  hds: string;
  hls: string;
  mpd: string;
  ss: string;
}

interface Item {
  id: string;
  created_at: string;
  modified_at: string;
  path: string;
  filename: string;
  content_type: string;
  cdn_id: string;
  cid: string;
  state: string;
  error: string;
  upload_url: string;
  download_url: string;
  preview_url: string;
  size: number;
  streaming_links: StreamingLinks
}

interface Result {
  results: Item[];
  next: string;
}

@Injectable({
  providedIn: 'root'
})
export class UploadsService {
  public uploadsList: Item[] = [];
  public currentItem: Item | undefined;

  constructor(private http: HttpClient) { }

  updateList(): Observable<Result> {
    return this.http.get<Result>(`${rootDomain}${pathList}`).pipe(
      map((result: Result): Result => {
        this.uploadsList = result.results;
        return result;
      })
    )
  }

  setItem(id: string) {
    this.currentItem = this.uploadsList.find((item) => item.id === id);
  }
}


const maxChunkSize = 2 ** 20;
type ProgressCallback = (total: number, sent: number) => void;

function wait(millis: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, millis);
  });
}

function sendFile(
  uploadUrl: string,
  file: File,
  progressCallback: ProgressCallback,
) {
  return new Promise<void>((resolve, reject) => {
    const total = file.size;
    const mimetype = file.type;
    const clone = file.slice();

    send(uploadUrl);

    function send(url: string, sent = 0): Promise<any> {
      const chunk = clone.slice(sent, sent + maxChunkSize);
      const request = new Request(url, {
        method: 'PUT',
        headers: {
          'Content-type': mimetype,
          'Content-length': chunk.size.toString(),
          'Content-Range': `bytes ${sent}-${sent + chunk.size}/${total}`,
        },
        body: chunk,
      });

      return fetch(request).then((response) => {
        progressCallback(total, sent + chunk.size);
        if (response.status === 308) {
          return send(url, sent + chunk.size);
        } else if (response.status === 200) {
          resolve();
        } else {
          reject(response);
        }
        return
      });
    }
  });
}

async function checkFileAvailability(fileId: string, waitFileTranscodedCallback: () => void) {
  while (true) {
    const asset = await fetchFuncs.getUploadedFile(fileId);
    if (asset.state === UploadedFileState.succeeded) {
      waitFileTranscodedCallback();
    }
    if (
      asset.state === UploadedFileState.artifactsReady
    ) {
      return asset;
    }
    await wait(3000);
  }
}

export async function uploadFile(
  file: File,
  progressCallback: ProgressCallback,
  waitingFileAvailabilityCallback: () => void,
  waitFileTranscodedCallback: () => void,
): Promise<IUploadedFile> {
  let asset = await fetchFuncs.createUpload(
    file.name,
    file.type || 'application/octet-stream',
  );
  await sendFile(asset.upload_url, file, progressCallback);
  waitingFileAvailabilityCallback();
  asset = await checkFileAvailability(asset.id, waitFileTranscodedCallback);
  // asset.download_url = `${asset.download_url}/${window.encodeURIComponent(
  //   asset.filename,
  // )}`;
  return asset;
}

export function deleteFile(fileId: string): Promise<void> {
  return fetchFuncs.deleteUploadedFile(fileId);
}

export function deleteFiles(filesIds: string[]): Promise<void[]> {
  return Promise.all<void>(filesIds.map((id) => deleteFile(id)));
}
