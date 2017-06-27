import { Component, OnInit } from '@angular/core';
import { UserService } from 'shield/lib/shield/user/user.service';

@Component({
  selector: 'tsl-topbar',
  templateUrl: './topbar.component.html',
  styleUrls: ['./topbar.component.scss']
})
export class TopbarComponent implements OnInit {

  constructor(private userService: UserService) {
    this.userService.me().subscribe((user) => {
      console.log(user);
    })
  }

  ngOnInit() {
  }

}
