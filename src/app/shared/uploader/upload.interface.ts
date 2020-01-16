import { SafeResourceUrl } from '@angular/platform-browser';

export enum UploadStatus {
  Queue,
  Uploading,
  Done,
  Canceled
}

export interface UploadProgress {
  status: UploadStatus;
  data?: {
    percentage: number;
    speed: number;
    speedHuman: string;
    responseStatus?: number;
  };
}

export interface UploadFile {
  id: string;
  fileIndex: number;
  file: File;
  lastModifiedDate: Date;
  name: string;
  size: number;
  type: string;
  progress: UploadProgress;
  response?: any;
  preview?: SafeResourceUrl;
}

export interface UploadOutput {
  type: 'ready' | 'addedToQueue' | 'allAddedToQueue' | 'uploading' | 'done' | 'removed' | 'start' | 'cancelled' | 'dragOver' | 'dragOut' | 'drop' | 'rejected' | 'orderUpdated';
  file?: UploadFile;
  reason?: string;
  files?: UploadFile[];
  imageType?: string;
  percentage?: number;
}

export interface UploadInput {
  type: 'uploadAll' | 'uploadFile' | 'cancel' | 'cancelAll' | 'remove' | 'updateOrder' | 'initialImages';
  url?: string;
  method?: string;
  id?: string;
  fieldName?: string;
  fileIndex?: number;
  file?: UploadFile;
  data?: { [key: string]: string | Blob };
  headers?: { [key: string]: string };
  concurrency?: number;
  files?: UploadFile[];
  imageType?: string;
}

export interface NgUploaderOptions {
  allowedExtensions?: string[];
  maxUploads?: number;
  maxSize?: number
}
