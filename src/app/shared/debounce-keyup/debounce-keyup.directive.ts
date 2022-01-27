import { Directive, Output, EventEmitter, Input, HostListener } from '@angular/core';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

@Directive({
  selector: '[debounce-keyup]',
})
export class DebounceKeyupDirective {
  @Output() debouncedKeyup = new EventEmitter();
  @Input() debouncedKeyupTime: number = 500;

  private keyupSubject: Subject<KeyboardEvent> = new Subject<KeyboardEvent>();

  constructor() {
    this.keyupSubject.pipe(debounceTime(this.debouncedKeyupTime)).subscribe((e: KeyboardEvent) => {
      this.debouncedKeyup.emit(e);
    });
  }

  @HostListener('keyup', ['$event']) onKeyUp(e: KeyboardEvent) {
    this.keyupSubject.next(e);
  }
}
