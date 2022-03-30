import { Component, EventEmitter, Input, OnDestroy, Output } from '@angular/core';
import { PublicProfileService } from '@public/features/public-profile/core/services/public-profile.service';
import { Subscription } from 'rxjs/internal/Subscription';
import { take } from 'rxjs/operators';
import { LOGIN_SOURCE } from '@public/shared/components/item-card-list/enums/login-source.enum';

@Component({
  selector: 'tsl-favourite-user',
  templateUrl: './favourite-user.component.html',
  styleUrls: ['./favourite-user.component.scss'],
})
export class FavouriteUserComponent implements OnDestroy {
  @Input() isFavourite: boolean = false;
  @Input() userId: string;
  @Output() userFavouriteChanged: EventEmitter<boolean> = new EventEmitter();

  subscriptions: Subscription[] = [];
  public readonly clickFavLoginSource = LOGIN_SOURCE.FAVORITE_USER;

  constructor(private publicProfileService: PublicProfileService) {}

  toggleFavourite(): void {
    this.isFavourite = !this.isFavourite;

    this.subscriptions.push(
      (this.isFavourite ? this.publicProfileService.markAsFavourite(this.userId) : this.publicProfileService.unmarkAsFavourite(this.userId))
        .pipe(take(1))
        .subscribe(
          () => {
            this.userFavouriteChanged.emit(this.isFavourite);
          },
          () => {
            this.isFavourite = !this.isFavourite;
          }
        )
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription: Subscription) => subscription.unsubscribe());
  }
}
