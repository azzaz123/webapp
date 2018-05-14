import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { UserService } from '../core/user/user.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as moment from 'moment';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UnsubscribeModalComponent } from './unsubscribe-modal/unsubscribe-modal.component';
import { CanComponentDeactivate } from '../shared/guards/can-component-deactivate.interface';
import { User } from '../core/user/user';
import { ProfileFormComponent } from './profile-form/profile-form.component';

@Component({
  selector: 'tsl-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit, CanComponentDeactivate {

  public user: User;
  public userUrl: string;
  public profileForm: FormGroup;
  @ViewChild(ProfileFormComponent) formComponent: ProfileFormComponent;

  constructor(private userService: UserService,
    private fb: FormBuilder,
    private modalService: NgbModal,
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
    this.userService.me().subscribe((user: User) => {
      this.user = user;
      if (user) {
        this.userUrl = user.getUrl(this.subdomain);
        this.setUserData();
      }
    });
  }

  public canExit() {
    return this.formComponent.canExit();
  }

  public onSubmit() {
    return this.formComponent.onSubmit();
  }

  private setUserData() {
    this.profileForm.patchValue({
      first_name: this.user.firstName,
      last_name: this.user.lastName,
      birth_date: moment(this.user.birthDate).format('YYYY-MM-DD'),
      gender: this.user.gender.toUpperCase().substr(0, 1)
    });
  }

  public openUnsubscribeModal() {
    this.modalService.open(UnsubscribeModalComponent, {windowClass: 'unsubscribe'});
  }

  public logout($event: any) {
    $event.preventDefault();
    this.userService.logout();
  }

}
