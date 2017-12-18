import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReviewsRoutingModule, reviewsRoutedComponents } from "./reviews.routes";
import { CoreModule } from "../core/core.module";
import { InfiniteScrollModule } from "angular2-infinite-scroll/angular2-infinite-scroll";
import { MdIconModule } from '@angular/material';
import { ReviewItemComponent } from './review-item/review-item.component';
import { MyReviewsService } from "../core/my-reviews/my-reviews.service";
import { UtilsModule } from 'shield';

@NgModule({
  imports: [
    CommonModule,
    ReviewsRoutingModule,
    CoreModule,
    MdIconModule,
    InfiniteScrollModule,
    UtilsModule
  ],
  declarations: [
    reviewsRoutedComponents,
    ReviewItemComponent
  ],
  providers: [
    MyReviewsService
  ]
})
export class ReviewsModule { }
