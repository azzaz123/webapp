import {
  TOKEN_AUTHORIZATION_HEADER_NAME,
  TOKEN_SIGNATURE_HEADER_NAME,
  TOKEN_TIMESTAMP_HEADER_NAME,
} from '@core/http/interceptors/token.interceptor';
import { Component, Input, OnInit } from '@angular/core';
import { User } from '@core/user/user';
import { ErrorsService } from '@core/errors/errors.service';
import { UserService } from '@core/user/user.service';
import { environment } from '@environments/environment';
import {
  ImageType,
  NgUploaderOptions,
  OutputType,
  UploadFile,
  UploadInput,
  UploadOutput,
} from '../../uploader/upload.interface';
import { AccessTokenService } from '@core/http/access-token.service';
import { UploaderService } from '@shared/uploader/uploader.service';
import { finalize } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';
import { Subscription } from 'rxjs';

@Component({
  selector: 'tsl-picture-upload',
  templateUrl: './picture-upload.component.html',
  styleUrls: ['./picture-upload.component.scss'],
})
export class PictureUploadComponent implements OnInit {
  @Input() user: User;
  file: UploadFile;
  options: NgUploaderOptions;
  isLoading: boolean;
  imageType = ImageType.AVATAR;
  eventsSubscription: Subscription;

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
      maxSize: 1024 * 1024 * 3, // 3 MB
    };
    this.subscribeUploadEvents();
  }

  private subscribeUploadEvents(): void {
    this.eventsSubscription = this.uploaderService.serviceEvents$.subscribe(
      (event: UploadOutput) => {
        if (event.imageType === this.imageType) {
          this.onUploadOutput(event);
        }
      }
    );
  }

  private onUploadOutput(output: UploadOutput): void {
    switch (output.type) {
      case OutputType.addedToQueue:
        this.file = output.file;
        this.uploadPicture();
        break;
      case OutputType.uploading:
        this.file = output.file;
        break;
      case OutputType.rejected:
        this.errorsService.i18nError(output.reason, output.file.name);
        this.file = null;
        break;
    }
  }

  private uploadPicture(): void {
    this.isLoading = true;
    const url = 'api/v3/users/me/image';
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
      url: environment.baseUrl + url,
      method: 'POST',
      fieldName: 'image',
      headers,
      imageType: this.imageType,
    };
    this.uploaderService
      .uploadFile(this.file, uploadinput)
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe(
        (output: UploadOutput) => {
          if (output?.type === OutputType.done) {
            this.userService.user.image.urls_by_size.medium =
              output.file.preview;
          }
        },
        (error: HttpErrorResponse) => {
          this.showError(error.message);
        }
      );
  }

  private showError(message?: string): void {
    this.errorsService.i18nError('serverError', message ? message : '');
  }

  public onFilesAdded(event: FileList): void {
    this.uploaderService.handleFiles(event, this.options, this.imageType);
  }

  ngOnDestroy() {
    if (this.eventsSubscription) {
      this.eventsSubscription.unsubscribe();
    }
  }
}
