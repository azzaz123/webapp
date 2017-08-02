import { Component, OnInit } from '@angular/core';
import { User } from 'shield';
import { UserService } from '../../core/user/user.service';

@Component({
  selector: 'tsl-topbar',
  templateUrl: './topbar.component.html',
  styleUrls: ['./topbar.component.scss']
})
export class TopbarComponent implements OnInit {

  public user: User;

  constructor(public userService: UserService) { }

  ngOnInit() {
    this.userService.me().subscribe((user) => {
      this.user = user;
    });
  }

  logout() {
    this.userService.logout();
  }

}
