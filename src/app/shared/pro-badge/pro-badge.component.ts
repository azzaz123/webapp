import { Component } from '@angular/core';
import { UserService } from '../../core/user/user.service';

@Component({
  selector: 'tsl-pro-badge',
  templateUrl: './pro-badge.component.html',
  styleUrls: ['./pro-badge.component.scss']
})
export class ProBadgeComponent {

  constructor(
    public userService: UserService
  ) { }

}
