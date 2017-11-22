import { Component } from '@angular/core';
import { UserService } from '../../core/user/user.service';

@Component({
  selector: 'tsl-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent {

  constructor(private userService: UserService) {
  }

  public logout() {
    this.userService.logout();
  }
}
