import { Component, OnInit, Input } from '@angular/core';
import { MyReviews } from "../../core/my-reviews/my-reviews";

@Component({
  selector: 'tsl-review-item',
  templateUrl: './review-item.component.html',
  styleUrls: ['./review-item.component.scss']
})
export class ReviewItemComponent implements OnInit {

  @Input() review: MyReviews;

  constructor() { }

  ngOnInit() {
  }

}
