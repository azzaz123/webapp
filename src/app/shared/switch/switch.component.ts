import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';

@Component({
  selector: 'tsl-switch',
  templateUrl: './switch.component.html',
  styleUrls: ['./switch.component.scss']
})
export class SwitchComponent implements OnInit {

  @Input() checked = false;
  @Input() disabled = false;
  @Output() change: EventEmitter<any> = new EventEmitter();

  constructor() { }

  ngOnInit() {
  }

  switchOnChange($event) {
    this.change.emit($event);
  }

}
