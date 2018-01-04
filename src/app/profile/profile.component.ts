import { Component, Inject, OnInit } from '@angular/core';
import { UserService } from '../core/user/user.service';
import { environment } from '../../environments/environment';
import { User } from 'shield';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as moment from 'moment';

@Component({
  selector: 'tsl-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  public user: User;
  public userUrl: string;
  public profileForm: FormGroup;

  constructor(private userService: UserService,
              private fb: FormBuilder,
              @Inject('SUBDOMAIN') private subdomain: string) {
    this.profileForm = fb.group({
      first_name: ['', [Validators.required]],
      last_name: ['', [Validators.required]],
      birth_date: ['', [Validators.required]],
      gender: ['', [Validators.required]],
      location: this.fb.group({
        address: ['', [Validators.required]],
        latitude: ['', [Validators.required]],
        longitude: ['', [Validators.required]],
      })
    });
  }

  ngOnInit() {
    this.userService.me().subscribe((user) => {
      this.user = user;
      if (user) {
        this.userUrl = user.webLink.replace('http://es.wallapop.com/', environment.siteUrl.replace('es', this.subdomain));
        this.setUserData();
      }
    });
  }

  onSubmit() {
    console.log(this.profileForm.value);
  }

  private setUserData() {
    this.profileForm.get('first_name').patchValue(this.user.firstName);
    this.profileForm.get('last_name').patchValue(this.user.lastName);
    this.profileForm.get('birth_date').patchValue(moment(this.user.birthDate).format('YYYY-MM-DD'));
    this.profileForm.get('gender').patchValue(this.user.gender.toUpperCase().substr(0, 1));
  }

}
