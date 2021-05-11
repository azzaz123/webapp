import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'tsl-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss'],
})
export class ButtonComponent {
  @Input() className = 'btn-primary';
  @Input() classLoading = 'white';
  @Input() type = 'button';
  @Input() disabled: boolean;
  @Input() loading: boolean;
  @Output() clickButton: EventEmitter<void> = new EventEmitter();

  constructor() {}

  public onClickButton(): void {
    if (!this.disabled) {
      this.clickButton.emit();
    }
  }
}
