import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { TutorialService } from '../core/tutorial/tutorial.service';
import { animate, style, transition, trigger } from '@angular/animations';
import * as _ from 'lodash';
import { Router } from '@angular/router';

export enum KEY_CODE {
  RIGHT_ARROW = 39,
  LEFT_ARROW = 37,
  ESC = 27
}
;

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
export class TutorialComponent implements OnInit, OnDestroy {

  public dots: number;

  constructor(public tutorialService: TutorialService,
              private router: Router) {
    this.dots = _.range(this.tutorialService.maxSteps);
  }

  ngOnInit() {
    this.tutorialService.setDisplayed();
  }

  ngOnDestroy() {
    this.tutorialService.resetStep();
  }

  nextStep() {
    this.tutorialService.nextStep();
  }

  @HostListener('window:keyup', ['$event']) keyEvent(event: KeyboardEvent) {
    if (event.keyCode === KEY_CODE.RIGHT_ARROW) {
      this.tutorialService.nextStep();
    }
    if (event.keyCode === KEY_CODE.LEFT_ARROW) {
      this.tutorialService.prevStep();
    }
    if (event.keyCode === KEY_CODE.ESC) {
      this.router.navigate(['/catalog/list']);
    }
  }

}
