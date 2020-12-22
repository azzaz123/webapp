import {
  Component,
  HostListener,
  Input,
  OnInit,
  Output,
  EventEmitter,
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { isEqual } from '@features/upload/drop-area/node_modules/lodash-es';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ExitConfirmationModalComponent } from '../../exit-confirmation-modal/exit-confirmation-modal.component';

@Component({
  selector: 'tsl-profile-form',
  templateUrl: './profile-form.component.html',
  styleUrls: ['./profile-form.component.scss'],
})
export class ProfileFormComponent implements OnInit {
  @Input() profileForm: FormGroup;
  @Output() onInit = new EventEmitter<boolean>();
  private oldFormValue: any;
  public hasNotSavedChanges: boolean;

  constructor(private modalService: NgbModal) {}

  ngOnInit() {
    this.detectFormChanges();
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

    this.onInit.emit(true);
  }

  public canExit() {
    if (!this.hasNotSavedChanges) {
      return true;
    }
    return this.modalService.open(ExitConfirmationModalComponent, {
      backdrop: 'static',
    }).result;
  }

  @HostListener('window:beforeunload')
  handleBeforeUnload() {
    if (this.hasNotSavedChanges) {
      return confirm();
    }
  }
}
