import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectParentOptionComponent } from './select-parent-option.component';
import { Component, DebugElement, Input } from '@angular/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { SvgIconComponent } from '@shared/svg-icon/svg-icon.component';
import { By } from '@angular/platform-browser';
import { SelectOptionComponent } from '@shared/form/components/select/select-option/select-option.component';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'test-select-option',
  template: ` <tsl-select-parent-option
    [label]="label"
    [sublabel]="sublabel"
    [icon]="icon"
    [isClearable]="isClearable"
  ></tsl-select-parent-option>`,
})
class TestSelectParentOptionComponent {
  @Input() label: string;
  @Input() icon: string;
  @Input() sublabel: string;
  @Input() isClearable: boolean;
}

describe('SelectParentOptionComponent', () => {
  let testComponent: TestSelectParentOptionComponent;
  let debugElement: DebugElement;
  let component: SelectParentOptionComponent;
  let fixture: ComponentFixture<TestSelectParentOptionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [TestSelectParentOptionComponent, SelectParentOptionComponent, SvgIconComponent, SelectOptionComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TestSelectParentOptionComponent);
    testComponent = fixture.componentInstance;
    debugElement = fixture.debugElement;
    component = debugElement.query(By.directive(SelectParentOptionComponent)).componentInstance;
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
      const arrowIcon = debugElement.query(By.css('.SelectParentOption__icon[src="/assets/icons/arrow-right.svg"]'));

      expect(arrowIcon).toBeTruthy();
    });
  });

  describe('when parent option is clearable', () => {
    const crossPredicate = By.css('.SelectParentOption__icon[src="/assets/icons/cross.svg"]');

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
