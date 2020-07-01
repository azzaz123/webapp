import { Component, ElementRef, ViewChild, OnInit } from '@angular/core';
import { ItemService } from '../core/item/item.service';
import { Product } from '../core/item/item-response.interface';
import { UserService } from '../core/user/user.service';
import { CARS_CATEGORY } from '../core/item/item-categories';
import { TrustAndSafetyService } from 'app/core/trust-and-safety/trust-and-safety.service';
import { SessionProfileDataLocation } from 'app/core/trust-and-safety/trust-and-safety.interface';

@Component({
  selector: 'tsl-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.scss']
})
export class UploadComponent implements OnInit {

  public categoryId: string;
  public urgentPrice: string = null;
  @ViewChild('scrollPanel', { static: true }) scrollPanel: ElementRef;

  constructor(private itemService: ItemService, private userService: UserService, private trustAndSafetyService: TrustAndSafetyService) {
  }

  ngOnInit() {
    this.userService.isProfessional().subscribe((isProfessional: boolean) => {
      if (isProfessional) {
        this.setCategory(CARS_CATEGORY);
      }
    });

    this._submitProfileIfNeeded();
  }

  private _submitProfileIfNeeded() {
    this.trustAndSafetyService.isStarterUser().subscribe(isStarter => {
      if (isStarter) {
        this.trustAndSafetyService.submitProfile('OpenCreateListing');
      }
    });
  }

  public setCategory(categoryId: string) {
    this.categoryId = categoryId;
    if (categoryId !== '-1') {
      this.getUrgentPrice(categoryId);
    } else {
      this.urgentPrice = null
    }
  }

  public onValidationError() {
    this.scrollPanel.nativeElement.scrollTop = 0;
  }

  public getUrgentPrice(categoryId: string): void {
    if (categoryId !== '-1') {
      this.itemService.getUrgentProductByCategoryId(categoryId).subscribe((product: Product) => {
        this.urgentPrice = product.durations[0].market_code;
      });
    } else {
      this.urgentPrice = null
    }
  }

}
