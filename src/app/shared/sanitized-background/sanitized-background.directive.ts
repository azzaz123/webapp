import { Directive, ElementRef, Input, OnChanges, Renderer2 } from '@angular/core';

@Directive({
  selector: '[tslsanitizedBackground]'
})
export class SanitizedBackgroundDirective implements OnChanges {

  @Input('tslsanitizedBackground') image: string;
  @Input('fallback') fallback: string;

  constructor(private el: ElementRef, private renderer: Renderer2) {
  }

  ngOnChanges(changes?: any) {
    if (this.fallback) {
      this.renderer.setStyle(this.el.nativeElement, 'backgroundImage', `url(${this.image}), url('${this.fallback}')`);
    } else {
      this.renderer.setStyle(this.el.nativeElement, 'backgroundImage', `url(${this.image})`);
    }

  }

}
