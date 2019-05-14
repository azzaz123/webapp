import { EventEmitter, Injectable } from '@angular/core';
import { NgUploaderOptions, UploadFile, UploadInput, UploadOutput, UploadStatus } from './upload.interface';
import { Observable, Subscriber, Subscription } from 'rxjs/Rx';
import { DomSanitizer } from '@angular/platform-browser';

@Injectable({
  providedIn: 'root'
})
export class UploaderService {

  files: UploadFile[] = [];
  uploads: { file?: UploadFile, files?: UploadFile[], sub: Subscription }[];
  serviceEvents: EventEmitter<UploadOutput>;
  options: NgUploaderOptions;

  constructor(private sanitizer: DomSanitizer) {
    this.files = [];
    this.serviceEvents = new EventEmitter();
    this.uploads = [];
  }

  handleFiles(files: FileList, imageType?: string): void {
    [].forEach.call(files, (file: File, i: number) => {
      const uploadFile: UploadFile = {
        fileIndex:        this.files[this.files.length - 1] ? this.files[this.files.length - 1].fileIndex + 1 : 0,
        file:             file,
        id:               this.generateId(),
        name:             file.name,
        size:             file.size,
        type:             file.type,
        progress:         {
          status: UploadStatus.Queue,
          data:   {
            percentage: 0,
            speed:      null,
            speedHuman: null
          }
        },
        lastModifiedDate: file.lastModifiedDate
      };
      if (this.checkExtension(uploadFile) && this.checkMaxUploads(uploadFile) && this.checkMaxSize(uploadFile)) {
        let reader: FileReader = new FileReader();
        reader.readAsDataURL(<Blob>file);
        reader.addEventListener('load', (event: any) => {
          uploadFile.preview = this.sanitizer.bypassSecurityTrustResourceUrl(event.target.result);
          this.serviceEvents.emit({type: 'addedToQueue', file: uploadFile, imageType: imageType});
        });
        this.files.push(uploadFile);
      }
    });
    this.serviceEvents.emit({ type: 'allAddedToQueue' });
  }

  private checkExtension(file: UploadFile): boolean {
    let allowedExtensions = this.options.allowedExtensions || [];
    if (allowedExtensions.indexOf(file.type.toLowerCase()) !== -1) {
      return true;
    }

    let ext = file.name.split('.').pop();
    if (ext && allowedExtensions.indexOf(ext.toLowerCase()) !== -1) {
      return true;
    }

    this.serviceEvents.emit({type: 'rejected', file: file, reason: 'ExtensionNotAllowed'});

    return false;
  }

  private checkMaxUploads(file: UploadFile): boolean {
    if (this.files.length < this.options.maxUploads) {
      return true;
    }
    this.serviceEvents.emit({type: 'rejected', file: file, reason: 'MaxUploadsExceeded'});
    return false;
  }

  private checkMaxSize(file: UploadFile): boolean {
    if (!this.options.maxSize || file.size < this.options.maxSize) {
      return true;
    }
    this.serviceEvents.emit({type: 'rejected', file: file, reason: 'MaxSizeExceeded'});
    return false;
  }

  initInputEvents(input: EventEmitter<UploadInput>, imageType: string): Subscription {
    const subscription: Subscription = input.subscribe((event: UploadInput) => {
      switch (event.type) {
        case 'uploadFile':
          this.serviceEvents.emit({ type: 'start', file: event.file, imageType: imageType });
          let newLenght: number = this.uploads.push({ file: event.file, sub: null });
          const sub = this.uploadFile(event.file, event).subscribe(data => {
            data.imageType = imageType;
            this.serviceEvents.emit(data);
          });
          this.uploads[newLenght - 1].sub = sub;
          break;
        case 'uploadAll':
          let concurrency = event.concurrency > 0 ? event.concurrency : Number.POSITIVE_INFINITY;

          const subscriber = Subscriber.create((data: UploadOutput) => {
            data.imageType = imageType;
            this.serviceEvents.emit(data);
          });

          this.uploads = this.uploads.concat(this.files.map(file => {
            return { file: file, sub: null };
          }));

          const subscription = Observable.from(this.files
            .filter(file => file.progress.status !== UploadStatus.Done)
            .map(file => this.uploadFile(file, event)))
            .mergeAll(concurrency)
            .combineLatest(data => data)
            .subscribe(subscriber);
          break;
        case 'cancel':
          const id = event.id || null;
          if (!id) {
            return;
          }

          const index = this.uploads.findIndex(upload => upload.file.id === id);
          if (index !== -1) {
            if (this.uploads[index].sub) {
              this.uploads[index].sub.unsubscribe();
            }

            this.serviceEvents.emit({ type: 'cancelled', file: this.uploads[index].file, imageType: imageType });
            this.uploads[index].file.progress.status = UploadStatus.Canceled;
          }
          break;
        case 'cancelAll':
          this.uploads.forEach(upload => {
            upload.file.progress.status = UploadStatus.Canceled;
            this.serviceEvents.emit({ type: 'cancelled', file: upload.file, imageType: imageType });
          });
          break;
        case 'remove':
          const removeId = event.id || null;
          if (!removeId) {
            return;
          }
          const removeIndex = this.files.findIndex(file => file.id === removeId);
          if (removeIndex !== -1) {
            const deleted = this.files.splice(removeIndex, 1)[0];
            this.serviceEvents.emit({ type: 'removed', file: deleted, imageType: imageType });
          }
          break;
        case 'updateOrder':
          const files = event.files || null;
          if (!files) {
            return;
          }
          this.files = files.map((file: UploadFile, i: number) => {
            file.fileIndex = i;
            return file;
          });
          this.serviceEvents.emit({ type: 'orderUpdated', files: this.files, imageType: imageType });
          break;
        case 'initialImages':
          this.files = event.files;
          break;
      }
    });
    this.serviceEvents.emit({ type: 'ready', imageType: imageType });
    return subscription;
  }

  uploadFile(file: UploadFile, event: UploadInput): Observable<UploadOutput> {
    return new Observable(observer => {
      const url = event.url;
      const method = event.method || 'POST';
      const data = event.data || {};
      const headers = event.headers || {};

      const reader = new FileReader();
      const xhr = new XMLHttpRequest();
      let time: number = new Date().getTime();
      let load = 0;

      xhr.upload.addEventListener('progress', (e: ProgressEvent) => {
        if (e.lengthComputable) {
          const percentage = Math.round((e.loaded * 100) / e.total);
          const diff = new Date().getTime() - time;
          time += diff;
          load = e.loaded - load;
          const speed = parseInt((load / diff * 1000) as any, 10);

          file.progress = {
            status: UploadStatus.Uploading,
            data: {
              percentage: percentage,
              speed: speed,
              speedHuman: `${humanizeBytes(speed)}/s`
            }
          };

          observer.next({ type: 'uploading', file: file });
        }
      }, false);

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
              responseStatus: xhr.status
            }
          };

          try {
            file.response = JSON.parse(xhr.response);
          } catch (e) {
            file.response = xhr.response;
          }

          observer.next({ type: 'done', file: file });
          observer.complete();
        }
      };

      xhr.open(method, url, true);

      const form = new FormData();
      try {
        const uploadFile = file.file;
        const uploadIndex = this.uploads.findIndex(upload => upload && upload.file.size === uploadFile.size);
        if (this.uploads[uploadIndex] && this.uploads[uploadIndex].file.progress.status === UploadStatus.Canceled) {
          observer.complete();
        }
        form.append( event.fieldName || 'file', uploadFile, uploadFile.name);

        Object.keys(data).forEach(key => {
          let value = (key === 'order') ? file.fileIndex.toString() : data[key];
          form.append(key, value);
        });
        Object.keys(headers).forEach(key => xhr.setRequestHeader(key, headers[key]));

        this.serviceEvents.emit({ type: 'start', file: file });
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
