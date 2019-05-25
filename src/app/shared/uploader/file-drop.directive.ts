import {
  Directive, ElementRef, EventEmitter, HostListener, Inject, Input, OnDestroy, OnInit, Output,
  PLATFORM_ID
} from '@angular/core';
import { isPlatformServer } from '@angular/common';
import { NgUploaderOptions, UploadInput, UploadOutput } from './upload.interface';
import { Subscription } from 'rxjs/Rx';
import { DomSanitizer } from '@angular/platform-browser';
import { UploaderService } from './uploader.service';

@Directive({
  selector: '[tslFileDrop]'
})
export class FileDropDirective implements OnInit, OnDestroy {

  @Input() uploadInput: EventEmitter<UploadInput>;
  @Input() options: NgUploaderOptions;
  @Input() imageType: string;
  @Output() uploadOutput: EventEmitter<UploadOutput>;

  isServer: boolean = isPlatformServer(this.platform_id);
  el: HTMLInputElement;
  isSafari: boolean;
  isFirefox: boolean;
  isChrome: boolean;
  subscription: Subscription;

  constructor(@Inject(PLATFORM_ID) private platform_id, private elementRef: ElementRef, private sanitizer: DomSanitizer, private upload: UploaderService) {
    this.uploadOutput = new EventEmitter<UploadOutput>();
    this.isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
    this.isFirefox = navigator.userAgent.toLowerCase().indexOf('firefox') > -1;
    this.isChrome = navigator.userAgent.toLowerCase().indexOf('chrome') > -1;
  }

  ngOnInit() {
    if (this.isServer) {
      return;
    }

    this.el = this.elementRef.nativeElement;

    this.upload.options = this.options;

    this.upload.serviceEvents.subscribe((event: UploadOutput) => {
      this.uploadOutput.emit(event);
    });

    if (this.uploadInput instanceof EventEmitter) {
      this.subscription = this.upload.initInputEvents(this.uploadInput, this.imageType);
    }

    this.el.addEventListener('drop', this.stopEvent, false);
    this.el.addEventListener('dragenter', this.stopEvent, false);
    this.el.addEventListener('dragover', this.stopEvent, false);
  }

  ngOnDestroy() {
    if (this.isServer) {
      return;
    }
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
    this.upload.files = [];
    this.upload.uploads = [];
  }

  stopEvent = (e: Event) => {
    e.stopPropagation();
    e.preventDefault();
  }

  @HostListener('drop', ['$event'])
  public onDrop(e: any) {
    e.stopPropagation();
    e.preventDefault();

    const event: UploadOutput = { type: 'drop' };
    this.uploadOutput.emit(event);
    this.upload.handleFiles(e.dataTransfer.files);
  }

  @HostListener('dragover', ['$event'])
  public onDragOver(e: any) {
    if (!e) {
      return;
    }
    if ((e.dataTransfer.effectAllowed === 'all' || e.dataTransfer.effectAllowed === 'uninitialized') && !this.isSafari) {
      const event: UploadOutput = { type: 'dragOver' };
      this.uploadOutput.emit(event);
    }
  }

  @HostListener('dragleave', ['$event'])
  public onDragLeave(e: Event) {
    if (!e) {
      return;
    }

    const event: UploadOutput = { type: 'dragOut' };
    this.uploadOutput.emit(event);
  }

}
