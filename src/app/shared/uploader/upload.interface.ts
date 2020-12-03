import { SafeResourceUrl } from '@angular/platform-browser';

export enum UploadStatus {
  Queue,
  Uploading,
  Done,
  Canceled,
}

export enum OutputType {
  addedToQueue = 'addedToQueue',
  allAddedToQueue = 'allAddedToQueue',
  uploading = 'uploading',
  done = 'done',
  rejected = 'rejected',
  start = 'start',
}

export enum UploadAction {
  created = 'created',
  updated = 'updated',
  urgent = 'urgent',
  createdOnHold = 'createdOnHold',
}

export enum InputType {
  uploadRemainingImages = 'uploadRemainingImages',
  uploadFile = 'uploadFile',
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
  type: OutputType;
  file?: UploadFile;
  reason?: string;
  files?: UploadFile[];
  imageType?: string;
  percentage?: number;
}

export interface UploadInput {
  type: InputType;
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
  maxSize?: number;
}
