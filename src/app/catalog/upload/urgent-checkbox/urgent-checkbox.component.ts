import { Component, Output, EventEmitter, Input } from '@angular/core';

@Component({
  selector: 'tsl-urgent-checkbox',
  templateUrl: './urgent-checkbox.component.html',
  styleUrls: ['./urgent-checkbox.component.scss']
})
export class UrgentCheckboxComponent {

  public isUrgent: boolean = false;
  @Output() public urgentSelected = new EventEmitter<boolean>();
  @Input() categoryId: number;
  @Input() urgentPrice: string = null;

  constructor() { }

  public selectUrgent(): void {
    this.isUrgent = !this.isUrgent;
    this.urgentSelected.emit(this.isUrgent);
  }

}
