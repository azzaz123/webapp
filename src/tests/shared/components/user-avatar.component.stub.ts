import { Component, Input } from '@angular/core';
import { User } from '@core/user/user';
import { InboxUser } from '@private/features/chat/core/model';

@Component({
  selector: 'tsl-user-avatar',
  template: '',
})
export class UserAvatarStubComponent {
  @Input() user: User | InboxUser;
  @Input() size = 40;
  @Input() imageUrl: string;
  @Input() showProBadge = false;
  @Input() showProBadgeWide = false;
}
