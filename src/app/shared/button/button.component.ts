import { Component, Input, HostListener } from '@angular/core';

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

  constructor() { }

  @HostListener('click', ['$event'])
  clickEvent(event) {
    event.srcElement.setAttribute('disabled', true);
    setTimeout(function(){ 
      event.srcElement.removeAttribute('disabled');
    }, 1000);
  }

}
