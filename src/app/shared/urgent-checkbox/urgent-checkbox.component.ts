import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'tsl-urgent-checkbox',
  templateUrl: './urgent-checkbox.component.html',
  styleUrls: ['./urgent-checkbox.component.scss']
})
export class UrgentCheckboxComponent implements OnInit {

  public isUrgent: boolean = false;
  @Output() public urgentSelected = new EventEmitter<boolean>();

  constructor() { }

  ngOnInit() {
  }

  public selectUrgent(): void {
    this.isUrgent = !this.isUrgent;
    this.urgentSelected.emit(this.isUrgent);
  }

}
