import { Component, Input, OnChanges } from '@angular/core';
import { PLACEHOLDER_AVATAR, User } from 'shield';

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
    this.avatar = this.user.image ? this.user.image.urls_by_size.medium : PLACEHOLDER_AVATAR;
    this.fallback = PLACEHOLDER_AVATAR;
  }

}
