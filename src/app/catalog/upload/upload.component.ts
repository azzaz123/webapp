import { Component, ElementRef, ViewChild, OnInit } from '@angular/core';
import { ItemService } from '../../core/item/item.service';
import { Product } from '../../core/item/item-response.interface';
import { UserService } from '../../core/user/user.service';

@Component({
  selector: 'tsl-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.scss']
})
export class UploadComponent implements OnInit {

  public categoryId: string;
  public urgentPrice: string = null;
  @ViewChild('scrollPanel') scrollPanel: ElementRef;

  constructor(private itemService: ItemService, private userService: UserService) {
  }

  ngOnInit() {
    this.userService.isProfessional().subscribe((isProfessional: boolean) => {
      if (isProfessional) {
        this.setCategory('100');
      }
    });
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
