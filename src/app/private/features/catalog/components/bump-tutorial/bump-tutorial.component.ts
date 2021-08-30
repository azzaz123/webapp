import { Component, HostListener, OnDestroy } from '@angular/core';
import { range } from 'lodash-es';
import { BumpTutorialService } from '../../core/services/bump-tutorial.service';

export enum KEY_CODE {
  RIGHT_ARROW = 39,
  LEFT_ARROW = 37,
  ESC = 27,
}

export const SLIDES_NUMBER = 2;

@Component({
  selector: 'tsl-bump-tutorial',
  templateUrl: './bump-tutorial.component.html',
  styleUrls: ['./bump-tutorial.component.scss'],
})
export class BumpTutorialComponent implements OnDestroy {
  public dots: number;
  public hidden = true;

  constructor(public tutorialService: BumpTutorialService) {
    this.dots = range(SLIDES_NUMBER);
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
}
