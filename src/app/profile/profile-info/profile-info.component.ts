import { Component, OnInit, ViewChild } from '@angular/core';
import { UserService } from '../../core/user/user.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import * as moment from 'moment';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { UnsubscribeModalComponent } from './../unsubscribe-modal/unsubscribe-modal.component';
import { CanComponentDeactivate } from '../../shared/guards/can-component-deactivate.interface';
import { User } from '../../core/user/user';
import { ProfileFormComponent } from '../../shared/profile/profile-form/profile-form.component';
import { LocationModalComponent } from '../../shared/geolocation/location-select/location-modal/location-modal.component';
import { BecomeProModalComponent } from '../become-pro-modal/become-pro-modal.component';
import { Coordinate } from '../../core/geolocation/address-response.interface';
import { LOCATION_MODAL_TIMEOUT } from '../../shared/geolocation/location-select/location-select.component';
import { ErrorsService } from '../../core/errors/errors.service';
import { StripeService } from '../../core/stripe/stripe.service';

export const competitorLinks = [
  'coches.net',
  'autoscout24.es',
  'autocasión.com',
  'vibbo.com',
  'milanuncios.com',
  'motor.es'
];

@Component({
  selector: 'tsl-profile-info',
  templateUrl: './profile-info.component.html',
  styleUrls: ['./profile-info.component.scss']
})
export class ProfileInfoComponent implements OnInit, CanComponentDeactivate {

  public user: User;
  public profileForm: FormGroup;
  public allowSegmentation: boolean;
  public isStripe: boolean;
  @ViewChild(ProfileFormComponent) formComponent: ProfileFormComponent;

  constructor(private userService: UserService,
              private fb: FormBuilder,
              private errorsService: ErrorsService,
              private modalService: NgbModal,
              private stripeService: StripeService) {
    this.profileForm = fb.group({
      first_name: ['', [Validators.required]],
      last_name: ['', [Validators.required]],
      birth_date: ['', [Validators.required, this.dateValidator]],
      gender: ['', [Validators.required]],
      location: this.fb.group({
        address: ['', [Validators.required]],
        latitude: ['', [Validators.required]],
        longitude: ['', [Validators.required]],
      }),
      extra_info: this.fb.group({
        description: '',
        phone_number: '',
        link: '',
        address: ''
      }),
    });
  }

  ngOnInit() {
    this.isStripe = this.stripeService.isPaymentMethodStripe();
    this.userService.me().subscribe((user: User) => {
      this.user = user;
      if (user) {
        this.setUserData();
      }
    });
  }

  public canExit() {
    return this.formComponent.canExit();
  }

  public onSubmit() {
    const extraInfoControl = this.profileForm.get('extra_info');
    const linkControl = extraInfoControl.get('link');
    if (extraInfoControl.value && linkControl.value ) {
      competitorLinks.forEach(competitor  => {
        if (linkControl.value.toUpperCase().includes(competitor.toUpperCase())) {
          linkControl.setErrors({incorrect: true});
        }
      });
      if (!linkControl.valid) {
        this.errorsService.i18nError('linkError');
        return;
      }
    }
    return this.formComponent.onSubmit(this.user);
  }

  private setUserData() {
    this.profileForm.patchValue({
      first_name: this.user.firstName,
      last_name: this.user.lastName,
      birth_date: moment(this.user.birthDate).format('YYYY-MM-DD'),
      gender: this.user.gender.toUpperCase().substr(0, 1)
    });
    if (this.user.featured && this.user.extraInfo) {
      this.profileForm.patchValue({
        extra_info: {
          description: this.user.extraInfo.description,
          phone_number: this.user.extraInfo.phone_number,
          link: this.user.extraInfo.link,
          address: this.user.extraInfo.address
        }
      });
    }
  }

  public openUnsubscribeModal() {
    this.modalService.open(UnsubscribeModalComponent, {windowClass: 'unsubscribe'});
  }

  private dateValidator(c: FormControl) {
    const dateRegEx = new RegExp(/^(\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01]))$/);
    return dateRegEx.test(c.value) ? null : {date: true}
  }

  public openBecomeProModal() {
    if (!this.user.featured) {
      this.modalService.open(BecomeProModalComponent, {windowClass: 'become-pro'});
    }
  }

  public open(element: HTMLElement) {
    setTimeout(() => {
      element.blur();
      const modal: NgbModalRef = this.modalService.open(LocationModalComponent, {
        windowClass: 'location'
      });
      if (this.user.extraInfo) {
        modal.componentInstance.init({
          latitude: this.user.extraInfo.latitude,
          longitude: this.user.extraInfo.longitude,
          name: this.user.extraInfo.address
        });
      } else {
        modal.componentInstance.init();
      }
      modal.result.then((result: Coordinate) => {
        this.userService.updateStoreLocation(result).subscribe(() => {
          this.profileForm.get('extra_info.address').setValue(result.name);
          this.user.extraInfo.latitude = result.latitude;
          this.user.extraInfo.longitude = result.longitude;
          this.user.extraInfo.address = result.name;
        });
      }, () => {
      });
    }, LOCATION_MODAL_TIMEOUT);

  }

}
