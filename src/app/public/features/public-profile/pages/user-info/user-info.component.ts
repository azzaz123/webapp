import { Component, OnInit } from '@angular/core';
import { Coordinate } from '@core/geolocation/address-response.interface';
import { User } from '@core/user/user';
import { PublicProfileService } from '../../core/services/public-profile.service';
@Component({
  selector: 'tsl-user-info',
  templateUrl: './user-info.component.html',
  styleUrls: ['./user-info.component.scss'],
})
export class UserInfoComponent implements OnInit {
  public coordinates: Coordinate;
  public user: User;

  constructor(private publicProfileService: PublicProfileService) {}

  ngOnInit(): void {
    this.getUser();
  }

  getUser(): void {
    this.user = this.publicProfileService.user;
    if (this.userHaveLocation())
      this.coordinates = {
        latitude: this.user.location.approximated_latitude,
        longitude: this.user.location.approximated_longitude,
      };
  }

  private userHaveLocation(): boolean {
    return !!(
      this.user.location.approximated_latitude &&
      this.user.location.approximated_longitude
    );
  }
}
