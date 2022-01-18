import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { UserService } from '../../../core/user/user.service';
import { Coordinate } from '../../../core/geolocation/address-response.interface';
import { UserLocation } from '@core/user/user-response.interface';

@Component({
  selector: 'tsl-location-box',
  templateUrl: './location-box.component.html',
  styleUrls: ['./location-box.component.scss'],
})
export class LocationBoxComponent implements OnInit {
  @Input() form: FormGroup;
  @Input() name: string;
  @Input() title: string;
  @Input() updateLocation = true;
  @Input() location: Partial<UserLocation>;
  @Input() isIncorrectAddress = false;
  @Input() disableFocus: boolean;
  @Input() disableTitle: boolean;
  @Input() disableFooter: boolean;
  @Input() disablePopover: boolean;
  @Input() disableInput: boolean;
  @Input() defaultUserLocation = true;
  @Output() locationSelected: EventEmitter<any> = new EventEmitter();
  public coordinates: Coordinate;

  constructor(private userService: UserService) {}

  public emitLocation() {
    this.locationSelected.emit();
  }

  ngOnInit() {
    if (this.location) {
      this.setLocation({
        latitude: this.location.approximated_latitude,
        longitude: this.location.approximated_longitude,
      });
    } else {
      const user = this.userService.user;
      if (this.defaultUserLocation && user && user.location) {
        this.form.get(this.name).patchValue({
          address: user.location.title,
          latitude: user.location.approximated_latitude,
          longitude: user.location.approximated_longitude,
        });
        this.setLocation({
          latitude: user.location.approximated_latitude,
          longitude: user.location.approximated_longitude,
        });
      }
    }

    this.form.get(this.name).valueChanges.subscribe((location: Coordinate) => {
      this.setLocation(location);
    });
  }

  private setLocation(coordinates: Coordinate) {
    this.coordinates = coordinates;
  }
}
