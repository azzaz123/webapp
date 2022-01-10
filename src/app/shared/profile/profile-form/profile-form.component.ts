import { Component, HostListener, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { isEqual } from 'lodash-es';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ExitConfirmationModalComponent } from '../../exit-confirmation-modal/exit-confirmation-modal.component';

@Component({
  selector: 'tsl-profile-form',
  templateUrl: './profile-form.component.html',
  styleUrls: ['./profile-form.component.scss'],
})
export class ProfileFormComponent implements OnInit {
  @Input() profileForm: FormGroup;
  @Output() handleOnInit = new EventEmitter<boolean>();
  public hasNotSavedChanges: boolean;
  private oldFormValue: any;

  constructor(private modalService: NgbModal) {}
  @HostListener('window:beforeunload')
  handleBeforeUnload() {
    if (this.hasNotSavedChanges) {
      return confirm();
    }
  }
  ngOnInit() {
    this.detectFormChanges();
  }

  public canExit() {
    if (!this.hasNotSavedChanges) {
      return true;
    }
    return this.modalService.open(ExitConfirmationModalComponent, {
      backdrop: 'static',
    }).result;
  }

  public initFormControl() {
    this.hasNotSavedChanges = false;
    this.oldFormValue = this.profileForm.value;
  }

  private detectFormChanges() {
    this.profileForm.valueChanges.subscribe((value) => {
      if (!this.oldFormValue) {
        this.oldFormValue = value;
      } else {
        if (!isEqual(this.oldFormValue, value)) {
          this.hasNotSavedChanges = true;
        } else {
          this.hasNotSavedChanges = false;
        }
      }
    });

    this.handleOnInit.emit(true);
  }
}
