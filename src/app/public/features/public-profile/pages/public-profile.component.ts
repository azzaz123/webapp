import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'tsl-public-profile',
  templateUrl: './public-profile.component.html',
  styleUrls: ['./public-profile.component.scss'],
})
export class PublicProfileComponent implements OnInit {
  //TODO remove hardcoded data when user services are available
  userStats = {
    buys: 0,
    publish: 5,
    reports_received: 0,
    reviews: 0,
    sells: 0,
    sold: 0,
  };

  //TODO remove hardcoded data when userId comes from url
  userId: string = 'userId';

  constructor() {}

  ngOnInit(): void {}
}
