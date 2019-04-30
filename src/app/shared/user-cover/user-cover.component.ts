import { Component, Input, OnChanges } from '@angular/core';
import { environment } from '../../../environments/environment';
import { PLACEHOLDER_COVER, User } from '../../core/user/user';

@Component({
  selector: 'tsl-user-cover',
  templateUrl: './user-cover.component.html',
  styleUrls: ['./user-cover.component.scss']
})


export class UserCoverComponent implements OnChanges {
  public avatar: string;
  public uploadedCover;
  public fallback: string;
  @Input() size = 40;
  @Input() user: User;
  @Input() imageCoverUrl: string;

  constructor() {
  }

  ngOnChanges(changes?: any) {
    if (changes && changes.imageCoverUrl && typeof changes.imageCoverUrl.currentValue === 'object') {
      this.uploadedCover = changes.imageCoverUrl.currentValue;
    } else if (this.user) {
      this.avatar = this.user.coverImage ? this.user.coverImage.urls_by_size.medium : PLACEHOLDER_COVER;
      if (environment.production || environment.name === 'beta') {
        this.avatar = this.avatar.replace(/^http:\/\//i, 'https://');
      }
    }
    this.fallback = PLACEHOLDER_COVER;
  }

}
