import { Component, EventEmitter, HostListener, Input, Output } from '@angular/core';

@Component({
  selector: 'tsl-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss']
})
export class ButtonComponent {

  @Input() className = 'btn-primary';
  @Input() type = 'button';
  @Input() disabled: boolean;
  @Input() loading: boolean;
  @Input() debounceTime = 500;
  @Output() debounceClick = new EventEmitter();

  private alreadyClicked = false;

  constructor() { }

  @HostListener('click', ['$event'])
  clickEvent(event) {
    if (this.alreadyClicked) {
      event.preventDefault();
      event.stopPropagation();
    } else {
      this.alreadyClicked = true;
      setTimeout( () => this.alreadyClicked = false, 500);
    }

  }

}
