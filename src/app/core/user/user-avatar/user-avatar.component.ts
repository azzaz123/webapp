import { Component, Input, OnChanges } from '@angular/core';
import { PLACEHOLDER_AVATAR, User } from 'shield';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'tsl-user-avatar',
  templateUrl: './user-avatar.component.html',
  styleUrls: ['./user-avatar.component.scss']
})


export class UserAvatarComponent implements OnChanges {
  public avatar: string;
  public fallback: string;
  @Input() user: User;
  @Input() size = 40;

  constructor() {
  }

  ngOnChanges(changes?: any) {
    if (this.user) {
      this.avatar = this.user.image ? this.user.image.urls_by_size.medium : PLACEHOLDER_AVATAR;
      if (environment.production || environment.name === 'beta') {
        this.avatar = this.avatar.replace(/^http:\/\//i, 'https://');
      }
    }
    this.fallback = PLACEHOLDER_AVATAR;
  }

}
