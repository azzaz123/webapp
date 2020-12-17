import { Component, Input } from '@angular/core';
import { PublicProfileService } from '@public/Features/public-profile/core/services/public-profile.service';

@Component({
  selector: 'tsl-favourite-user',
  templateUrl: './favourite-user.component.html',
  styleUrls: ['./favourite-user.component.scss'],
})
export class FavouriteUserComponent {
  @Input() isFavourite: boolean = false;
  @Input() userId: string;

  constructor(private publicProfileService: PublicProfileService) {}

  toggleFavourite(): void {
    this.isFavourite = !this.isFavourite;

    (this.isFavourite
      ? this.publicProfileService.markAsFavourite(this.userId)
      : this.publicProfileService.unmarkAsFavourite(this.userId)
    ).subscribe(
      () => {},
      () => {
        this.isFavourite = !this.isFavourite;
      }
    );
  }
}
