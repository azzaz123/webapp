import { Component, Input, OnChanges } from '@angular/core';
import { Star } from './star.interface';

const SCORING_MAX_RATING = 100;
const STARS_MAX_VALUE = 5;

@Component({
  selector: 'tsl-stars',
  templateUrl: './stars.component.html',
  styleUrls: ['./stars.component.scss'],
})
export class StarsComponent implements OnChanges {
  @Input() stars: number;
  @Input() normalized = true;
  public starsArray: Star[];

  constructor() {}

  ngOnChanges(changes?: any) {
    this.starsArray = [];
    if (this.normalized) {
      for (let i = 0; i < 5; i++) {
        this.starsArray.push({
          active: i < this.stars,
        });
      }
    } else {
      this.stars = this.normalize(this.stars);
      for (let i = 0; i < Math.floor(this.stars); i++) {
        this.starsArray.push({
          active: true,
        });
      }
      if (this.stars % 1 === 0.5) {
        this.starsArray.push({
          active: true,
          half: true,
        });
      }
      const emptyStars = 5 - this.starsArray.length;
      for (let i = 0; i < emptyStars; i++) {
        this.starsArray.push({
          active: false,
        });
      }
    }
  }

  private normalize(score) {
    const rating = (score / SCORING_MAX_RATING) * STARS_MAX_VALUE;
    const intPart = Math.floor(rating);
    const fractionalPart = +(rating % 1).toFixed(2);
    if (fractionalPart < 0.25) {
      return intPart;
    }
    if (0.25 <= fractionalPart && fractionalPart < 0.75) {
      return intPart + 0.5;
    }
    return intPart + 1;
  }
}
