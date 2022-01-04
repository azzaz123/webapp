import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { User } from '@core/user/user';
import { ErrorsService } from '@core/errors/errors.service';
import { UserService } from '@core/user/user.service';
import { environment } from '@environments/environment';
import { IMAGE_TYPE, NgUploaderOptions, OUTPUT_TYPE, UploadFile, UploadInput, UploadOutput } from '../../uploader/upload.interface';
import { AccessTokenService } from '@core/http/access-token.service';
import { UploaderService } from '@shared/uploader/uploader.service';
import { filter, finalize, take } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { TRANSLATION_KEY } from '@core/i18n/translations/enum/translation-keys.enum';
import { AUTHORIZATION_HEADER_NAME } from '@core/http/interceptors';

@Component({
  selector: 'tsl-picture-upload',
  templateUrl: './picture-upload.component.html',
  styleUrls: ['./picture-upload.component.scss'],
})
export class PictureUploadComponent implements OnInit, OnDestroy {
  @Input() user: User;
  file: UploadFile;
  options: NgUploaderOptions;
  isLoading: boolean;
  imageType = IMAGE_TYPE.AVATAR;
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

  ngOnDestroy() {
    if (this.eventsSubscription) {
      this.eventsSubscription.unsubscribe();
    }
  }

  public onFilesAdded(event: FileList): void {
    this.uploaderService.handleFiles(event, this.options, this.imageType);
  }
  private subscribeUploadEvents(): void {
    this.eventsSubscription = this.uploaderService.serviceEvents$.subscribe((event: UploadOutput) => {
      if (event.imageType === this.imageType) {
        this.onUploadOutput(event);
      }
    });
  }

  private onUploadOutput(output: UploadOutput): void {
    switch (output.type) {
      case OUTPUT_TYPE.addedToQueue:
        this.file = output.file;
        this.uploadPicture();
        break;
      case OUTPUT_TYPE.uploading:
        this.file = output.file;
        break;
      case OUTPUT_TYPE.rejected:
        this.errorsService.i18nError(output.reason, output.file.name);
        this.file = null;
        break;
    }
  }

  private uploadPicture(): void {
    this.isLoading = true;
    const url = 'api/v3/users/me/image';
    const headers = {
      [AUTHORIZATION_HEADER_NAME]: `Bearer ${this.accesTokenService.accessToken}`,
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
      .pipe(
        filter((output: UploadOutput) => output?.type === OUTPUT_TYPE.done),
        take(1),
        finalize(() => (this.isLoading = false))
      )
      .subscribe(
        (output: UploadOutput) => {
          this.userService.user.image.urls_by_size.medium = output.file.preview;
        },
        (error: HttpErrorResponse) => {
          this.showError(error.message);
        }
      );
  }

  private showError(message?: string): void {
    this.errorsService.i18nError(TRANSLATION_KEY.SERVER_ERROR, message || '');
  }
}
