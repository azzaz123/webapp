import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'tsl-public-profile',
  templateUrl: './public-profile.component.html',
  styleUrls: ['./public-profile.component.scss'],
})
export class PublicProfileComponent implements OnInit {
  public userId: string;

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.getUserId();
  }

  private getUserId(): void {
    this.route.queryParams.subscribe((params) => (this.userId = params.id));
  }
}
