import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ContentChildren, Input, QueryList } from '@angular/core';
import { StepDirective } from './step.directive';

@Component({
  selector: 'tsl-stepper',
  templateUrl: './stepper.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./stepper.component.scss'],
})
export class StepperComponent {
  @ContentChildren(StepDirective) sections: QueryList<StepDirective>;
  @Input() initialIndex = 0;

  public steps: StepDirective[];
  public activeId: number;

  constructor(private cdr: ChangeDetectorRef) {}

  ngAfterContentInit() {
    this.steps = this.sections.toArray();
    this.activeId = this.initialIndex;
    this.cdr.detectChanges();
  }

  public goBack(): void {
    if (this.havePreviousSlide()) {
      this.activeId = --this.activeId;
    }
  }

  public goNext(): void {
    if (this.haveNextSlide()) {
      this.activeId = ++this.activeId;
    }
  }

  private havePreviousSlide(): boolean {
    return this.activeId - 1 > -1;
  }

  private haveNextSlide(): boolean {
    return this.activeId + 1 <= this.steps.length;
  }
}
