import { Component, Inject, OnInit } from '@angular/core';
import { UserService } from '../core/user/user.service';
import { environment } from '../../environments/environment';
import { User, ErrorsService } from 'shield';
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
              private errorsService: ErrorsService,
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
    if (this.profileForm.valid) {
      delete this.profileForm.value.location;
      this.userService.edit(this.profileForm.value).subscribe(() => {
        this.errorsService.i18nSuccess('userEdited');
      });
    } else {
      for (let control in this.profileForm.controls) {
        if (this.profileForm.controls.hasOwnProperty(control) && !this.profileForm.controls[control].valid) {
          this.profileForm.controls[control].markAsDirty();
        }
      }
      this.errorsService.i18nError('formErrors');
    }
  }

  private setUserData() {
    this.profileForm.get('first_name').patchValue(this.user.firstName);
    this.profileForm.get('last_name').patchValue(this.user.lastName);
    this.profileForm.get('birth_date').patchValue(moment(this.user.birthDate).format('YYYY-MM-DD'));
    this.profileForm.get('gender').patchValue(this.user.gender.toUpperCase().substr(0, 1));
  }

}
