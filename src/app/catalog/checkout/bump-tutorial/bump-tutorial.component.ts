import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { BumpTutorialService } from './bump-tutorial.service';
import { Observable } from 'rxjs/Observable';
import * as _ from 'lodash';

export enum KEY_CODE {
  RIGHT_ARROW = 39,
  LEFT_ARROW = 37,
}

@Component({
  selector: 'tsl-bump-tutorial',
  templateUrl: './bump-tutorial.component.html',
  styleUrls: ['./bump-tutorial.component.scss']
})
export class BumpTutorialComponent implements OnInit, OnDestroy {

  public dots: number = 2;
  public hidden: boolean = false;

  constructor(public bumpTutorialService: BumpTutorialService) {
    this.dots = _.range(this.bumpTutorialService.maxSteps);
  }

  ngOnInit() {
    this.bumpTutorialService.setDisplayed();
  }

  ngOnDestroy() {
    this.bumpTutorialService.resetStep();
  }

  nextStep() {
    this.bumpTutorialService.nextStep();
  }

  public showTutorial(): Observable<boolean> {
    return this.bumpTutorialService.isAlreadyDisplayed()
      .map((displayed: boolean) => {
        return displayed;
      });
  }

  public hideTutorial(): void {
    this.hidden = true;
  }

  @HostListener('window:keyup', ['$event']) keyEvent(event: KeyboardEvent) {
    if (event.keyCode === KEY_CODE.RIGHT_ARROW) {
      this.bumpTutorialService.nextStep();
    }
    if (event.keyCode === KEY_CODE.LEFT_ARROW) {
      this.bumpTutorialService.prevStep();
    }
  }

}
