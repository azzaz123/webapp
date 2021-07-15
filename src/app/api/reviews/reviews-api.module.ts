import { NgModule } from '@angular/core';
import { ReviewsApiService } from '@api/reviews/reviews-api.service';
import { ReviewsHttpService } from '@api/reviews/http/reviews-http.service';

@NgModule({
  providers: [ReviewsApiService, ReviewsHttpService],
})
export class ReviewsApiModule {}
