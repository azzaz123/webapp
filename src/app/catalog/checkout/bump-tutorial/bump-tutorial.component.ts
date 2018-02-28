import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import * as _ from 'lodash';
import { TutorialService } from '../../../core/tutorial/tutorial.service';
import { EventService } from '../../../core/event/event.service';
import { BumpTutorialService } from "./bump-tutorial.service";

export enum KEY_CODE {
  RIGHT_ARROW = 39,
  LEFT_ARROW = 37,
  ESC = 27
}

@Component({
  selector: 'tsl-bump-tutorial',
  templateUrl: './bump-tutorial.component.html',
  styleUrls: ['./bump-tutorial.component.scss']
})
export class BumpTutorialComponent implements OnInit, OnDestroy {

  public dots: number;
  public hidden: boolean = true;

  constructor(public tutorialService: BumpTutorialService,
              private eventService: EventService) {
    this.dots = _.range(this.tutorialService.maxSteps);
  }

  ngOnInit() {
    this.eventService.subscribe(EventService.SHOW_BUMP_TUTORIAL, () => this.showBumpTutorial());
  }
  
  ngOnDestroy() {
    this.tutorialService.resetStep();
  }

  public nextStep(): void {
    this.tutorialService.nextStep();
  }

  public showBumpTutorial(): void {
    this.hidden = false;
  }

  public hideBumpTutorial(): void {
    this.hidden = true;
  }

  @HostListener('window:keyup', ['$event']) keyEvent(event: KeyboardEvent) {
    if (event.keyCode === KEY_CODE.RIGHT_ARROW) {
      this.tutorialService.nextStep();
    }
    if (event.keyCode === KEY_CODE.LEFT_ARROW) {
      this.tutorialService.prevStep();
    }
    if (event.keyCode === KEY_CODE.ESC) {
      this.hideBumpTutorial();
    }
  }

}
