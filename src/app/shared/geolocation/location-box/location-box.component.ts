import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { UserService } from '../../../core/user/user.service';
import { User } from 'shield';
import { Coordinate } from '../../../core/geolocation/address-response.interface';

@Component({
  selector: 'tsl-location-box',
  templateUrl: './location-box.component.html',
  styleUrls: ['./location-box.component.scss']
})
export class LocationBoxComponent implements OnInit {

  @Input() form: FormGroup;
  @Input() name: string;
  public user: User;
  public coordinates: Coordinate;

  constructor(private userService: UserService) {
  }

  ngOnInit() {
    this.userService.me().subscribe((user: User) => {
      this.user = user;
      if (user.location) {
        setTimeout(() => {
          this.form.get(this.name).patchValue({
            address: user.location.title,
            latitude: user.location.approximated_latitude,
            longitude: user.location.approximated_longitude
          });
          this.coordinates = {
            latitude: user.location.approximated_latitude,
            longitude: user.location.approximated_longitude
          }
        });
      }
    });
    this.form.get(this.name).valueChanges.subscribe((location: Coordinate) => {
      this.coordinates = location;
    });
  }

}
