import { Component, Input, OnChanges } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CarKeysService } from '../upload-car/car-keys.service';
import { CarUploadForm, ItemUploadForm } from '../../../core/item/item-response.interface';

@Component({
  selector: 'tsl-preview-modal',
  templateUrl: './preview-modal.component.html',
  styleUrls: ['./preview-modal.component.scss']
})
export class PreviewModalComponent {

  public itemPreview: CarUploadForm;
  public bodyType: string;

  get hasCarExtras() {
    return this.itemPreview.gearbox ||
      this.itemPreview.body_type ||
      this.itemPreview.num_seats ||
      this.itemPreview.engine;
  }

  get hasExtras() {
    return this.itemPreview.sale_conditions.fix_price ||
      this.itemPreview.sale_conditions.shipping_allowed ||
      this.itemPreview.sale_conditions.exchange_allowed;
  }

  constructor(public activeModal: NgbActiveModal,
              private carKeysService: CarKeysService) {
  }

  public getBodyType() {
    if (this.itemPreview.body_type) {
      this.carKeysService.getTypeName(this.itemPreview.body_type).subscribe((bodyType: string) => {
        this.bodyType = bodyType;
      });
    }
  }

}
