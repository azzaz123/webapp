import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';

@Component({
  selector: 'tsl-urgent-checkbox',
  templateUrl: './urgent-checkbox.component.html',
  styleUrls: ['./urgent-checkbox.component.scss']
})
export class UrgentCheckboxComponent implements OnInit {

  public isUrgent: boolean = false;
  @Output() public urgentSelected = new EventEmitter<boolean>();
  @Input() categoryId: string;

  constructor() { }

  ngOnInit() {
  }

  public selectUrgent(): void {
    this.isUrgent = !this.isUrgent;
    this.urgentSelected.emit(this.isUrgent);
  }

  /*get urgentPrice(): void {
    this.itemService.getUrgentProducts(itemId).subscribe((product: Product) => {
      return product.durations[0].market_code
    });
  }*/

}
