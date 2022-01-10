import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { StarRate } from './star-rate.interface';

@Component({
  selector: 'tsl-stars-rate',
  templateUrl: './stars-rate.component.html',
  styleUrls: ['./stars-rate.component.scss'],
})
export class StarsRateComponent implements OnInit {
  @Output() handleOnChange: EventEmitter<number> = new EventEmitter();
  public starsArray: StarRate[] = [];
  private score: number;

  constructor() {}

  ngOnInit(changes?: any) {
    for (let i = 0; i < 5; i++) {
      this.starsArray.push({
        type: 'empty',
        score: i + 1,
      });
    }
  }

  public onHover(score: number) {
    this.starsArray.forEach((star) => {
      if (star.score <= score) {
        star.type = 'full';
      } else {
        star.type = 'empty';
      }
    });
  }

  public resetHovered() {
    this.starsArray.forEach((star: StarRate) => {
      if (star.score <= this.score) {
        star.type = 'full';
      } else {
        star.type = 'empty';
      }
    });
  }

  public setScore(score: number) {
    this.score = score;
    this.handleOnChange.emit(score);
  }
}
