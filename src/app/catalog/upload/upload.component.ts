import { Component, ElementRef, ViewChild } from '@angular/core';
import { ItemService } from '../../core/item/item.service';
import { Product } from '../../core/item/item-response.interface';
import { NgxPermissionsService } from 'ngx-permissions';

@Component({
  selector: 'tsl-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.scss']
})
export class UploadComponent {

  public categoryId: string;
  public urgentPrice: string = null;
  @ViewChild('scrollPanel') scrollPanel: ElementRef;

  constructor(private itemService: ItemService, private permissionsService: NgxPermissionsService) {
    if (permissionsService.getPermission('isProfessional')) {
      this.setCategory('100');
    }
  }

  public setCategory(categoryId: string) {
    this.categoryId = categoryId;
    if (categoryId !== '-1') {
      this.getUrgentPrice(categoryId);
    }
  }

  public onValidationError() {
    this.scrollPanel.nativeElement.scrollTop = 0;
  }

  public getUrgentPrice(categoryId: string): void {
    this.itemService.getUrgentProductByCategoryId(categoryId).subscribe((product: Product) => {
      this.urgentPrice = product.durations[0].market_code;
    });
  }

}
