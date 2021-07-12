import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { StepDirective } from './step.directive';

import { StepperComponent } from './stepper.component';

@Component({
  selector: 'tsl-stepper-test',
  template: `<tsl-stepper>
    <ng-template *ngFor="let step of steps" step>
      <div></div>
    </ng-template>
  </tsl-stepper>`,
})
class TestWrapperComponent {
  public steps = new Array(7);
}

describe('StepperComponent', () => {
  let component: StepperComponent;
  let fixture: ComponentFixture<TestWrapperComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [StepperComponent, TestWrapperComponent, StepDirective],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TestWrapperComponent);
    component = fixture.debugElement.children[0].componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('when we have defined steps...', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    it('should show all the slides', () => {
      expect(component.steps.length).toBe(7);
    });

    it('should mark the active id of first slide', () => {
      expect(component.activeId).toBe(0);
    });

    describe('and we trigger for the next step...', () => {
      describe('and we can NOT go next because is the last step', () => {
        beforeEach(() => {
          spyOn(component.isInLastStep, 'emit').and.callThrough();

          component.activeId = 7;
          component.goNext();
        });

        it('should stay on the same page', () => {
          expect(component.activeId).toBe(7);
        });

        it('should emit that we are on the last step', () => {
          expect(component.isInLastStep.emit).toHaveBeenCalledTimes(1);
        });
      });

      describe('and we can go next because is NOT the last step', () => {
        beforeEach(() => {
          spyOn(component.isInLastStep, 'emit');

          component.activeId = 0;
          component.goNext();
        });

        it('should go to the next step', () => {
          expect(component.activeId).toBe(1);
        });

        it('should NOT emit that we are on the last step', () => {
          expect(component.isInLastStep.emit).not.toHaveBeenCalled();
        });
      });
    });

    describe('and we trigger for the previous step...', () => {
      describe('and we can NOT go back because is the first step', () => {
        beforeEach(() => {
          component.activeId = 0;
          component.goBack();
        });

        it('should stay on the same page', () => {
          expect(component.activeId).toBe(0);
        });
      });

      describe('and we can go back because is NOT the first step', () => {
        beforeEach(() => {
          component.activeId = 3;
          component.goBack();
        });

        it('should go back to the previous step', () => {
          expect(component.activeId).toBe(2);
        });
      });
    });
  });
});
