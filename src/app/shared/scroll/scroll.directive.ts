import { Directive, ElementRef, EventEmitter, HostListener, Input, Output } from '@angular/core';

export const DEFAULT_INFINITE_SCROLL_DISTANCE = 300;

@Directive({
  selector: '[scroll]',
})
export class ScrollDirective {
  @Output() scrolledToBottom = new EventEmitter();

  constructor(private elementRef: ElementRef) {
    this.elementRef.nativeElement.addEventListener('scroll', () => {
      const scrollHeight = this.elementRef.nativeElement.scrollHeight;
      const bottom = this.elementRef.nativeElement.clientHeight + this.elementRef.nativeElement.scrollTop;
      if (bottom === scrollHeight) {
        this.scrolledToBottom.emit();
      }
    });
  }
}
