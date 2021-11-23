import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { PERMISSIONS } from '@core/user/user-constants';
import { InboxUser } from '@private/features/chat/core/model';
import { ICON_TYPE } from '@shared/pro-badge/pro-badge.interface';
import { environment } from '../../../environments/environment';
import { PLACEHOLDER_AVATAR, User } from '../../core/user/user';

@Component({
  selector: 'tsl-user-avatar',
  templateUrl: './user-avatar.component.html',
  styleUrls: ['./user-avatar.component.scss'],
})
export class UserAvatarComponent implements OnInit, OnChanges {
  public avatar: string;
  public uploadedAvatar;
  public fallback: string;
  public badgeSize = 22;
  public badgeStyles = {};
  public readonly PERMISSIONS = PERMISSIONS;
  public readonly ICON_TYPE = ICON_TYPE;

  @Input() user: User | InboxUser;
  @Input() size = 40;
  @Input() imageUrl: string;
  @Input() showProBadge = false;
  @Input() showProBadgeWide = false;

  ngOnInit(): void {
    this.checkPROBadgeProperties();
  }

  ngOnChanges(changes?: any) {
    if (
      (changes && changes.imageUrl && typeof changes.imageUrl.currentValue === 'object') ||
      (changes && changes.avatarUrl && typeof changes.avatarUrl.currentValue === 'object')
    ) {
      this.uploadedAvatar = changes.imageUrl ? changes.imageUrl.currentValue : changes.avatarUrl.currentValue;
    } else if (this.user instanceof User && this.user) {
      this.avatar = this.user.image ? this.user.image.urls_by_size.medium : PLACEHOLDER_AVATAR;
      if (environment.production || environment.name === 'beta') {
        this.avatar = this.avatar.replace(/^http:\/\//i, 'https://');
      }
    } else if (this.user instanceof InboxUser && this.user) {
      this.avatar = this.user.avatarUrl ? this.user.avatarUrl : PLACEHOLDER_AVATAR;
      if (environment.production || environment.name === 'beta') {
        this.avatar = this.avatar.replace('http://', 'https://');
      }
    }
    this.fallback = PLACEHOLDER_AVATAR;
  }

  private checkPROBadgeProperties(): void {
    if (this.showProBadge) {
      this.badgeSize = this.calculateBadgeSize();
      this.badgeStyles = this.calculateBadgeStyles();
    }
    if (this.showProBadgeWide) {
      this.badgeStyles = {
        'bottom.px': 4,
        'left.px': 54,
      };
    }
  }

  // FIXME: PROs team will change the pro-seal.svg and this won't be needed
  private calculateBadgeStyles(): Object {
    return {
      'right.px': -1 * (this.badgeSize / 2) + 4,
      'bottom.px': -1 * (this.badgeSize / 2),
    };
  }

  private calculateBadgeSize(): number {
    return this.size / 3;
  }
}
