import { Component, Input, OnDestroy } from '@angular/core';
import { PublicProfileService } from '@public/features/public-profile/core/services/public-profile.service';
import { take } from 'rxjs/internal/operators/take';
import { Subscription } from 'rxjs/internal/Subscription';

@Component({
  selector: 'tsl-favourite-user',
  templateUrl: './favourite-user.component.html',
  styleUrls: ['./favourite-user.component.scss'],
})
export class FavouriteUserComponent implements OnDestroy {
  @Input() isFavourite: boolean = false;
  @Input() userId: string;

  subscriptions: Subscription[] = [];

  constructor(private publicProfileService: PublicProfileService) {}

  toggleFavourite(): void {
    this.isFavourite = !this.isFavourite;

    this.subscriptions.push(
      (this.isFavourite
        ? this.publicProfileService.markAsFavourite(this.userId)
        : this.publicProfileService.unmarkAsFavourite(this.userId)
      )
        .pipe(take(1))
        .subscribe(
          () => {},
          () => {
            this.isFavourite = !this.isFavourite;
          }
        )
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription: Subscription) =>
      subscription.unsubscribe()
    );
  }
}
