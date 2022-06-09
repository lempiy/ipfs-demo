export interface IUploadedFile {
    cdn_id: string;
    created_at: string;
    download_url: string;
    entity_id: string;
    error: string;
    filename: string;
    id: string;
    modified_at: string;
    path: string;
    preview_url: string;
    size: number;
    state: UploadedFileState;
    upload_url: string;
    author_id: string;
    content_type: string;
    streaming_links?: {
        hds: string;
        hls: string;
        mpd: string;
        ss: string;
    };
}

export enum UploadedFileState {
    new = 'new',
    succeeded = 'succeeded',
    artifactsReady = 'artifacts-ready',
}
