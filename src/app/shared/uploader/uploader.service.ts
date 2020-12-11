import { Observable } from 'rxjs';
import { EventEmitter, Injectable } from '@angular/core';
import {
  ImageType,
  NgUploaderOptions,
  OutputType,
  UploadFile,
  UploadInput,
  UploadOutput,
  UploadStatus,
} from './upload.interface';
import { DomSanitizer } from '@angular/platform-browser';
import { cloneDeep } from 'lodash-es';

@Injectable({
  providedIn: 'root',
})
export class UploaderService {
  serviceEvents: EventEmitter<UploadOutput>;

  constructor(private sanitizer: DomSanitizer) {
    this.serviceEvents = new EventEmitter();
  }

  handleFiles(
    files: FileList,
    options: NgUploaderOptions,
    imageType?: ImageType,
    previousFiles: UploadFile[] = []
  ): void {
    const _previousFiles: UploadFile[] = cloneDeep(previousFiles);
    [].forEach.call(files, (file: File, i: number) => {
      const uploadFile: UploadFile = {
        fileIndex: _previousFiles[_previousFiles.length - 1]
          ? _previousFiles[_previousFiles.length - 1].fileIndex + 1
          : 0,
        file: file,
        id: this.generateId(),
        name: file.name,
        size: file.size,
        type: file.type,
        progress: {
          status: UploadStatus.Queue,
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
          uploadFile.preview = this.sanitizer.bypassSecurityTrustResourceUrl(
            event.target.result
          );
          this.serviceEvents.emit({
            type: OutputType.addedToQueue,
            file: uploadFile,
            imageType: imageType,
          });
        });
        _previousFiles.push(uploadFile);
      }
    });
  }

  private checkExtension(
    file: UploadFile,
    options: NgUploaderOptions,
    imageType: string
  ): boolean {
    let allowedExtensions = options.allowedExtensions || [];
    if (allowedExtensions.indexOf(file.type.toLowerCase()) !== -1) {
      return true;
    }

    let ext = file.name.split('.').pop();
    if (ext && allowedExtensions.indexOf(ext.toLowerCase()) !== -1) {
      return true;
    }

    this.serviceEvents.emit({
      type: OutputType.rejected,
      file: file,
      reason: 'ExtensionNotAllowed',
      imageType,
    });

    return false;
  }

  private checkMaxUploads(
    file: UploadFile,
    options: NgUploaderOptions,
    files: UploadFile[],
    imageType: string
  ): boolean {
    if (files.length < options.maxUploads) {
      return true;
    }
    this.serviceEvents.emit({
      type: OutputType.rejected,
      file: file,
      reason: 'MaxUploadsExceeded',
      imageType,
    });
    return false;
  }

  private checkMaxSize(
    file: UploadFile,
    options: NgUploaderOptions,
    imageType: string
  ): boolean {
    if (!options.maxSize || file.size < options.maxSize) {
      return true;
    }
    this.serviceEvents.emit({
      type: OutputType.rejected,
      file: file,
      reason: 'MaxSizeExceeded',
      imageType,
    });
    return false;
  }

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
            uploadedPercentage =
              uploadedPercentage < 100 ? uploadedPercentage : 100;

            file.progress = {
              status: UploadStatus.Uploading,
              data: {
                percentage: percentage,
                speed: speed,
                speedHuman: `${humanizeBytes(speed)}/s`,
              },
            };

            observer.next({
              type: OutputType.uploading,
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
            status: UploadStatus.Done,
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
            observer.next({ type: OutputType.done, file: file });
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
        Object.keys(headers).forEach((key) =>
          xhr.setRequestHeader(key, headers[key])
        );
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
