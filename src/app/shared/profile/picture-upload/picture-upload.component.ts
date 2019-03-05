import { Component, EventEmitter, Input, OnInit } from '@angular/core';
import { User } from '../../../core/user/user';
import { HttpService } from '../../../core/http/http.service';
import { ErrorsService } from '../../../core/errors/errors.service';
import { UserService } from '../../../core/user/user.service';
import { environment } from '../../../../environments/environment';
import { NgUploaderOptions, UploadFile, UploadInput, UploadOutput } from '../../uploader/upload.interface';

@Component({
  selector: 'tsl-picture-upload',
  templateUrl: './picture-upload.component.html',
  styleUrls: ['./picture-upload.component.scss']
})
export class PictureUploadComponent implements OnInit {

  @Input() user: User;
  file: UploadFile;
  uploadInput: EventEmitter<UploadInput> = new EventEmitter();
  uploadCoverInput: EventEmitter<UploadInput> = new EventEmitter();
  options: NgUploaderOptions;

  constructor(private http: HttpService,
              private errorsService: ErrorsService,
              private userService: UserService) { }

  ngOnInit() {
    this.options = {
      allowedExtensions: ['jpg', 'jpeg'],
      maxUploads: 1,
      maxSize: 3145728 // 3 MB
    };
  }

  public onUploadOutput(output: UploadOutput, type: string): void {
    switch (output.type) {
      case 'addedToQueue':
        this.file = output.file;
        this.uploadPicture(type);
        break;
      case 'uploading':
        this.file = output.file;
        break;
      case 'done':
        this.removeFromQueue(output, type);
        this.onUploadDone(output, type);
        break;
      case 'rejected':
        this.errorsService.i18nError(output.reason, output.file.name);
        this.file = null;
        break;
    }
  }

  private uploadPicture(type: string) {
    const url = 'api/v3/users/me/' + type;
    const uploadinput: UploadInput = {
      type: 'uploadFile',
      url: environment.baseUrl + url,
      method: 'POST',
      fieldName: 'image',
      headers: this.http.getOptions(null, url, 'POST').headers.toJSON(),
      file: this.file
    };

    if (type === 'image') {
      this.uploadInput.emit(uploadinput);
    } else {
      this.uploadCoverInput.emit(uploadinput);
    }
  }

  private removeFromQueue(output, type: string) {
    if (type === 'image') {
      this.uploadInput.emit({
        type: 'remove',
        id: output.file.id
      });
    } else {
      this.uploadCoverInput.emit({
        type: 'remove',
        id: output.file.id
      });
    }
    this.file = null;
  }

  private onUploadDone(output: UploadOutput, type: string) {
    if (output.file.progress.data.responseStatus === 204) {
      if (type === 'image') {
        this.userService.user.image.urls_by_size.medium = output.file.preview;
      } else {
        this.userService.user.coverImage.urls_by_size.medium = output.file.preview;
      }
    } else {
      this.errorsService.i18nError('serverError', output.file.response.message ? output.file.response.message : '');
    }
  }

}
