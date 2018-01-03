import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { isPresent } from 'ngx-cookie/src/utils';
import { UserService } from '../../../core/user/user.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ErrorsService } from 'shield';

@Component({
  selector: 'tsl-email-modal',
  templateUrl: './email-modal.component.html',
  styleUrls: ['./email-modal.component.scss']
})
export class EmailModalComponent implements OnInit {

  public emailForm: FormGroup;

  constructor(private fb: FormBuilder,
              private userService: UserService,
              private activeModal: NgbActiveModal,
              private errorsService: ErrorsService) {
    this.emailForm = fb.group({
      email_address: ['', [Validators.required, this.email]],
      repeat_email_address: ['', [Validators.required, this.email]]
    }, {validator: this.match('email_address', 'repeat_email_address')});
  }

  ngOnInit() {
  }

  public onSubmit() {
    if (this.emailForm.valid) {
      const email = this.emailForm.get('email_address').value;
      this.userService.updateEmail(email).subscribe(() => {
        this.activeModal.close(email);
      }, () => {
        this.errorsService.i18nError('serverError');
      });
    }
  }

  private match(field: string, confirmField: string): Function {
    return (group: FormGroup): { [key: string]: any } => {
      if (group.controls[field] && group.controls[confirmField]) {
        return (group.controls[field].value !== group.controls[confirmField].value) ? {'match': true} : null;
      }
    };
  }

  private email(control: AbstractControl): { [key: string]: boolean } {
    if (isPresent(Validators.required(control))) {
      return null;
    }
    let pattern: RegExp = /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    return pattern.test(control.value) ? null : {'email': true};
  }

}
