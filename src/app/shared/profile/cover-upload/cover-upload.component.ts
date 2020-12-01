import {
  TOKEN_AUTHORIZATION_HEADER_NAME,
  TOKEN_SIGNATURE_HEADER_NAME,
  TOKEN_TIMESTAMP_HEADER_NAME,
} from './../../../core/http/interceptors/token.interceptor';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { User } from '../../../core/user/user';
import { ErrorsService } from '../../../core/errors/errors.service';
import { UserService } from '../../../core/user/user.service';
import { environment } from '../../../../environments/environment';
import {
  NgUploaderOptions,
  UploadFile,
  UploadInput,
  UploadOutput,
} from '../../uploader/upload.interface';
import { AccessTokenService } from '../../../core/http/access-token.service';
import { UploaderService } from 'app/shared/uploader/uploader.service';

@Component({
  selector: 'tsl-cover-upload',
  templateUrl: './cover-upload.component.html',
  styleUrls: ['./cover-upload.component.scss'],
})
export class CoverUploadComponent implements OnInit {
  @Input() user: User;
  file: UploadFile;
  options: NgUploaderOptions;
  @Input() isPro: boolean;
  @Output() clickNotPro: EventEmitter<any> = new EventEmitter();

  constructor(
    private errorsService: ErrorsService,
    private userService: UserService,
    private accesTokenService: AccessTokenService,
    private uploaderService: UploaderService
  ) {}

  ngOnInit() {
    this.options = {
      allowedExtensions: ['jpg', 'jpeg'],
      maxUploads: 1,
      maxSize: 3145728, // 3 MB
    };
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
      case 'rejected':
        this.errorsService.i18nError(output.reason, output.file.name);
        this.file = null;
        break;
    }
  }

  private uploadPicture() {
    const url = 'api/v3/users/me/cover-image';
    const timestamp = new Date().getTime();
    const signature = this.accesTokenService.getTokenSignature(
      url,
      'POST',
      timestamp
    );
    const headers = {
      [TOKEN_AUTHORIZATION_HEADER_NAME]: `Bearer ${this.accesTokenService.accessToken}`,
      [TOKEN_SIGNATURE_HEADER_NAME]: signature,
      [TOKEN_TIMESTAMP_HEADER_NAME]: timestamp.toString(),
    };

    const uploadinput: UploadInput = {
      type: 'uploadFile',
      url: environment.baseUrl + url,
      method: 'POST',
      fieldName: 'image',
      headers,
      file: this.file,
      imageType: 'cover',
    };
    this.uploaderService.uploadFile(this.file, uploadinput).subscribe(
      (output) => {
        if (output?.type === 'done') {
          if (output.file.progress.data.responseStatus === 204) {
            this.userService.user.setCoverImageUrl(<string>output.file.preview);
          } else {
            this.showError(output.file.response.message);
          }
        }
      },
      (err) => {
        this.showError();
      }
    );
  }

  private showError(message?: string) {
    this.errorsService.i18nError('serverError', message ? message : '');
  }
}
