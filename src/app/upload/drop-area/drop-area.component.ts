import {
  Component,
  EventEmitter,
  forwardRef,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { throttle, range } from 'lodash-es';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { RemoveConfirmModalComponent } from './remove-confirm-modal/remove-confirm-modal.component';
import { ErrorsService } from '../../core/errors/errors.service';
import { Item } from '../../core/item/item';
import {
  NgUploaderOptions,
  OutputType,
  UploadFile,
  UploadOutput,
} from '../../shared/uploader/upload.interface';
import { UploaderService } from 'app/shared/uploader/uploader.service';
import { FileDropActions } from 'app/shared/uploader/file-drop.directive';
import { Subscription } from 'rxjs';

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
export class DropAreaComponent
  implements OnInit, ControlValueAccessor, OnDestroy {
  @Output() onError: EventEmitter<any> = new EventEmitter();
  @Output() onUploadPercentageChange: EventEmitter<number> = new EventEmitter();
  @Output() onDeleteImage: EventEmitter<string> = new EventEmitter();
  @Output() onOrderImages: EventEmitter<any> = new EventEmitter();
  @Output() onAddImage: EventEmitter<any> = new EventEmitter();

  @Input() isUpdatingItem: boolean;
  @Input() maxUploads = 10;

  dragOver: boolean;
  files = [];
  placeholders: number[];
  options: NgUploaderOptions;
  item: Item;
  eventsSubscrition: Subscription;

  private setDragOver = throttle((dragOver: boolean) => {
    this.dragOver = dragOver;
  }, 100);

  propagateChange = (_: any) => {};

  constructor(
    private errorsService: ErrorsService,
    private modalService: NgbModal,
    private uploaderService: UploaderService
  ) {}

  ngOnInit() {
    this.options = {
      allowedExtensions: ['jpg', 'jpeg'],
      maxUploads: this.maxUploads,
      maxSize: 10 * 1024 * 1024, // 10 MB
    };
    this.placeholders = range(this.maxUploads);
    this.subscribeEvents();
  }

  private subscribeEvents(): void {
    this.eventsSubscrition = this.uploaderService.serviceEvents.subscribe(
      (event: UploadOutput) => {
        this.onUploadOutput(event);
      }
    );
  }

  public writeValue(value: any) {
    this.files = value;
  }

  public registerOnChange(fn) {
    this.propagateChange = fn;
  }

  public registerOnTouched() {}

  public onUploadOutput(output: UploadOutput): void {
    switch (output?.type) {
      case OutputType.addedToQueue:
        this.files.push(output.file);
        this.propagateChange(this.files);
        this.onAddImage.emit(output.file);
        break;
      case OutputType.rejected:
        this.errorsService.i18nError(output.reason, output.file.name);
    }
  }

  public onFileDropAction(event: {
    action: FileDropActions;
    files?: FileList;
  }) {
    this.setDragOver(event.action === FileDropActions.DRAGOVER);
    if (event.files) {
      this.uploaderService.handleFiles(event.files, null, this.files);
    }
  }

  public remove(file: UploadFile, event: Event) {
    event.stopPropagation();
    event.preventDefault();
    if (this.isUpdatingItem) {
      this.removeConfirmation(file);
    } else {
      this.files = this.files.filter((_file: UploadFile) => _file !== file);
      this.propagateChange(this.files);
    }
  }

  private removeConfirmation(file: UploadFile) {
    this.modalService.open(RemoveConfirmModalComponent).result.then(() => {
      const fileId = file.response.id || file.response;
      this.onDeleteImage.emit(fileId);
    });
  }

  public updateOrder(): void {
    if (this.isUpdatingItem) {
      this.onOrderImages.emit();
    }
  }

  ngOnDestroy() {
    if (this.eventsSubscrition) {
      this.eventsSubscrition.unsubscribe();
    }
  }
}
