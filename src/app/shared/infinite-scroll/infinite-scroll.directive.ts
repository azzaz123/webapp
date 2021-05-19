import { Directive, ElementRef, EventEmitter, HostListener, Input, Output } from '@angular/core';

export const DEFAULT_INFINITE_SCROLL_DISTANCE = 300;

@Directive({
  selector: '[tslInfiniteScroll]',
})
export class InfiniteScrollDirective {
  @Input() infiniteScrollDisabled = true;
  @Input() infiniteScrollDistance = DEFAULT_INFINITE_SCROLL_DISTANCE;
  @Output() scrolled = new EventEmitter();

  constructor(private elementRef: ElementRef) {}

  @HostListener('window:scroll', ['$event'])
  onWindowScroll() {
    if (this.infiniteScrollDisabled) {
      return;
    }
    if (this.elementRef.nativeElement.getBoundingClientRect().bottom - (window.innerHeight + this.infiniteScrollDistance) <= 0) {
      this.scrolled.emit();
    }
  }
}
