import { Component, OnInit, OnDestroy, HostListener, EventEmitter, Input } from '@angular/core';
import * as _ from 'lodash';
import { BumpTutorialService } from './bump-tutorial.service';

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
export class BumpTutorialComponent implements OnDestroy {

  public dots: number;
  public hidden = true;

  constructor(public tutorialService: BumpTutorialService) {
    this.dots = _.range(this.tutorialService.maxSteps);
  }

  ngOnDestroy() {
    this.tutorialService.resetStep();
  }

  public show(): void {
    this.hidden = false;
  }

  public hide(): void {
    this.hidden = true;
    this.tutorialService.resetStep();
  }

  @HostListener('window:keyup', ['$event']) keyEvent(event: KeyboardEvent) {
    if (event.keyCode === KEY_CODE.RIGHT_ARROW) {
      this.tutorialService.nextStep();
    }
    if (event.keyCode === KEY_CODE.LEFT_ARROW) {
      this.tutorialService.prevStep();
    }
    if (event.keyCode === KEY_CODE.ESC) {
      this.hide();
    }
  }

}