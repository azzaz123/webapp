import { Component, Input, OnChanges } from '@angular/core';
import { FAKE_ITEM_IMAGE_SMALL_BASE_PATH, FAKE_ITEM_IMAGE_SMALL_LIGHT_BASE_PATH } from '../../core/profile/profile';
import { environment } from '../../../environments/environment';
import { ProfileImage } from '../../core/profile/profile-response.interface';

@Component({
  selector: 'tsl-profile-images',
  templateUrl: './profile-images.component.html',
  styleUrls: ['./profile-images.component.scss'],
})
export class ProfileImagesComponent implements OnChanges {
  @Input() fallbackLight: boolean;
  @Input() profileImage: ProfileImage;
  @Input() size: string;

  public avatar: string;
  public fallback: string;

  constructor() {}

  ngOnChanges(changes?: any) {
    this.avatar = this.profileImage ? this.profileImage.medium : FAKE_ITEM_IMAGE_SMALL_LIGHT_BASE_PATH;
    if (environment.production || environment.name === 'beta') {
      this.avatar = this.avatar.replace(/^http:\/\//i, 'https://');
    }
    this.fallback = this.fallbackLight ? FAKE_ITEM_IMAGE_SMALL_LIGHT_BASE_PATH : FAKE_ITEM_IMAGE_SMALL_BASE_PATH;
  }
}
