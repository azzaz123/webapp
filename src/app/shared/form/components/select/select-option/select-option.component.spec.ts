import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectOptionComponent } from './select-option.component';
import { SvgIconComponent } from '@shared/svg-icon/svg-icon.component';
import { Component, DebugElement, Input } from '@angular/core';
import { By } from '@angular/platform-browser';
import { HttpClientTestingModule } from '@angular/common/http/testing';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'test-select-option',
  template: ` <tsl-select-option [label]="label" [icon]="icon" [sublabel]="sublabel" [isActive]="isActive"></tsl-select-option> `,
})
class TestSelectOptionComponent {
  @Input() label: string;
  @Input() icon: string;
  @Input() sublabel: string;
  @Input() isActive: boolean;
}

describe('SelectOptionComponent', () => {
  let component: SelectOptionComponent;
  let testComponent: TestSelectOptionComponent;
  let debugElement: DebugElement;
  let fixture: ComponentFixture<TestSelectOptionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [TestSelectOptionComponent, SelectOptionComponent, SvgIconComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TestSelectOptionComponent);
    testComponent = fixture.componentInstance;
    debugElement = fixture.debugElement;
    component = debugElement.query(By.directive(SelectOptionComponent)).componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('when option', () => {
    describe('... is active', () => {
      beforeEach(() => {
        testComponent.isActive = true;
        fixture.detectChanges();
      });
      it('should add active styles', () => {
        const activeOption = debugElement.query(By.css('.SelectOption--active'));

        expect(activeOption).toBeTruthy();
      });
    });

    describe('... has icon', () => {
      beforeEach(() => {
        testComponent.icon = '/assets/icons/categories/selected/All.svg';
        fixture.detectChanges();
      });
      it('should show icon', () => {
        const icon = debugElement.query(By.directive(SvgIconComponent));

        expect(icon).toBeTruthy();
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
        const sublabel = debugElement.query(By.css('.SelectOption__sublabel'));

        expect(sublabel).toBeTruthy();
      });

      describe('and has icon', () => {
        beforeEach(() => {
          testComponent.icon = '/assets/icons/categories/selected/All.svg';
          fixture.detectChanges();
        });

        it('should add with icon styles', () => {
          const sublabelWithIcon = debugElement.query(By.css('.SelectOption__sublabel--with-icon'));

          expect(sublabelWithIcon).toBeTruthy();
        });
      });
    });

    describe('... does not have sublabel', () => {
      it('should not show sublabel', () => {
        const sublabel = debugElement.query(By.css('.SelectOption__sublabel'));

        expect(sublabel).toBeFalsy();
      });
    });
  });
});
