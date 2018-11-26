import { Component, Input, OnChanges } from '@angular/core';
import { FAKE_ITEM_IMAGE_SMALL_BASE_PATH, FAKE_ITEM_IMAGE_SMALL_LIGHT_BASE_PATH } from '../../core/item/item';
import { environment } from '../../../environments/environment';
import { ProfileImage } from '../../core/user/user-response.interface';
import { PLACEHOLDER_AVATAR } from '../../core/user/user';

@Component({
  selector: 'tsl-profile-avatar',
  templateUrl: './profile-avatar.component.html',
  styleUrls: ['./profile-avatar.component.scss']
})
export class ProfileAvatarComponent implements OnChanges {

  public avatar: string;
  public fallback: string;
  @Input() fallbackLight: boolean;
  @Input() profileImage: ProfileImage;
  @Input() size: string;

  constructor() {
  }

  ngOnChanges(changes?: any) {
    this.avatar = this.profileImage ? this.profileImage.medium : PLACEHOLDER_AVATAR;
    if (environment.production || environment.name === 'beta') {
      this.avatar = this.avatar.replace(/^http:\/\//i, 'https://');
    }
    this.fallback = this.fallbackLight ? FAKE_ITEM_IMAGE_SMALL_LIGHT_BASE_PATH : FAKE_ITEM_IMAGE_SMALL_BASE_PATH;
  }

}
