import { Component, OnDestroy, OnInit } from '@angular/core';
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
export class TutorialComponent implements OnInit, OnDestroy {

  public dots = _.range(6);

  constructor(public tutorialService: TutorialService) { }

  ngOnInit() {
    this.tutorialService.setDisplayed();
  }

  ngOnDestroy() {
    this.tutorialService.resetStep();
  }

  nextStep() {
    this.tutorialService.nextStep();
  }

}
