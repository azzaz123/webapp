import { Component, OnInit } from '@angular/core';
import { DeviceService } from '@core/device/device.service';
import { DeviceType } from '@core/device/deviceType.enum';
import { Coordinate } from '@core/geolocation/address-response.interface';
import { Item } from '@core/item/item';
import { ItemFlags } from '@core/item/item-response.interface';
import { User } from '@core/user/user';
import { UserService } from '@core/user/user.service';
import { MOCK_ITEM } from '@fixtures/item.fixtures.spec';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'tsl-item-detail',
  templateUrl: './item-detail.component.html',
  styleUrls: ['./item-detail.component.scss'],
})
export class ItemDetailComponent implements OnInit {
  public isApproximateLocation = false;
  public loading = false;
  public deviceType = DeviceType;
  public device: DeviceType;
  public itemFlags: ItemFlags;
  public images: string[];
  public item: Item = MOCK_ITEM;
  public coordinates: Coordinate;

  constructor(
    private deviceService: DeviceService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.device = this.deviceService.getDeviceType();
    this.handleLocation();
  }

  private handleLocation(): void {
    if (this.item.location) {
      this.setLocation({
        latitude: this.item.location.approximated_latitude,
        longitude: this.item.location.approximated_longitude,
      });
      this.approximatedLocation = this.item.location.approximated_location;
    } else {
      this.loading = true;
      this.userService
        .me()
        .pipe(finalize(() => (this.loading = false)))
        .subscribe((user: User) => {
          this.setLocation({
            latitude: user.location.approximated_latitude,
            longitude: user.location.approximated_longitude,
          });
          this.approximatedLocation = user.location.approximated_location;
        });
    }
  }

  private setLocation(coordinates: Coordinate): void {
    this.coordinates = coordinates;
  }

  set approximatedLocation(isApproximated: boolean) {
    this.isApproximateLocation = isApproximated;
  }
}
