import { Component, HostListener, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import * as _ from 'lodash';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UserService } from '../../../core/user/user.service';
import { ErrorsService } from '../../../core/errors/errors.service';
import { ExitConfirmationModalComponent } from '../../exit-confirmation-modal/exit-confirmation-modal.component';
import { User } from '../../../core/user/user';

@Component({
  selector: 'tsl-profile-form',
  templateUrl: './profile-form.component.html',
  styleUrls: ['./profile-form.component.scss']
})
export class ProfileFormComponent implements OnInit {

  @Input() profileForm: FormGroup;
  private oldFormValue: any;
  public hasNotSavedChanges: boolean;

  constructor(private modalService: NgbModal,
              private userService: UserService,
              private errorsService: ErrorsService) { }

  ngOnInit() {
    this.detectFormChanges();
  }

  private detectFormChanges() {
    this.profileForm.valueChanges.subscribe((value) => {
      if (!this.oldFormValue && value.first_name !== '') {
        this.oldFormValue = value;
      } else {
        if (!_.isEqual(this.oldFormValue, value)) {
          this.hasNotSavedChanges = true;
        }
      }
    });
  }

  public canExit() {
    if (!this.hasNotSavedChanges) {
      return true;
    }
    return this.modalService.open(ExitConfirmationModalComponent, {
      backdrop: 'static'
    }).result;
  }

  @HostListener('window:beforeunload')
  handleBeforeUnload() {
    if (this.hasNotSavedChanges) {
      return confirm();
    }
  }

  public onSubmit(user: User) {
    if (this.profileForm.valid) {
      delete this.profileForm.value.location;
      if (!user.featured) {
        delete this.profileForm.value.extra_info;
      }
      this.userService.edit(this.profileForm.value).subscribe(() => {
        this.errorsService.i18nSuccess('userEdited');
        this.hasNotSavedChanges = false;
      });
    } else {
      for (const control in this.profileForm.controls) {
        if (this.profileForm.controls.hasOwnProperty(control) && !this.profileForm.controls[control].valid) {
          this.profileForm.controls[control].markAsDirty();
        }
      }
      if (!this.profileForm.get('location.address').valid) {
        this.profileForm.get('location.address').markAsDirty();
      }
      this.errorsService.i18nError('formErrors');
    }
  }

}
