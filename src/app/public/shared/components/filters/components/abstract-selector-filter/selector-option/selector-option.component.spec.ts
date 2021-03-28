import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectorOptionComponent } from './selector-option.component';
import { SvgIconComponent } from '@core/svg-icon/svg-icon/svg-icon.component';
import { Component, DebugElement, Input } from '@angular/core';
import { By } from '@angular/platform-browser';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { SelectorOptionIcon } from './interfaces/selector-option-icon.interface';
import spyOn = jest.spyOn;

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'test-selector-option',
  template: ` <tsl-selector-option [label]="label" [icon]="icon" [sublabel]="sublabel" [isActive]="isActive"> </tsl-selector-option> `,
})
class TestSelectorOptionComponent {
  @Input() label: string;
  @Input() icon: SelectorOptionIcon;
  @Input() sublabel: string;
  @Input() isActive: boolean;
}

describe('SelectorOptionComponent', () => {
  let component: SelectorOptionComponent;
  let testComponent: TestSelectorOptionComponent;
  let debugElement: DebugElement;
  let fixture: ComponentFixture<TestSelectorOptionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [TestSelectorOptionComponent, SelectorOptionComponent, SvgIconComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TestSelectorOptionComponent);
    testComponent = fixture.componentInstance;
    debugElement = fixture.debugElement;
    component = debugElement.query(By.directive(SelectorOptionComponent)).componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('when is clicked', () => {
    it('should emit click event', () => {
      spyOn(component.onClick, 'emit');

      debugElement.query(By.css('.SelectorOption')).nativeElement.click();

      expect(component.onClick.emit).toHaveBeenCalledTimes(1);
    });
  });

  describe('when option', () => {
    describe('... is active', () => {
      beforeEach(() => {
        testComponent.isActive = true;
        fixture.detectChanges();
      });
      it('should add active styles', () => {
        const activeOption = debugElement.query(By.css('.SelectorOption__active'));

        expect(activeOption).toBeTruthy();
      });
    });

    describe('... has icon', () => {
      const activeIcon = '/assets/icons/categories/selected/All.svg';
      const notActiveIcon = '/assets/icons/categories/stroke/All.svg';
      beforeEach(() => {
        testComponent.icon = {
          stroke: notActiveIcon,
          selected: activeIcon,
        };
        fixture.detectChanges();
      });
      it('should show icon', () => {
        const icon = debugElement.query(By.directive(SvgIconComponent));

        expect(icon).toBeTruthy();
      });

      describe('and is not active', () => {
        it('should have not active icon', () => {
          const iconSrc = debugElement.query(By.directive(SvgIconComponent)).componentInstance.src;

          expect(iconSrc).toBe(notActiveIcon);
        });
      });

      describe('and is active', () => {
        it('should have active icon', () => {
          const icon = debugElement.query(By.directive(SvgIconComponent)).componentInstance.src;

          expect(icon).toBe(notActiveIcon);
        });
      });
    });

    describe('... does not have icon', () => {
      it('should not show icon', () => {
        const icon = debugElement.query(By.directive(SvgIconComponent));

        expect(icon).toBeFalsy();
      });
    });

    describe('... has sublabel', () => {
      beforeEach(() => {
        testComponent.sublabel = 'sublabel';
        fixture.detectChanges();
      });

      it('should show sublabel', () => {
        const sublabel = debugElement.query(By.css('.SelectorOption__sublabel'));

        expect(sublabel).toBeTruthy();
      });

      describe('and has icon', () => {
        beforeEach(() => {
          testComponent.icon = { stroke: '' };
          fixture.detectChanges();
        });

        it('should add with icon styles', () => {
          const sublabelWithIcon = debugElement.query(By.css('.SelectorOption__sublabel-with-icon'));

          expect(sublabelWithIcon).toBeTruthy();
        });
      });
    });

    describe('... does not have sublabel', () => {
      it('should not show sublabel', () => {
        const sublabel = debugElement.query(By.css('.SelectorOption__sublabel'));

        expect(sublabel).toBeFalsy();
      });
    });
  });
});
