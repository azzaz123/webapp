import {
  Directive, ElementRef, EventEmitter, Inject, Input, OnDestroy, OnInit, Output,
  PLATFORM_ID
} from '@angular/core';
import { NgUploaderOptions, UploadOutput } from './upload.interface';
import { isPlatformServer } from '@angular/common';
import { Subscription } from 'rxjs/Rx';
import { DomSanitizer } from '@angular/platform-browser';
import { UploaderService } from './uploader.service';

@Directive({
  selector: '[tslFileSelect]'
})
export class FileSelectDirective  implements OnInit, OnDestroy {

  @Input() uploadInput: EventEmitter<any>;
  @Input() uploadCoverInput: EventEmitter<any>;
  @Output() uploadOutput: EventEmitter<UploadOutput>;
  @Input() options: NgUploaderOptions;
  @Input() imageType: string;

  isServer: boolean = isPlatformServer(this.platform_id);
  el: HTMLInputElement;

  subscription: Subscription;

  constructor(@Inject(PLATFORM_ID) private platform_id, private elementRef: ElementRef, private sanitizer: DomSanitizer, private upload: UploaderService) {
    this.uploadOutput = new EventEmitter<UploadOutput>();
  }

  ngOnInit() {
    if (this.isServer) {
      return;
    }

    this.el = this.elementRef.nativeElement;
    this.el.addEventListener('change', this.fileListener, false);

    this.upload.options = this.options;

    this.upload.serviceEvents.subscribe((event: UploadOutput) => {
      if (event.imageType === this.imageType) {
        this.uploadOutput.emit(event);
      }
    });

    if (this.uploadInput instanceof EventEmitter) {
      this.subscription = this.upload.initInputEvents(this.uploadInput, this.imageType);
    }

    if (this.uploadCoverInput instanceof EventEmitter) {
      this.subscription = this.upload.initInputEvents(this.uploadCoverInput, this.imageType);
    }

  }

  ngOnDestroy() {
    if (this.isServer) {
      return;
    }

    this.el.removeEventListener('change', this.fileListener, false);
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  fileListener = () => {
    this.upload.handleFiles(this.el.files, this.imageType);
  }

}
