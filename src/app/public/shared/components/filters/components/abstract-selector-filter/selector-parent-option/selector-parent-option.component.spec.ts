import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectorParentOptionComponent } from './selector-parent-option.component';
import { Component, DebugElement, Input } from '@angular/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { SvgIconComponent } from '@core/svg-icon/svg-icon/svg-icon.component';
import { By } from '@angular/platform-browser';
import { SelectorOptionComponent } from '@public/shared/components/filters/components/abstract-selector-filter/selector-option/selector-option.component';
import spyOn = jest.spyOn;

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'test-selector-option',
  template: `<tsl-selector-parent-option
    [label]="label"
    [sublabel]="sublabel"
    [icon]="icon"
    [isClearable]="isClearable"
  ></tsl-selector-parent-option>`,
})
class TestSelectorParentOptionComponent {
  @Input() label: string;
  @Input() icon: string;
  @Input() sublabel: string;
  @Input() isClearable: boolean;
}

describe('SelectorParentOptionComponent', () => {
  let testComponent: TestSelectorParentOptionComponent;
  let debugElement: DebugElement;
  let component: SelectorParentOptionComponent;
  let fixture: ComponentFixture<TestSelectorParentOptionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [TestSelectorParentOptionComponent, SelectorParentOptionComponent, SvgIconComponent, SelectorOptionComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TestSelectorParentOptionComponent);
    testComponent = fixture.componentInstance;
    debugElement = fixture.debugElement;
    component = debugElement.query(By.directive(SelectorParentOptionComponent)).componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('when parent option is not clearable', () => {
    beforeEach(() => {
      testComponent.isClearable = false;
      fixture.detectChanges();
    });
    it('should show up arrow', () => {
      const arrowIcon = debugElement.query(By.css('.SelectorParentOption__icon[src="/assets/icons/arrow-right.svg"]'));

      expect(arrowIcon).toBeTruthy();
    });
  });

  describe('when parent option is clearable', () => {
    const crossPredicate = By.css('.SelectorParentOption__icon[src="/assets/icons/cross.svg"]');

    beforeEach(() => {
      testComponent.isClearable = true;
      fixture.detectChanges();
    });

    it('should show up cross', () => {
      const crossIcon = debugElement.query(crossPredicate);

      expect(crossIcon).toBeTruthy();
    });

    describe('and clear cross is clicked', () => {
      it('should emit clear', () => {
        spyOn(component.clear, 'emit');
        debugElement.query(crossPredicate).nativeElement.click();

        expect(component.clear.emit).toHaveBeenCalledTimes(1);
      });
    });
  });
});
