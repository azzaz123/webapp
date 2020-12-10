import { SafeResourceUrl } from '@angular/platform-browser';
import { DeliveryInfo } from '@core/item/item-response.interface';

export enum UploadStatus {
  Queue,
  Uploading,
  Done,
  Canceled,
}

export enum OutputType {
  addedToQueue = 'addedToQueue',
  uploading = 'uploading',
  done = 'done',
  rejected = 'rejected',
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
  pendingFiles?: PendingFiles;
  imageType?: string;
  percentage?: number;
}

export interface PendingFiles {
  totalFiles: number;
  currentUploading: number;
}

export interface UploadInput {
  type: InputType;
  url?: string;
  method?: string;
  id?: string;
  fieldName?: string;
  fileIndex?: number;
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

interface IUploadForm {
  id: string;
  category_id: string;
  images: UploadFile[];
  title: string;
  sale_price: string;
  currency_code: string;
  location: {
    address: string;
    latitude: string;
    longitude: string;
  };
}

export interface IProductUploadForm extends IUploadForm {
  delivery_info: DeliveryInfo;
  description: string;
  sale_conditions: {
    fix_price: boolean;
    exchange_allowed: boolean;
  };
  extra_info: {
    object_type: {
      id: string;
    };
    object_type_2: {
      id: string;
    };
    brand: string;
    model: string;
    size: {
      id: string;
    };
    gender: string;
    condition: string;
  };
}

export interface IRealEstateUploadForm extends IUploadForm {
  storytelling: string;
  operation: string;
  type: string;
  condition: string;
  surface: string;
  rooms: string;
  bathrooms: string;
  garage: boolean;
  terrace: boolean;
  elevator: boolean;
  pool: boolean;
  garden: boolean;
}
export interface ICarUploadForm extends IUploadForm {
  model: string;
  brand: string;
  year: string;
  financed_price: string;
  version: string;
  num_seats: string;
  num_doors: string;
  body_type: string;
  km: string;
  storytelling: string;
  engine: string;
  gearbox: string;
  horsepower: string;
}

export enum imageType {
  COVER = 'cover',
  AVATAR = 'avatar',
}
