import {
  Directive,
  ElementRef,
  EventEmitter,
  Inject,
  OnDestroy,
  OnInit,
  Output,
  PLATFORM_ID,
} from '@angular/core';
import { isPlatformServer } from '@angular/common';
import { UploaderService } from './uploader.service';

@Directive({
  selector: '[tslFileSelect]',
})
export class FileSelectDirective implements OnInit, OnDestroy {
  @Output() filesSelected = new EventEmitter<FileList>();

  isServer: boolean = isPlatformServer(this.platform_id);
  el: HTMLInputElement;

  constructor(
    @Inject(PLATFORM_ID) private platform_id,
    private elementRef: ElementRef
  ) {}

  ngOnInit() {
    if (this.isServer) {
      return;
    }

    this.el = this.elementRef.nativeElement;
    this.el.addEventListener('change', this.fileListener, false);
  }

  ngOnDestroy() {
    if (this.isServer) {
      return;
    }
    this.el.removeEventListener('change', this.fileListener, false);
  }

  fileListener = () => {
    this.filesSelected.emit(this.el.files);
  };
}
