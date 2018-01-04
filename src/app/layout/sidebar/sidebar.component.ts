import { Component, Inject, OnInit } from '@angular/core';
import { UserService } from '../../core/user/user.service';
import { User } from 'shield';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'tsl-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {

  public user: User;
  public userUrl: string;

  constructor(private userService: UserService,
              @Inject('SUBDOMAIN') private subdomain: string) {
  }

  ngOnInit() {
    this.userService.me().subscribe((user) => {
      this.user = user;
      if (user) {
        this.userUrl = user.webLink.replace('http://es.wallapop.com/', environment.siteUrl.replace('es', this.subdomain));
      }
    });
  }

  public logout($event: any) {
    $event.preventDefault();
    this.userService.logout();
  }
}
