import { Component, OnInit } from '@angular/core';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'tsl-too-many-items-modal',
  templateUrl: './too-many-items-modal.component.html',
  styleUrls: ['./too-many-items-modal.component.scss']
})
export class TooManyItemsModalComponent implements OnInit {

  public isNormal = true;
  public isMotorPlan = false;
  public isCarDealer = false;
  public isWebSubscription = false;

  public categoryName: string;
  public categoryIconName: string;

  constructor(public activeModal: NgbActiveModal) { }

  ngOnInit() {
  }

  public setType(type: string) {
    switch (type) {

      // Normal
      case '1':
        this.isNormal = true;
        this.isMotorPlan = false;
        this.isCarDealer = false;
        this.isWebSubscription = false;
      break;

      // Motor plan
      case '2':
        this.isNormal = false;
        this.isMotorPlan = true;
        this.isCarDealer = false;
        this.isWebSubscription = false;
      break;

      // Car dealer
      case '3':
        this.isNormal = false;
        this.isMotorPlan = false;
        this.isCarDealer = true;
        this.isWebSubscription = false;
      break;

      // Web subscriptions
      case '4':
        this.isNormal = false;
        this.isMotorPlan = false;
        this.isCarDealer = false;
        this.isWebSubscription = true;
      break;

      default:
          this.isNormal = true;
          this.isMotorPlan = false;
          this.isCarDealer = false;
          this.isWebSubscription = false;
      break;
    }
  }

}
