import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DebugElement, Predicate } from '@angular/core';
import { By } from '@angular/platform-browser';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CommonModule } from '@angular/common';
import { FilterTemplateComponent } from '@public/shared/components/filters/components/abstract-filter/filter-template/filter-template.component';
import { BubbleModule } from '@public/shared/components/bubble/bubble.module';
import { ButtonModule } from '@shared/button/button.module';
import { BubbleComponent } from '@public/shared/components/bubble/bubble.component';
import { FilterDropdownDirective } from './directives/filter-dropdown.directive';

describe('FilterTemplateComponent', () => {
  const bubbleSelector = By.css('.Bubble');

  let component: FilterTemplateComponent;
  let fixture: ComponentFixture<FilterTemplateComponent>;
  let debugElement: DebugElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, CommonModule, BubbleModule, ButtonModule],
      declarations: [FilterTemplateComponent, FilterDropdownDirective],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FilterTemplateComponent);
    component = fixture.componentInstance;
    debugElement = fixture.debugElement;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('When is bubble variant', () => {
    beforeEach(async () => {
      await setInputs({
        isBubble: true,
        label: 'My label',
      });
    });

    it('should render bubble component', () => {
      expectRender(bubbleSelector, true);
      expectRender(By.css('.TestExtendedContent'), false);
    });

    describe('on cancel click', () => {
      const cancelSelector = By.css('tsl-button .basic.basic-dark.btn-filter');

      it('should close modal', () => {
        debugElement.query(cancelSelector).nativeElement.click();

        expect(component.isDropdownOpen).toBe(false);
      });

      it('should emit cancel', () => {
        spyOn(component.cancel, 'emit');
        component.isDropdownOpen = true;
        debugElement.query(cancelSelector).nativeElement.click();

        expect(component.cancel.emit).toHaveBeenCalledTimes(1);
      });
    });

    describe('when clicked on the bubble', () => {
      it('should emit click', () => {
        spyOn(component.click, 'emit');
        debugElement.query(bubbleSelector).nativeElement.click();

        expect(component.click.emit).toHaveBeenCalledTimes(1);
      });
    });

    describe('and has no value', () => {
      it('should set active variant to the bubble', () => {
        expectRender(By.css('.Bubble--active'), true);
      });
    });

    describe('and has value', () => {
      beforeEach(async () => {
        await setInputs({
          hasValue: true,
        });
      });

      it('should set selected variant to the bubble', () => {
        expectRender(By.css('.Bubble--selected'), true);
      });
    });

    describe('and is dropdown', () => {
      let dropdown: DebugElement;
      beforeEach(async () => {
        await setInputs({
          isDropdown: true,
        });
        dropdown = fixture.debugElement.query(By.directive(FilterDropdownDirective));
      });

      describe('and dropdown state change', () => {
        it('should emit openStateChange', () => {
          component.isDropdownOpen = true;
          fixture.detectChanges();
          const dropdown = fixture.debugElement.query(By.directive(FilterDropdownDirective));
          spyOn(component.openStateChange, 'emit');

          dropdown.triggerEventHandler('openChange', true);

          expect(component.openStateChange.emit).toHaveBeenCalledTimes(1);
          expect(component.openStateChange.emit).toHaveBeenCalledWith(true);
        });
      });

      describe('when clicked on bubble', () => {
        it('should toggle dropdown', () => {
          spyOn(component, 'toggleDropdown').and.callThrough();
          debugElement.query(bubbleSelector).nativeElement.click();

          expect(component.toggleDropdown).toHaveBeenCalledTimes(1);
        });
      });

      describe('and dropdown is open', () => {
        beforeEach(async () => {
          component.isDropdownOpen = true;
          fixture.detectChanges();
          await fixture.whenStable();
        });

        it('should render developer warning content', () => {
          expectRender(By.css('.FilterTemplate--warn'), true);
        });

        describe('on cancel click', () => {
          it('should close dropdown', () => {
            debugElement.query(By.css('tsl-button .basic-dark')).nativeElement.click();

            expect(component.isDropdownOpen).toBe(false);
          });
        });

        describe('and has apply action', () => {
          const applySelector = By.css('tsl-button .btn-primary');
          beforeEach(async () => {
            await setInputs({
              hasApply: true,
            });
          });
          it('should render apply action', () => {
            expectRender(applySelector, true);
          });

          describe('on apply click', () => {
            it('should close modal', () => {
              debugElement.query(applySelector).nativeElement.click();

              expect(component.isDropdownOpen).toBe(false);
            });

            it('should emit apply', () => {
              spyOn(component.openStateChange, 'emit');
              component.isDropdownOpen = true;
              debugElement.query(applySelector).nativeElement.click();

              expect(component.openStateChange.emit).toHaveBeenCalledTimes(1);
              expect(component.openStateChange.emit).toHaveBeenCalledWith(false);
            });
          });
        });
      });
    });

    describe('and is clearable', () => {
      beforeEach(async () => {
        await setInputs({
          isClearable: true,
        });
      });

      describe('and bubble clear is emitted', () => {
        it('should emit clear', () => {
          spyOn(component.clear, 'emit');
          const bubbleInstance: BubbleComponent = debugElement.query(By.directive(BubbleComponent)).componentInstance;
          bubbleInstance.clear.emit(new MouseEvent(''));

          expect(component.clear.emit).toHaveBeenCalledTimes(1);
        });

        it('should close dropdown', () => {
          const bubbleInstance: BubbleComponent = debugElement.query(By.directive(BubbleComponent)).componentInstance;

          bubbleInstance.clear.emit(new MouseEvent(''));

          expect(component.isDropdownOpen).toBe(false);
        });
      });
    });

    describe('and has icon configured', () => {
      beforeEach(async () => {
        await setInputs({
          icon: 'icon.svg',
        });
      });

      it('should render icon', () => {
        const bubbleInstance: BubbleComponent = debugElement.query(By.directive(BubbleComponent)).componentInstance;

        expectRender(By.css('.Bubble__icon'), true);
        expect(bubbleInstance.icon).toEqual('icon.svg');
      });
    });
  });

  describe('When is content variant', () => {
    beforeEach(async () => {
      await setInputs({
        isBubble: false,
      });
    });
    it('should not render bubble', () => {
      expectRender(bubbleSelector, false);
    });

    it('should render title', () => {
      expectRender(By.css('.FilterTemplate__title'), true);
    });

    it('should render developer warning content', () => {
      expectRender(By.css('.FilterTemplate--warn'), true);
    });
  });

  function setInputs(props: Partial<FilterTemplateComponent>): Promise<void> {
    for (const key of Object.keys(props)) {
      component[key] = props[key];
    }
    fixture.detectChanges();
    return fixture.whenStable();
  }

  function expectRender(selector: Predicate<DebugElement>, isExpectedToRender: boolean): void {
    const element = debugElement.query(selector);

    if (isExpectedToRender) {
      expect(element).toBeTruthy();
    } else {
      expect(element).toBeFalsy();
    }
  }
});
