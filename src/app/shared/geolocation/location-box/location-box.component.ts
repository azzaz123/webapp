import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { UserService } from '../../../core/user/user.service';
import { User } from 'shield';

@Component({
  selector: 'tsl-location-box',
  templateUrl: './location-box.component.html',
  styleUrls: ['./location-box.component.scss']
})
export class LocationBoxComponent implements OnInit {

  @Input() form: FormGroup;
  @Input() name: string;
  public user: User;

  constructor(private userService: UserService) { }

  ngOnInit() {
    this.userService.me().subscribe((user: User) => {
      this.user = user;
      if (user.location) {
        this.form.get(this.name).patchValue({
          address: user.location.full_address,
          latitude: user.location.approximated_latitude,
          longitude: user.location.approximated_longitude
        });
      }
    });
  }

}
