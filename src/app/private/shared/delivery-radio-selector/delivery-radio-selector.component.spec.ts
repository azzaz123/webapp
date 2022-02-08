import { Component, DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DeliveryRadioOptionDirective } from './delivery-radio-option.directive';
import { DeliveryRadioSelectorComponent } from './delivery-radio-selector.component';

@Component({
  selector: 'tsl-delivery-radio-selector-test',
  template: `<tsl-delivery-radio-selector>
    <ng-template *ngFor="let option of options" tslDeliveryRadioOption>
      <div></div>
    </ng-template>
  </tsl-delivery-radio-selector>`,
})
class TestWrapperComponent {
  public options = new Array(5);
}

describe('DeliveryRadioSelectorComponent', () => {
  const selectedOptionPosition: number = 3;
  const newSelectedOptionPosition: number = 0;
  const newSelectedOptionPosition2: number = 1;
  const inputRadioSelector: string = '#inputRadio';

  let component: DeliveryRadioSelectorComponent;
  let fixture: ComponentFixture<TestWrapperComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DeliveryRadioSelectorComponent, TestWrapperComponent, DeliveryRadioOptionDirective],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TestWrapperComponent);
    component = fixture.debugElement.children[0].componentInstance;
    spyOn(component.selectedIdChanged, 'emit');
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('when we have defined options...', () => {
    it('should show all the slides', () => {
      fixture.detectChanges();

      expect(component.options.length).toBe(5);
    });

    describe('and we have a selected position defined', () => {
      beforeEach(() => {
        component.selectedId = selectedOptionPosition;

        fixture.detectChanges();
      });

      it('should mark as checked the selected one', () => {
        const options: DebugElement[] = fixture.debugElement.queryAll(By.css(inputRadioSelector));

        options.forEach((option: DebugElement, index: number) => {
          const isOptionChecked: boolean = option.nativeElement.checked;
          if (index === selectedOptionPosition) {
            expect(isOptionChecked).toBeTruthy();
          } else {
            expect(isOptionChecked).toBeFalsy();
          }
        });
      });

      describe('and we change the selected value...', () => {
        beforeEach(() => {
          const firstOption: DebugElement = fixture.debugElement.queryAll(By.css(inputRadioSelector))[newSelectedOptionPosition];
          firstOption.triggerEventHandler('change', { newSelectedOptionPosition });
        });

        it('should emit the new selected id', () => {
          expect(component.selectedIdChanged.emit).toHaveBeenCalledWith(newSelectedOptionPosition);
          expect(component.selectedIdChanged.emit).toHaveBeenCalledTimes(1);
        });
      });
    });

    describe(`and we DON'T have a selected position defined`, () => {
      beforeEach(() => {
        component.selectedId = null;

        fixture.detectChanges();
      });

      it('should NOT mark as checked any radio', () => {
        const options: DebugElement[] = fixture.debugElement.queryAll(By.css(inputRadioSelector));

        options.forEach((option: DebugElement) => {
          expect(option.nativeElement.checked).toBeFalsy();
        });
      });

      describe('and we change the selected value...', () => {
        beforeEach(() => {
          const firstOption: DebugElement = fixture.debugElement.queryAll(By.css(inputRadioSelector))[newSelectedOptionPosition2];
          firstOption.triggerEventHandler('change', { newSelectedOptionPosition2 });
        });

        it('should emit the new selected id', () => {
          expect(component.selectedIdChanged.emit).toHaveBeenCalledWith(newSelectedOptionPosition2);
          expect(component.selectedIdChanged.emit).toHaveBeenCalledTimes(1);
        });
      });
    });
  });

  describe(`when we DON'T have defined options`, () => {
    it('should NOT show any slides', () => {
      fixture.componentInstance.options = [];

      fixture.detectChanges();

      expect(component.options.length).toBe(0);
    });
  });
});
