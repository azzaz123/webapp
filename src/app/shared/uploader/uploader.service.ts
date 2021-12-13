import { Observable, Subject } from 'rxjs';
import { Injectable } from '@angular/core';
import { IMAGE_TYPE, NgUploaderOptions, OUTPUT_TYPE, UploadFile, UploadInput, UploadOutput, UPLOAD_STATUS } from './upload.interface';
import { DomSanitizer } from '@angular/platform-browser';
import { cloneDeep } from 'lodash-es';
import { TRANSLATION_KEY } from '@core/i18n/translations/enum/translation-keys.enum';

@Injectable()
export class UploaderService {
  public serviceEvents = new Subject<UploadOutput>();
  public serviceEvents$ = this.serviceEvents.asObservable();

  constructor(private sanitizer: DomSanitizer) {}

  uploadFile(file: UploadFile, event: UploadInput): Observable<UploadOutput> {
    return new Observable((observer) => {
      const url = event.url;
      const method = event.method || 'POST';
      const data = event.data || {};
      const headers = event.headers || {};

      const reader = new FileReader();
      const xhr = new XMLHttpRequest();
      let time: number = new Date().getTime();
      let load = 0;

      xhr.upload.addEventListener(
        'progress',
        (e: ProgressEvent) => {
          if (e.lengthComputable) {
            const percentage = Math.round((e.loaded * 100) / e.total);
            const diff = new Date().getTime() - time;
            time += diff;
            load = e.loaded - load;
            const speed = parseInt(((load / diff) * 1000) as any, 10);

            let uploadedPercentage = (e.loaded / file.size) * 100;
            uploadedPercentage = uploadedPercentage < 100 ? uploadedPercentage : 100;

            file.progress = {
              status: UPLOAD_STATUS.Uploading,
              data: {
                percentage: percentage,
                speed: speed,
                speedHuman: `${humanizeBytes(speed)}/s`,
              },
            };

            observer.next({
              type: OUTPUT_TYPE.uploading,
              file: file,
              percentage: uploadedPercentage,
            });
          }
        },
        false
      );

      xhr.upload.addEventListener('error', (e: Event) => {
        observer.error(e);
        observer.complete();
      });

      xhr.onreadystatechange = () => {
        if (xhr.readyState === XMLHttpRequest.DONE) {
          file.progress = {
            status: UPLOAD_STATUS.Done,
            data: {
              percentage: 100,
              speed: null,
              speedHuman: null,
              responseStatus: xhr.status,
            },
          };

          try {
            file.response = JSON.parse(xhr.response);
          } catch (e) {
            file.response = xhr.response;
          }

          if (xhr.status === 200 || xhr.status === 204) {
            observer.next({ type: OUTPUT_TYPE.done, file: file });
          } else {
            observer.error(file.response);
          }
          observer.complete();
        }
      };

      xhr.open(method, url, true);

      const form = new FormData();
      try {
        const uploadFile = file.file;
        form.append(event.fieldName || 'file', uploadFile, uploadFile.name);

        Object.keys(data).forEach((key) => {
          let value = key === 'order' ? file.fileIndex.toString() : data[key];
          form.append(key, value);
        });
        Object.keys(headers).forEach((key) => xhr.setRequestHeader(key, headers[key]));
        xhr.send(form);
      } catch (e) {
        console.error(e);
        observer.complete();
      }

      return () => {
        xhr.abort();
        reader.abort();
      };
    });
  }

  generateId(): string {
    return Math.random().toString(36).substring(7);
  }

  handleFiles(files: FileList, options: NgUploaderOptions, imageType?: IMAGE_TYPE, previousFiles: UploadFile[] = []): void {
    const _previousFiles: UploadFile[] = cloneDeep(previousFiles);
    [].forEach.call(files, (file: File, i: number) => {
      const uploadFile: UploadFile = {
        fileIndex: _previousFiles[_previousFiles.length - 1] ? _previousFiles[_previousFiles.length - 1].fileIndex + 1 : 0,
        file: file,
        id: this.generateId(),
        name: file.name,
        size: file.size,
        type: file.type,
        progress: {
          status: UPLOAD_STATUS.Queue,
          data: {
            percentage: 0,
            speed: null,
            speedHuman: null,
          },
        },
        lastModifiedDate: new Date(file.lastModified),
      };
      if (
        this.checkExtension(uploadFile, options, imageType) &&
        this.checkMaxUploads(uploadFile, options, _previousFiles, imageType) &&
        this.checkMaxSize(uploadFile, options, imageType)
      ) {
        let reader: FileReader = new FileReader();
        reader.readAsDataURL(<Blob>file);
        reader.addEventListener('load', (event: any) => {
          uploadFile.preview = this.sanitizer.bypassSecurityTrustResourceUrl(event.target.result);
          this.serviceEvents.next({
            type: OUTPUT_TYPE.addedToQueue,
            file: uploadFile,
            imageType,
          });
        });
        _previousFiles.push(uploadFile);
      }
    });
  }

  private checkExtension(file: UploadFile, options: NgUploaderOptions, imageType: IMAGE_TYPE): boolean {
    let allowedExtensions = options.allowedExtensions || [];
    if (allowedExtensions.indexOf(file.type.toLowerCase()) !== -1) {
      return true;
    }

    let ext = file.name.split('.').pop();
    if (ext && allowedExtensions.indexOf(ext.toLowerCase()) !== -1) {
      return true;
    }

    this.serviceEvents.next({
      type: OUTPUT_TYPE.rejected,
      file: file,
      reason: TRANSLATION_KEY.UPLOAD_EXTENSION_NOT_ALLOWED_ERROR,
      imageType,
    });

    return false;
  }

  private checkMaxUploads(file: UploadFile, options: NgUploaderOptions, files: UploadFile[], imageType: IMAGE_TYPE): boolean {
    if (files.length < options.maxUploads) {
      return true;
    }
    this.serviceEvents.next({
      type: OUTPUT_TYPE.rejected,
      file: file,
      reason: TRANSLATION_KEY.UPLOAD_MAX_UPLOADS_ERROR,
      imageType,
    });
    return false;
  }

  private checkMaxSize(file: UploadFile, options: NgUploaderOptions, imageType: IMAGE_TYPE): boolean {
    if (!options.maxSize || file.size < options.maxSize) {
      return true;
    }
    this.serviceEvents.next({
      type: OUTPUT_TYPE.rejected,
      file: file,
      reason: TRANSLATION_KEY.UPLOAD_MAX_SIZE_ERROR,
      imageType,
    });
    return false;
  }
}

export function humanizeBytes(bytes: number): string {
  if (bytes === 0) {
    return '0 Byte';
  }

  const k = 1024;
  const sizes: string[] = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB'];
  const i: number = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}
