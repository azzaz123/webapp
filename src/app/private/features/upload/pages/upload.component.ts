import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CARS_CATEGORY } from '@core/item/item-categories';
import { Product } from '@core/item/item-response.interface';
import { ItemService } from '@core/item/item.service';
import { SessionProfileDataLocation } from '@core/trust-and-safety/trust-and-safety.interface';
import { TrustAndSafetyService } from '@core/trust-and-safety/trust-and-safety.service';
import { UserService } from '@core/user/user.service';

@Component({
  selector: 'tsl-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.scss'],
})
export class UploadComponent implements OnInit {
  @ViewChild('scrollPanel', { static: true }) scrollPanel: ElementRef;

  public categoryId: string;
  public urgentPrice: string = null;

  constructor(private itemService: ItemService, private userService: UserService, private trustAndSafetyService: TrustAndSafetyService) {}

  ngOnInit() {
    this.userService.isProfessional().subscribe((isProfessional: boolean) => {
      if (isProfessional) {
        this.setCategory(CARS_CATEGORY);
      }
    });

    this.trustAndSafetyService.submitProfile(SessionProfileDataLocation.OPEN_CREATE_LISTING);
  }

  public setCategory(categoryId: string) {
    this.categoryId = categoryId;
    if (categoryId !== '-1') {
      this.getUrgentPrice(categoryId);
    } else {
      this.urgentPrice = null;
    }
  }

  public validationError() {
    this.scrollPanel.nativeElement.scrollTop = 0;
  }

  public getUrgentPrice(categoryId: string): void {
    if (categoryId !== '-1') {
      this.itemService.getUrgentProductByCategoryId(categoryId).subscribe((product: Product) => {
        this.urgentPrice = product.durations[0].market_code;
      });
    } else {
      this.urgentPrice = null;
    }
  }
}
