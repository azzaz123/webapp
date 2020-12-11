import {
  Directive,
  ElementRef,
  EventEmitter,
  Inject,
  Input,
  OnDestroy,
  OnInit,
  Output,
  PLATFORM_ID,
} from '@angular/core';
import { NgUploaderOptions, UploadOutput } from './upload.interface';
import { isPlatformServer } from '@angular/common';
import { UploaderService } from './uploader.service';
import { Subscription } from 'rxjs';

@Directive({
  selector: '[tslFileSelect]',
})
export class FileSelectDirective implements OnInit, OnDestroy {
  @Output() uploadOutput: EventEmitter<UploadOutput>;
  @Input() options: NgUploaderOptions;
  @Input() imageType: string;

  isServer: boolean = isPlatformServer(this.platform_id);
  el: HTMLInputElement;
  eventsSubscription: Subscription;

  constructor(
    @Inject(PLATFORM_ID) private platform_id,
    private elementRef: ElementRef,
    private upload: UploaderService
  ) {
    this.uploadOutput = new EventEmitter<UploadOutput>();
  }

  ngOnInit() {
    if (this.isServer) {
      return;
    }

    this.el = this.elementRef.nativeElement;
    this.el.addEventListener('change', this.fileListener, false);

    this.upload.options = this.options;

    this.eventsSubscription = this.upload.serviceEvents.subscribe(
      (event: UploadOutput) => {
        if (event.imageType === this.imageType) {
          this.uploadOutput.emit(event);
        }
      }
    );
  }

  ngOnDestroy() {
    if (this.isServer) {
      return;
    }

    if (this.eventsSubscription) {
      this.eventsSubscription.unsubscribe();
    }

    this.el.removeEventListener('change', this.fileListener, false);
  }

  fileListener = () => {
    this.upload.handleFiles(this.el.files, this.imageType);
  };
}
