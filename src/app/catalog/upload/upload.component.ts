import { Component, ElementRef, ViewChild } from '@angular/core';
import { ItemService } from '../../core/item/item.service';
import { Product } from '../../core/item/item-response.interface';

@Component({
  selector: 'tsl-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.scss']
})
export class UploadComponent {

  public categoryId: string;
  public urgentPrice: string = null;
  @ViewChild('scrollPanel') scrollPanel: ElementRef;

  constructor(private itemService: ItemService) {
  }

  public setCategory(categoryId: number) {
    this.categoryId = categoryId.toString();
    if (categoryId !== -1) {
      this.getUrgentPrice(categoryId);
    }
  }

  public onValidationError() {
    this.scrollPanel.nativeElement.scrollTop = 0;
  }

  public getUrgentPrice(categoryId: number): void {
    this.itemService.getUrgentProductByCategoryId(categoryId).subscribe((product: Product) => {
      this.urgentPrice =  product.durations[0].market_code;
    });
  }

}
