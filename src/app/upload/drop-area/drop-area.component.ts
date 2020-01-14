import { Component, EventEmitter, forwardRef, Input, OnInit, Output } from '@angular/core';
import { throttle, range, every } from 'lodash-es';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { UploadEvent, UploadedEvent } from '../upload-event.interface';
import { UploadService } from './upload.service';
import { ItemService } from '../../core/item/item.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { RemoveConfirmModalComponent } from './remove-confirm-modal/remove-confirm-modal.component';
import { ErrorsService } from '../../core/errors/errors.service';
import { Image } from '../../core/user/user-response.interface';
import { Item } from '../../core/item/item';
import { NgUploaderOptions, UploadFile, UploadOutput, UploadStatus } from '../../shared/uploader/upload.interface';

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
  @Output() onUploaded: EventEmitter<UploadedEvent> = new EventEmitter();
  @Output() onError: EventEmitter<any> = new EventEmitter();
  @Input() maxUploads = 10;
  @Input() images: Image[];
  @Input() itemId: string;
  @Input() type: string;
  dragOver: boolean;
  files = [];
  placeholders: number[];
  options: NgUploaderOptions;
  item: Item;

  private setDragOver = throttle((dragOver: boolean) => {
    this.dragOver = dragOver;
  }, 100);

  propagateChange = (_: any) => {
  }

  constructor(private errorsService: ErrorsService,
              public uploadService: UploadService,
              private itemService: ItemService,
              private modalService: NgbModal) {
  }

  ngOnInit() {
    this.options = {
      allowedExtensions: ['jpg', 'jpeg'],
      maxUploads: this.maxUploads,
      maxSize: 10485760 // 10 MB
    };
    this.placeholders = range(this.maxUploads);
    this.uploadEvent.subscribe((event: UploadEvent) => {
      delete event.values.images;
      if (event.type === 'create') {
        this.uploadService.createItemWithFirstImage(event.values, this.files[0], this.type);
      } else if (event.type === 'update') {
        this.updateItem(event.values);
      }
    });
  }

  private updateItem(values: any) {
    this.itemService.update(values, this.type).subscribe((response: any) => {
      this.onUploaded.emit({action: 'updated', response: response});
    }, (response) => {
      this.onError.emit(response);
      this.errorsService.i18nError('serverError', response.message ? response.message : '');
    });
  }

  private convertImagesToFiles() {
    this.files = this.images.map((image: Image, index: number) => {
      return {
        fileIndex: index,
        preview: image.urls_by_size.medium,
        file: {
          lastModifiedDate: '',
          name: '',
          webkitRelativePath: '',
          size: 1,
          type: 'jpg',
          msClose() {
          },
          msDetachStream() {
          },
          slice() {
            return new Blob();
          }
        },
        id: image.id,
        lastModifiedDate: new Date(),
        name: '',
        size: 1,
        type: 'jpg',
        progress: {
          status: UploadStatus.Done,
          data: {
            percentage: 100,
            speed: null,
            speedHuman: null
          }
        },
        response: image
      };
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
      case 'ready':
        if (this.images) {
          this.convertImagesToFiles();
          this.uploadService.setInitialImages(this.files);
          setTimeout(() => {
            this.propagateChange(this.files);
          });
        }
        break;
      case 'addedToQueue':
        if (this.images) {
          this.files.push(output.file);
          this.uploadService.uploadSingleImage(output.file, this.itemId, this.type);
        } else {
          this.pictureUploaded(output);
        }
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
          this.item = output.file.response;
          if (this.files.length > 1) {
            this.uploadService.uploadOtherImages(output.file.response.id, this.type);
          } else {
            if (this.item.hasOwnProperty('flags') && this.item.flags['onhold']) {
              this.onUploaded.emit({action: 'createdOnHold', response: output.file.response});
            } else {
              this.onUploaded.emit({action: 'created', response: output.file.response});
            }
          }
        } else {
          if (!this.images && every(this.files, (file: UploadFile) => {
              return file.progress.status === UploadStatus.Done;
            })) {
            if (this.item.hasOwnProperty('flags') && this.item.flags['onhold']) {
              this.onUploaded.emit({action: 'createdOnHold', response: this.item});
            } else {
              this.onUploaded.emit({action: this.images ? 'updated' : 'created', response: this.item});
            }
          } else {
            this.pictureUploadedOnUpdate(output);
          }
        }
      } else {
        this.errorsService.i18nError('serverError', output.file.response.message ? output.file.response.message : '');
        this.onError.emit();
      }
    } else {
      this.errorsService.i18nError('serverError');
      this.onError.emit();
    }
  }

  private pictureUploadedOnUpdate(output: UploadOutput) {
    this.pictureUploaded(output);
    this.errorsService.i18nSuccess('imageUploaded');
  }

  private pictureUploaded(output: UploadOutput) {
    const index = this.files.findIndex(file => file.id === output.file.id);
    if (index !== -1) {
      this.files[index] = output.file;
    } else {
      this.files.push(output.file);
    }
    this.propagateChange(this.files);
  }

  public remove(file: UploadFile, event: Event) {
    event.stopPropagation();
    event.preventDefault();
    if (this.images) {
      this.removeConfirmation(file);
    } else {
      this.uploadService.removeImage(file);
    }
  }

  private removeConfirmation(file: UploadFile) {
    this.modalService.open(RemoveConfirmModalComponent).result.then(() => {
      const fileId = file.response.id || file.response;
      this.itemService.deletePicture(this.itemId, fileId).subscribe(() => {
        this.uploadService.removeImage(file);
      });
    }, () => {
    });
  }

  public updateOrder() {
    this.uploadService.updateOrder(this.files);
    if (this.images) {
      const picturesOrder = {};
      this.files.forEach((file, index) => {
        picturesOrder[file.response.id || file.response] = index;
      });
      this.itemService.updatePicturesOrder(this.itemId, picturesOrder).subscribe();
    }
  }

}
