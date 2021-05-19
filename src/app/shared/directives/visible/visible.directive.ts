import { Directive, ElementRef, EventEmitter, OnInit, Output } from '@angular/core';

@Directive({
  selector: '[tslVisible]',
})
export class VisibleDirective implements OnInit {
  @Output() public visible: EventEmitter<void> = new EventEmitter<void>();

  constructor(private elementRef: ElementRef) {}

  ngOnInit() {
    this.attachIntersectionObserver();
  }

  private attachIntersectionObserver(): void {
    if (!IntersectionObserver) {
      this.emitVisible();
      return;
    }

    const intersectionObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          this.emitVisible();
          observer.unobserve(entry.target);
        }
      });
    });
    intersectionObserver.observe(this.elementRef.nativeElement);
  }

  private emitVisible(): void {
    this.visible.emit();
  }
}
