import { Component, EventEmitter, forwardRef, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { ErrorsService } from '@core/errors/errors.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FileDropActions, IFileDropAction } from '@shared/uploader/file-drop.directive';
import { NgUploaderOptions, OUTPUT_TYPE, UploadFile, UploadOutput } from '@shared/uploader/upload.interface';
import { UploaderService } from '@shared/uploader/uploader.service';
import { range, throttle } from 'lodash-es';
import { Subscription } from 'rxjs';
import { RemoveConfirmModalComponent } from '../../modals/remove-confirm-modal/remove-confirm-modal.component';

@Component({
  selector: 'tsl-drop-area',
  templateUrl: './drop-area.component.html',
  styleUrls: ['./drop-area.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DropAreaComponent),
      multi: true,
    },
  ],
})
export class DropAreaComponent implements OnInit, ControlValueAccessor, OnDestroy {
  @Output() deleteImage: EventEmitter<string> = new EventEmitter();
  @Output() orderImages: EventEmitter<void> = new EventEmitter();
  @Output() addImage: EventEmitter<UploadFile> = new EventEmitter();

  @Input() isUpdatingItem: boolean;
  @Input() maxUploads = 10;

  public dragOver: boolean;
  public files: UploadFile[] = [];
  public placeholders: number[];
  public options: NgUploaderOptions;
  public eventsSubscription: Subscription;

  private setDragOver = throttle((dragOver: boolean) => {
    this.dragOver = dragOver;
  }, 100);

  constructor(private errorsService: ErrorsService, private modalService: NgbModal, private uploaderService: UploaderService) {}

  ngOnInit() {
    this.options = {
      allowedExtensions: ['jpg', 'jpeg'],
      maxUploads: this.maxUploads,
      maxSize: 10 * 1024 * 1024, // 10 MB
    };
    this.placeholders = range(this.maxUploads);
    this.subscribeEvents();
  }

  ngOnDestroy() {
    if (this.eventsSubscription) {
      this.eventsSubscription.unsubscribe();
    }
  }
  public propagateChange = (_: any) => {};

  public writeValue(value: UploadFile[]) {
    this.files = value;
  }

  public registerOnChange(fn) {
    this.propagateChange = fn;
  }

  public registerOnTouched() {}

  public onUploadOutput(output: UploadOutput): void {
    switch (output?.type) {
      case OUTPUT_TYPE.addedToQueue:
        this.addFile(output.file);
        break;
      case OUTPUT_TYPE.rejected:
        this.errorsService.i18nError(output.reason, output.file.name);
    }
  }

  public onFileDropAction(event: IFileDropAction): void {
    this.setDragOver(event.action === FileDropActions.DRAGOVER);
    if (event.files) {
      this.onFilesAdded(event.files);
    }
  }

  public remove(file: UploadFile, event: Event): void {
    event.stopPropagation();
    event.preventDefault();
    if (this.isUpdatingItem) {
      this.removeConfirmation(file);
    } else {
      this.files = this.files.filter((_file: UploadFile) => _file !== file);
      this.propagateChange(this.files);
    }
  }

  public updateOrder(): void {
    if (this.isUpdatingItem) {
      this.orderImages.emit();
    } else {
      this.updateIndex();
    }
  }

  public onFilesAdded(event: FileList): void {
    this.uploaderService.handleFiles(event, this.options, null, this.files);
  }

  private updateIndex(): void {
    this.files.forEach((file, index) => {
      file.fileIndex = index;
    });
  }

  private subscribeEvents(): void {
    this.eventsSubscription = this.uploaderService.serviceEvents$.subscribe((event: UploadOutput) => {
      this.onUploadOutput(event);
    });
  }

  private addFile(file: UploadFile): void {
    file.fileIndex = this.files.length + 1;
    this.files.push(file);
    this.propagateChange(this.files);
    this.addImage.emit(file);
  }

  private removeConfirmation(file: UploadFile) {
    this.modalService.open(RemoveConfirmModalComponent).result.then(() => {
      const fileId = file.response.id || file.response;
      this.deleteImage.emit(fileId);
    });
  }
}
