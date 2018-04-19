import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProfileFormComponent } from '../../profile-form/profile-form.component';
import { UserService } from '../../../core/user/user.service';
import { User } from '../../../core/user/user';

@Component({
  selector: 'tsl-profile-pro-info',
  templateUrl: './profile-pro-info.component.html',
  styleUrls: ['./profile-pro-info.component.scss']
})
export class ProfileProInfoComponent implements OnInit {

  public profileForm: FormGroup;
  public user: User;
  @ViewChild(ProfileFormComponent) formComponent: ProfileFormComponent;


  constructor(private userService: UserService,
              private fb: FormBuilder) {
    this.profileForm = fb.group({
      first_name: ['', [Validators.required]],
      last_name: '',
      telephone: '',
      description: '',
      opening_hours: '',
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
        this.setUserData();
      }
    });
  }

  private setUserData() {
    this.profileForm.patchValue({
      first_name: this.user.firstName,
      last_name: this.user.lastName
    });
  }

  public canExit() {
    return this.formComponent.canExit();
  }

  public onSubmit() {
    return this.formComponent.onSubmit();
  }

}
