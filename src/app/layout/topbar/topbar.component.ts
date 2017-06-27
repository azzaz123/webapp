import { Component, OnInit } from '@angular/core';
import { UserService, User } from 'shield';

@Component({
  selector: 'tsl-topbar',
  templateUrl: './topbar.component.html',
  styleUrls: ['./topbar.component.scss']
})
export class TopbarComponent implements OnInit {

  public user: User;

  constructor(public userService: UserService) {
    this.userService.me().subscribe((user) => {
      this.user = user;
    });
  }

  ngOnInit() {
  }

}
