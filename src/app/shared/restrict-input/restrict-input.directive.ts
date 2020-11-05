import { Directive, ElementRef, HostListener } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[tslRestrictInput]',
})
export class RestrictInputDirective {
  constructor(private el: ElementRef, private control: NgControl) {}

  @HostListener('input', ['$event']) onInput($event) {
    if ($event.data) {
      const char = $event.data;
      const charCode = char.charCodeAt(0);
      if (charCode < 32 || charCode > 255) {
        const value = this.el.nativeElement.value;
        this.control.control.setValue(value.replace(char, ''));
      }
    }
  }

  @HostListener('paste', ['$event']) onPaste($event) {
    $event.preventDefault();
  }
}
