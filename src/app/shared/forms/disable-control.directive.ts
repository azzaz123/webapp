import { FormControl, NgControl } from '@angular/forms';
import { AfterViewInit, Directive, Input } from '@angular/core';

@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: '[disableControl]',
})
export class DisableControlDirective implements AfterViewInit {
  private action: 'disable' | 'enable';

  @Input() set disableControl(condition: boolean) {
    this.action = condition ? 'disable' : 'enable';

    if (this.ngControl.control) {
      this.launchAction();
    }
  }

  constructor(private ngControl: NgControl) {}

  ngAfterViewInit() {
    this.launchAction();
  }

  private launchAction(): void {
    this.ngControl.control[this.action]({ emitEvent: false });
  }
}
