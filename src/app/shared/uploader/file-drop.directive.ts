import { Directive, ElementRef, EventEmitter, HostListener, Inject, Input, OnDestroy, OnInit, Output, PLATFORM_ID } from '@angular/core';
import { isPlatformServer } from '@angular/common';
import { NgUploaderOptions } from './upload.interface';
import { Subscription } from 'rxjs';

export enum FileDropActions {
  DROP = 'drop',
  DRAGOUT = 'dragOut',
  DRAGOVER = 'dragOver',
}

export interface IFileDropAction {
  action: FileDropActions;
  files?: FileList;
}

@Directive({
  selector: '[tslFileDrop]',
})
export class FileDropDirective implements OnInit, OnDestroy {
  @Input() options: NgUploaderOptions;
  @Input() IMAGE_TYPE: string;
  @Output() fileDropAction = new EventEmitter<IFileDropAction>();

  isServer: boolean = isPlatformServer(this.platform_id);
  el: HTMLInputElement;
  isSafari: boolean;
  isFirefox: boolean;
  isChrome: boolean;
  subscription: Subscription;

  constructor(@Inject(PLATFORM_ID) private platform_id, private elementRef: ElementRef) {
    this.isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
    this.isFirefox = navigator.userAgent.toLowerCase().indexOf('firefox') > -1;
    this.isChrome = navigator.userAgent.toLowerCase().indexOf('chrome') > -1;
  }
  @HostListener('drop', ['$event'])
  public onDrop(e: any) {
    e.stopPropagation();
    e.preventDefault();
    this.fileDropAction.emit({
      action: FileDropActions.DROP,
      files: e.dataTransfer.files,
    });
  }

  @HostListener('dragover', ['$event'])
  public onDragOver(e: any) {
    if (!e) {
      return;
    }
    if ((e.dataTransfer.effectAllowed === 'all' || e.dataTransfer.effectAllowed === 'uninitialized') && !this.isSafari) {
      this.fileDropAction.emit({ action: FileDropActions.DRAGOVER });
    }
  }

  @HostListener('dragleave', ['$event'])
  public onDragLeave(e: Event) {
    if (!e) {
      return;
    }
    this.fileDropAction.emit({ action: FileDropActions.DRAGOUT });
  }

  ngOnInit() {
    if (this.isServer) {
      return;
    }

    this.el = this.elementRef.nativeElement;
    this.el.addEventListener('drop', this.stopEvent, false);
    this.el.addEventListener('dragenter', this.stopEvent, false);
    this.el.addEventListener('dragover', this.stopEvent, false);
  }

  ngOnDestroy() {
    if (this.isServer) {
      return;
    }
  }

  stopEvent = (e: Event) => {
    e.stopPropagation();
    e.preventDefault();
  };
}
