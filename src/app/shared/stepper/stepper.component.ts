import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ContentChildren,
  Input,
  Output,
  QueryList,
  EventEmitter,
  AfterContentInit,
} from '@angular/core';
import { StepDirective } from './step.directive';

@Component({
  selector: 'tsl-stepper',
  templateUrl: './stepper.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StepperComponent implements AfterContentInit {
  @ContentChildren(StepDirective) sections: QueryList<StepDirective>;
  @Input() activeId = 0;
  @Output() isInLastStep: EventEmitter<void> = new EventEmitter();

  public steps: StepDirective[];

  constructor(private cdr: ChangeDetectorRef) {}

  ngAfterContentInit() {
    this.steps = this.sections.toArray();
    this.cdr.detectChanges();
    this.emitLastStep();
  }

  public goBack(): void {
    if (this.havePreviousSlide()) {
      this.activeId = --this.activeId;
      this.cdr.detectChanges();
    }
  }

  public goNext(): void {
    if (this.haveNextSlide()) {
      this.activeId = ++this.activeId;
      this.cdr.detectChanges();
    }

    this.emitLastStep();
  }

  private emitLastStep(): void {
    if (!this.haveNextSlide()) {
      this.isInLastStep.emit();
    }
  }

  private havePreviousSlide(): boolean {
    return this.activeId - 1 > -1;
  }

  private haveNextSlide(): boolean {
    return this.activeId + 1 <= this.steps.length;
  }
}
