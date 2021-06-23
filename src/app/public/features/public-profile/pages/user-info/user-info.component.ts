import { Component, OnDestroy, OnInit } from '@angular/core';
import { Coordinate } from '@core/geolocation/address-response.interface';
import { User } from '@core/user/user';
import { PERMISSIONS } from '@core/user/user-constants';
import { UserExtrainfo, UserValidations } from '@core/user/user-response.interface';
import { Subscription } from 'rxjs';
import { PublicProfileService } from '../../core/services/public-profile.service';
@Component({
  selector: 'tsl-user-info',
  templateUrl: './user-info.component.html',
  styleUrls: ['./user-info.component.scss'],
})
export class UserInfoComponent implements OnInit, OnDestroy {
  private subscriptions: Subscription[] = [];
  public coordinates: Coordinate;
  public user: User;
  public userValidations: UserValidations;
  public userResponseRate: string;
  public readonly PERMISSIONS = PERMISSIONS;

  constructor(private publicProfileService: PublicProfileService) {}

  ngOnInit(): void {
    this.getUser();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((x) => x.unsubscribe());
  }

  private getUser(): void {
    this.user = this.publicProfileService.user;

    this.publicProfileService.getExtraInfo(this.user.id).subscribe((userExtraInfo: UserExtrainfo) => {
      this.userValidations = userExtraInfo.validations;
      this.userResponseRate = userExtraInfo.response_rate;
    });

    if (this.userHaveLocation()) {
      this.coordinates = {
        latitude: this.user.location.approximated_latitude,
        longitude: this.user.location.approximated_longitude,
      };
    }
  }

  private userHaveLocation(): boolean {
    return !!(this.user?.location?.approximated_latitude && this.user?.location?.approximated_longitude);
  }
}
