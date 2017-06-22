import { Component, Input, OnChanges } from '@angular/core';
import { Star } from './star.interface';

@Component({
  selector: 'tsl-stars',
  templateUrl: './stars.component.html',
  styleUrls: ['./stars.component.scss']
})
export class StarsComponent implements OnChanges {

  @Input() stars: Number;
  public starsArray: Star[];

  constructor() {
  }

  ngOnChanges(changes?: any) {
    this.starsArray = [];
    for (let i: number = 0; i < 5; i++) {
      this.starsArray.push({
        active: i < this.stars
      });
    }
  }

}
