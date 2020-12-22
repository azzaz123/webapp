import { Component, OnInit } from '@angular/core';
import { UserReviewsService } from '@public/features/public-profile/core/services/user-reviews/user-reviews.service';
import { PublicProfileService } from '@public/features/public-profile/core/services/public-profile.service';

@Component({
  selector: 'tsl-user-reviews',
  templateUrl: './user-reviews.component.html',
  styleUrls: ['./user-reviews.component.scss'],
})
export class UserReviewsComponent implements OnInit {
  public reviews = [];
  constructor(
    private publicProfileService: PublicProfileService,
    private userReviewsService: UserReviewsService
  ) {
    this.publicProfileService
      .getReviews('1kmzngw3g6n3')
      .subscribe((test: any) => {
        console.log(test);
        this.reviews = [
          {
            item: { category_id: 13100 },
            review: {
              date: 1456864940000,
              scoring: 100,
              comments: ' ',
              is_shipping_transaction: false,
            },
            user: {
              id: 'evjrdprn4l6k',
              micro_name: 'Irene R.',
              image: {
                original:
                  'http://cdn.wallapop.com/images/13/0b/hw/__/c13p19311167/i142695722.jpg?pictureSize=W1024',
                xsmall:
                  'http://cdn.wallapop.com/images/13/0b/hw/__/c13p19311167/i142695722.jpg?pictureSize=W320',
                small:
                  'http://cdn.wallapop.com/images/13/0b/hw/__/c13p19311167/i142695722.jpg?pictureSize=W320',
                large:
                  'http://cdn.wallapop.com/images/13/0b/hw/__/c13p19311167/i142695722.jpg?pictureSize=W800',
                medium:
                  'http://cdn.wallapop.com/images/13/0b/hw/__/c13p19311167/i142695722.jpg?pictureSize=W640',
                xlarge:
                  'http://cdn.wallapop.com/images/13/0b/hw/__/c13p19311167/i142695722.jpg?pictureSize=W1024',
                original_width: 1024,
                original_height: 1024,
              },
              web_slug: 'irene-19311167',
            },
            type: 'buy',
          },
        ];

        this.reviews = this.userReviewsService.mapReviews(this.reviews);
      });
  }

  ngOnInit(): void {}
}
