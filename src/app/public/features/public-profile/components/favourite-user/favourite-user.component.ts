import { Component, Input } from '@angular/core';

@Component({
  selector: 'tsl-favourite-user',
  templateUrl: './favourite-user.component.html',
  styleUrls: ['./favourite-user.component.scss'],
})
export class FavouriteUserComponent {
  @Input() isFavourite: boolean = false;

  constructor() {}

  toggleFavourite(): void {
    this.isFavourite = !this.isFavourite;
  }
}
