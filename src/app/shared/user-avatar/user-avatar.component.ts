import { Component, Input, OnChanges } from '@angular/core';
import { environment } from '../../../environments/environment';
import { PLACEHOLDER_AVATAR, User } from '../../core/user/user';
import { InboxUser } from '../../chat/chat-with-inbox/inbox/inbox-user';

@Component({
  selector: 'tsl-user-avatar',
  templateUrl: './user-avatar.component.html',
  styleUrls: ['./user-avatar.component.scss']
})


export class UserAvatarComponent implements OnChanges {
  public avatar: string;
  public uploadedAvatar;
  public fallback: string;
  @Input() user: User | InboxUser;
  @Input() size = 40;
  @Input() imageUrl: string;

  constructor() {
  }

  ngOnChanges(changes?: any) {
    if ((changes && changes.imageUrl && typeof changes.imageUrl.currentValue === 'object') ||
          (changes && changes.avatarUrl && typeof changes.avatarUrl.currentValue === 'object')) {
      this.uploadedAvatar = changes.imageUrl ? changes.imageUrl.currentValue : changes.avatarUrl.currentValue;
    } else if (this.user instanceof User && this.user) {
      this.avatar = this.user.image ? this.user.image.urls_by_size.medium : PLACEHOLDER_AVATAR;
      if (environment.production || environment.name === 'beta') {
        this.avatar = this.avatar.replace(/^http:\/\//i, 'https://');
      }
    } else if (this.user instanceof InboxUser && this.user) {
      console.log(this.user);
      this.avatar = this.user.avatarUrl ? this.user.avatarUrl : PLACEHOLDER_AVATAR;
      if (environment.production || environment.name === 'beta') {
        this.avatar = this.avatar.replace('http://', 'https://');
      }
    }
    this.fallback = PLACEHOLDER_AVATAR;
  }

}
