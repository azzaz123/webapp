import { Directive, ElementRef, HostListener, Input } from '@angular/core';
@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: 'img[fallback]',
})
export class ImageFallbackDirective {
  @Input() fallback: string;

  constructor(private elementRef: ElementRef) {}

  @HostListener('error') onError() {
    const element: HTMLImageElement = <HTMLImageElement>this.elementRef.nativeElement;
    element.src = this.fallback;
  }
}
