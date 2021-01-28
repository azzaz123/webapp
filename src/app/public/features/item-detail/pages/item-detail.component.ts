import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ItemDetailLocation } from './constants/item-detail.interface';
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
  changeDetection: ChangeDetectionStrategy.OnPush,
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
  public itemLocation: ItemDetailLocation;

  constructor(
    private deviceService: DeviceService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.device = this.deviceService.getDeviceType();
    this.handleCoordinates();
  }

  private handleCoordinates(): void {
    if (this.item.location) {
      this.setLocation({
        zip: this.item.location.zip,
        city: this.item.location.city,
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
            zip: user.location.zip,
            city: user.location.city,
            latitude: user.location.approximated_latitude,
            longitude: user.location.approximated_longitude,
          });

          this.approximatedLocation = user.location.approximated_location;
        });
    }
  }

  private setLocation(itemLocation: ItemDetailLocation): void {
    this.itemLocation = itemLocation;
  }

  set approximatedLocation(isApproximated: boolean) {
    this.isApproximateLocation = isApproximated;
  }

  get locationHaveCoordinates(): boolean {
    return !!this.itemLocation?.latitude && !!this.itemLocation?.longitude;
  }

  get coordinates(): Coordinate {
    return {
      latitude: this.itemLocation.latitude,
      longitude: this.itemLocation.longitude,
    };
  }

  get locationSpecifications(): string {
    if (!!this.itemLocation?.zip && !!this.itemLocation?.city) {
      return `${this.itemLocation.zip}, ${this.itemLocation.city}`;
    } else {
      return $localize`:@@Undefined:Undefined`;
    }
  }
}
