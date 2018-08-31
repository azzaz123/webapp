import { Component, Inject, OnInit } from '@angular/core';
import { UserService } from '../core/user/user.service';
import { User } from '../core/user/user';

@Component({
  selector: 'tsl-profile-pro',
  templateUrl: './profile-pro.component.html',
  styleUrls: ['./profile-pro.component.scss']
})
export class ProfileProComponent implements OnInit {

  public userUrl: string;

  constructor(private userService: UserService,
              @Inject('SUBDOMAIN') private subdomain: string) { }

  ngOnInit() {
    this.userService.me().subscribe((user: User) => {
      if (user) {
        this.userUrl = user.getUrl(this.subdomain);
      }
    });
  }

  public logout($event: any) {
    $event.preventDefault();
    this.userService.logout();
  }

}
