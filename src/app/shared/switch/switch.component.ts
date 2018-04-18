import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';

@Component({
  selector: 'tsl-switch',
  templateUrl: './switch.component.html',
  styleUrls: ['./switch.component.scss']
})
export class SwitchComponent implements OnInit {

  @Input() checked = false;
  @Input() disabled = false;
  @Output() onChange: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor() { }

  ngOnInit() {
  }

  switchOnChange($event) {
    this.onChange.emit($event.target.checked);
  }

}
