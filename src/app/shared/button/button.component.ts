import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'tsl-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss']
})
export class ButtonComponent implements OnInit {

  @Input() className: string;
  @Input() type = 'button';
  @Input() disabled: boolean;
  @Input() loading: boolean;

  constructor() { }

  ngOnInit() {
  }

}
