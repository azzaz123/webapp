import { Component, OnInit } from '@angular/core';
import { Item } from '@core/item/item';
import { User } from '@core/user/user';
import { PublicProfileService } from '../../core/services/public-profile.service';

@Component({
  selector: 'tsl-user-published',
  templateUrl: './user-published.component.html',
  styleUrls: ['./user-published.component.scss'],
})
export class UserPublishedComponent implements OnInit {
  user: User;
  items: Item[] = [];

  constructor(private publicProfileService: PublicProfileService) {}

  ngOnInit(): void {
    this.user = this.publicProfileService.user;
    this.getUserItems();
  }

  getUserItems(): void {
    if (this.user?.id) {
      this.publicProfileService
        .getPublishedItems(this.user.id)
        .subscribe((items: Item[]) => {
          this.items = items;
        });
    }
  }
}
