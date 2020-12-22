import { Component, OnInit } from '@angular/core';
import { Coordinate } from '@core/geolocation/address-response.interface';
import { SOCIAL_MEDIA_INFO } from '../../public-profile-routing-constants';

@Component({
  selector: 'tsl-user-info',
  templateUrl: './user-info.component.html',
  styleUrls: ['./user-info.component.scss'],
})
export class UserInfoComponent implements OnInit {
  public coordinates: Coordinate;
  constructor() {}

  ngOnInit(): void {}

  open(socialMedia: SOCIAL_MEDIA_INFO): void {
    if (socialMedia === SOCIAL_MEDIA_INFO.EMAIL) {
    } else if (socialMedia === SOCIAL_MEDIA_INFO.FACEBOOK) {
    }

    // It's phone handle
    return;
  }
}
