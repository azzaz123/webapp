import { Component, EventEmitter, Inject, OnInit } from '@angular/core';
import { UserService } from '../core/user/user.service';
import { environment } from '../../environments/environment';
import { User, ErrorsService, HttpService } from 'shield';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as moment from 'moment';
import { UploadOutput, UploadFile, UploadInput, NgUploaderOptions } from 'ngx-uploader';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UnsubscribeModalComponent } from './unsubscribe-modal/unsubscribe-modal.component';

@Component({
  selector: 'tsl-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  public user: User;
  public userUrl: string;
  public profileForm: FormGroup;
  file: UploadFile;
  uploadInput: EventEmitter<UploadInput> = new EventEmitter();
  options: NgUploaderOptions;

  constructor(private userService: UserService,
              private fb: FormBuilder,
              private errorsService: ErrorsService,
              private http: HttpService,
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
    this.options = {
      allowedExtensions: ['jpg', 'jpeg'],
      maxUploads: 1,
      maxSize: 10485760 // 10 MB
    };
    this.userService.me().subscribe((user) => {
      this.user = user;
      if (user) {
        this.userUrl = user.webLink.replace('http://es.wallapop.com/', environment.siteUrl.replace('es', this.subdomain));
        this.setUserData();
      }
    });
  }

  public onSubmit() {
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
      if (!this.profileForm.get('location.address').valid) {
        this.profileForm.get('location.address').markAsDirty();
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

  public onUploadOutput(output: UploadOutput): void {
    switch (output.type) {
      case 'addedToQueue':
        this.file = output.file;
        this.uploadPicture();
        break;
      case 'uploading':
        this.file = output.file;
        break;
      case 'done':
        this.removeFromQueue(output);
        this.onUploadDone(output);
        break;
      case 'rejected':
        this.errorsService.i18nError(output.reason, output.file.name);
        this.file = null;
        break;
    }
  }

  public openUnsubscribeModal() {
    this.modalService.open(UnsubscribeModalComponent, {windowClass: 'unsubscribe'});
  }

  private uploadPicture() {
    const url = 'api/v3/users/me/image';
    const uploadinput: UploadInput = {
      type: 'uploadFile',
      url: environment.baseUrl + url,
      method: 'POST',
      fieldName: 'image',
      headers: this.http.getOptions(null, url, 'POST').headers.toJSON(),
      file: this.file
    };
    this.uploadInput.emit(uploadinput);
  }

  private onUploadDone(output: UploadOutput) {
    if (output.file.progress.data.responseStatus === 204) {
      this.userService.user.image.urls_by_size.medium = output.file.preview;
    } else {
      this.errorsService.i18nError('serverError');
    }
  }

  private removeFromQueue(output) {
    this.uploadInput.emit({
      type: 'remove',
      id: output.file.id
    });
    this.file = null;
  }

}
