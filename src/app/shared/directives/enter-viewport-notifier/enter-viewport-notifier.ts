import { Directive, AfterViewInit, OnDestroy, Output, ElementRef, EventEmitter, Host } from '@angular/core';

@Directive({ selector: '[tslEnterTheViewportNotifier]' })
export class EnterTheViewportNotifierDirective implements AfterViewInit, OnDestroy {
  @Output() visibilityChange: EventEmitter<string> = new EventEmitter<string>();
  private _observer: IntersectionObserver;

  constructor(@Host() private _elementRef: ElementRef) {}

  ngAfterViewInit(): void {
    const options = { root: null, rootMargin: '0px', threshold: 0.0 };
    this._observer = new IntersectionObserver(this._callback, options);
    this._observer.observe(this._elementRef.nativeElement);
  }

  ngOnDestroy() {
    this._observer.disconnect();
  }

  private _callback = (entries, observer) => {
    entries.forEach((entry) => this.visibilityChange.emit(entry.isIntersecting ? 'VISIBLE' : 'HIDDEN'));
  };
}
