import { Component, OnDestroy } from '@angular/core';
import { TutorialService } from '../core/tutorial/tutorial.service';
import { animate, style, transition, trigger } from '@angular/animations';
import * as _ from 'lodash';

@Component({
  selector: 'tsl-tutorial',
  templateUrl: './tutorial.component.html',
  styleUrls: ['./tutorial.component.scss'],
  animations: [
    trigger(
      'fade', [
        transition(':enter', [
          style({opacity: 0}),
          animate('500ms', style({opacity: 1}))
        ]),
        transition(':leave', [
          style({opacity: 1}),
          animate('500ms', style({opacity: 0}))
        ])
      ]
    )
  ],
})
export class TutorialComponent implements OnDestroy {

  public dots = _.range(6);

  constructor(public tutorialService: TutorialService) { }

  ngOnDestroy() {
    this.tutorialService.step = 0;
  }

  nextStep() {
    this.tutorialService.step++;
  }

  exit() {

  }

}
