import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CARS_CATEGORY } from '@core/item/item-categories';
import { SessionProfileDataLocation } from '@core/trust-and-safety/trust-and-safety.interface';
import { TrustAndSafetyService } from '@core/trust-and-safety/trust-and-safety.service';
import { UserService } from '@core/user/user.service';

@Component({
  selector: 'tsl-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.scss'],
})
export class UploadComponent implements OnInit {
  public categoryId: string;
  @ViewChild('scrollPanel', { static: true }) scrollPanel: ElementRef;

  constructor(private userService: UserService, private trustAndSafetyService: TrustAndSafetyService) {}

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
  }

  public onValidationError() {
    this.scrollPanel.nativeElement.scrollTop = 0;
  }
}
