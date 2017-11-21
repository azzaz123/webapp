import { Component, EventEmitter, forwardRef, Input, OnInit, Output } from '@angular/core';
import { NgUploaderOptions, UploadFile, UploadOutput, UploadStatus } from 'ngx-uploader';
import * as _ from 'lodash';
import { ErrorsService } from 'shield';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { UploadEvent } from '../upload-event.interface';
import { UploadService } from './upload.service';

@Component({
  selector: 'tsl-drop-area',
  templateUrl: './drop-area.component.html',
  styleUrls: ['./drop-area.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DropAreaComponent),
      multi: true
    }
  ]
})
export class DropAreaComponent implements OnInit, ControlValueAccessor {

  @Input() uploadEvent: EventEmitter<UploadEvent> = new EventEmitter();
  @Output() onUploaded: EventEmitter<string> = new EventEmitter();
  @Output() onError: EventEmitter<string> = new EventEmitter();
  @Input() maxUploads = 4;
  dragOver: boolean;
  files: UploadFile[] = [];
  placeholders: number[];
  options: NgUploaderOptions;
  private itemId: string;

  private setDragOver = _.throttle((dragOver: boolean) => {
    this.dragOver = dragOver;
  }, 100);

  propagateChange = (_: any) => {
  };

  constructor(private errorsService: ErrorsService,
              public uploadService: UploadService) {
  }

  ngOnInit() {
    this.options = {
      allowedExtensions: ['jpg', 'jpeg'],
      maxUploads: this.maxUploads,
      maxSize: 10485760 // 10 MB
    };
    this.placeholders = _.range(this.maxUploads);
    this.uploadEvent.subscribe((event: UploadEvent) => {
      if (event.type === 'create') {
        delete event.values.images;
        this.uploadService.createItemWithFirstImage(event.values, this.files[0]);
      }
    });
  }

  public writeValue(value: any) {
  }

  public registerOnChange(fn) {
    this.propagateChange = fn;
  }

  public registerOnTouched() {
  }

  public onUploadOutput(output: UploadOutput): void {
    switch (output.type) {
      case 'addedToQueue':
        this.files.push(output.file);
        this.propagateChange(this.files);
        break;
      case 'uploading':
        const index = this.files.findIndex(file => file.id === output.file.id);
        this.files[index] = output.file;
        break;
      case 'removed':
        this.files = this.files.filter((file: UploadFile) => file !== output.file);
        this.propagateChange(this.files);
        break;
      case 'dragOver':
        this.setDragOver(true);
        break;
      case 'dragOut':
      case 'drop':
        this.setDragOver(false);
        break;
      case 'done':
        this.onUploadDone(output);
        break;
      case 'rejected':
        this.errorsService.i18nError(output.reason, output.file.name);
        break;
      case 'orderUpdated':
        this.files = [...output.files];
        break;
    }
  }

  private onUploadDone(output: UploadOutput) {
    if (output.file.response) {
      if (output.file.progress.data.responseStatus === 200) {
        if (output.file.response.id) {
          this.itemId = output.file.response.id;
          if (this.files.length > 1) {
            this.uploadService.uploadOtherImages(output.file.response.id, this.maxUploads === 8 ? '/cars' : '');
          } else {
            this.onUploaded.emit(this.itemId);
          }
        } else {
          if (_.every(this.files, (file: UploadFile) => {
              return file.progress.status === UploadStatus.Done;
            })) {
            this.onUploaded.emit(this.itemId);
          }
        }
      } else {
        if (output.file.response.message) {
          this.onError.emit(output.file.response);
          this.errorsService.i18nError('serverError', output.file.response.message);
        }
      }

    }
  }

  public remove(file: UploadFile, event: Event) {
    event.stopPropagation();
    event.preventDefault();
    this.uploadService.removeImage(file);
  }

  public updateOrder() {
    this.uploadService.updateOrder(this.files);
  }

}
