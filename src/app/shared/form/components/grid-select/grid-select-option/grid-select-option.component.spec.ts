import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GridSelectOptionComponent } from './grid-select-option.component';
import { CommonModule } from '@angular/common';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { SvgIconModule } from '@core/svg-icon/svg-icon.module';
import { Component, DebugElement, Input } from '@angular/core';
import { By } from '@angular/platform-browser';
import { SvgIconComponent } from '@core/svg-icon/svg-icon/svg-icon.component';
import { ShouldHideIconPipe } from './pipes/should-hide-icon.pipe';
import { IsComplexIconPipe } from './pipes/is-complex-icon.pipe';
import { FormComplexIcon } from '@shared/form/interfaces/form-complex-icon.interface';

@Component({
  selector: 'tsl-test-component',
  template: `<tsl-grid-select-option
    [icon]="icon"
    [isActive]="isActive"
    [label]="label"
    [isBig]="isBig"
    [isHoverMainColor]="isHoverMainColor"
  ></tsl-grid-select-option>`,
})
class TestComponent {
  @Input() icon: string | FormComplexIcon;
  @Input() label?: string;
  @Input() isActive?: boolean;
  @Input() isBig?: boolean;
  @Input() isHoverMainColor?: boolean;
}

describe('GridSelectOptionComponent', () => {
  let testComponent: TestComponent;
  let component: GridSelectOptionComponent;
  let debugElement: DebugElement;
  let fixture: ComponentFixture<TestComponent>;

  const labelPredicate = By.css('.GridSelectOption__label');
  const iconPredicate = By.directive(SvgIconComponent);

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TestComponent, GridSelectOptionComponent, ShouldHideIconPipe, IsComplexIconPipe],
      imports: [CommonModule, HttpClientTestingModule, SvgIconModule],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TestComponent);
    debugElement = fixture.debugElement;
    testComponent = fixture.componentInstance;
    component = debugElement.query(By.directive(GridSelectOptionComponent)).componentInstance;
  });

  describe('independently from icon configuration', () => {
    beforeEach(() => {
      testComponent.icon = 'icon.svg';
      fixture.detectChanges();
    });

    it('should create', () => {
      expect(component).toBeTruthy();
    });

    describe('when has no label', () => {
      beforeEach(() => {
        testComponent.label = undefined;
        fixture.detectChanges();
      });
      it('should show no label', () => {
        const label = debugElement.query(labelPredicate);

        expect(label).toBeFalsy();
      });
    });

    describe('when has label', () => {
      beforeEach(() => {
        testComponent.label = 'My label';
        fixture.detectChanges();
      });
      it('should show label', () => {
        const label = debugElement.query(labelPredicate);

        expect(label).toBeTruthy();
      });
    });

    describe('when is not big', () => {
      beforeEach(() => {
        testComponent.isBig = false;
        fixture.detectChanges();
      });
      it('should show icon smaller', () => {
        const icon: SvgIconComponent = debugElement.query(iconPredicate).componentInstance;

        expect(icon.height).toEqual(20);
        expect(icon.width).toEqual(20);
      });
    });

    describe('when is big', () => {
      beforeEach(() => {
        testComponent.isBig = true;
        fixture.detectChanges();
      });
      it('show icon bigger', () => {
        const icon: SvgIconComponent = debugElement.query(iconPredicate).componentInstance;

        expect(icon.height).toEqual(30);
        expect(icon.width).toEqual(30);
      });
    });
  });

  describe('when is simple icon', () => {
    beforeEach(() => {
      testComponent.icon = 'icon.svg';
      fixture.detectChanges();
    });

    describe('when is active', () => {
      beforeEach(() => {
        testComponent.isActive = true;
        testComponent.label = 'My label';
        fixture.detectChanges();
      });
      it('should apply active classes', () => {
        const activeIcon = debugElement.query(By.css('.GridSelectOption__icon--active'));
        const activeLabel = debugElement.query(By.css('.GridSelectOption__label--active'));

        expect(activeIcon).toBeTruthy();
        expect(activeLabel).toBeTruthy();
      });
    });
  });

  describe('when is complex icon', () => {
    beforeEach(() => {
      testComponent.icon = {
        standard: 'standard.svg',
        hover: 'hover.svg',
        active: 'active.svg',
      };
    });

    it('should hide hover and active icon by default', () => {
      fixture.detectChanges();

      expect(getHiddenIcons()).toEqual(['hover.svg', 'active.svg']);
    });

    describe('and is active on init', () => {
      beforeEach(() => {
        testComponent.isActive = true;
      });

      it('should hide standard and hover icon by default', () => {
        fixture.detectChanges();

        expect(getHiddenIcons()).toEqual(['standard.svg', 'hover.svg']);
      });
    });

    describe('and active changes on parent', () => {
      it('should hide standard and hover after change', () => {
        fixture.detectChanges();

        testComponent.isActive = true;
        fixture.detectChanges();

        expect(getHiddenIcons()).toEqual(['standard.svg', 'hover.svg']);
      });
    });

    describe('on hover', () => {
      beforeEach(() => {
        fixture.detectChanges();
      });
      describe('enters', () => {
        it('should hide standard and active', () => {
          component.handleMouseEnter();
          fixture.detectChanges();

          expect(getHiddenIcons()).toEqual(['standard.svg', 'active.svg']);
        });
      });

      describe('leaves', () => {
        it('should hide standard and hover', () => {
          component.handleMouseEnter();
          fixture.detectChanges();

          component.handleMouseLeave();
          fixture.detectChanges();

          expect(getHiddenIcons()).toEqual(['hover.svg', 'active.svg']);
        });
      });

      describe('but it is active', () => {
        beforeEach(() => {
          testComponent.isActive = true;
          fixture.detectChanges();
        });
        describe('and enters', () => {
          it('should hide standard and hover', () => {
            component.handleMouseEnter();
            fixture.detectChanges();

            expect(getHiddenIcons()).toEqual(['standard.svg', 'hover.svg']);
          });
        });

        describe('and leaves', () => {
          it('should hide standard and hover', () => {
            component.handleMouseEnter();
            fixture.detectChanges();

            component.handleMouseLeave();
            fixture.detectChanges();

            expect(getHiddenIcons()).toEqual(['standard.svg', 'hover.svg']);
          });
        });
      });
    });

    function getHiddenIcons(): string[] {
      return debugElement
        .queryAll(By.css('.GridSelectOption__icon.d-none'))
        .map((debug) => debug.componentInstance)
        .map((icon) => icon.src);
    }
  });
});
