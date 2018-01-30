import { Component, OnDestroy, OnInit } from '@angular/core';
import { TutorialService } from '../core/tutorial/tutorial.service';
import { animate, state, style, transition, trigger } from '@angular/animations';

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
