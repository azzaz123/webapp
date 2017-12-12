import { Component, OnInit } from '@angular/core';
import { UserService } from '../core/user/user.service';

@Component({
  selector: 'tsl-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  constructor(public userService: UserService) { }

  ngOnInit() {
  }

}
