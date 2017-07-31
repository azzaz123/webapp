import { Component, OnInit } from '@angular/core';
import { User } from 'shield';
import { UserService } from '../../core/user/user.service';
import { CategoryService } from "../../core/category/category.service";
import { GeolocationService } from "../../core/geolocation/geolocation.service";

@Component({
  selector: 'tsl-topbar',
  templateUrl: './topbar.component.html',
  styleUrls: ['./topbar.component.scss'],
  providers: [GeolocationService, CategoryService]
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
