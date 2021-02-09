import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DebugElement, Predicate } from '@angular/core';
import { By } from '@angular/platform-browser';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CommonModule } from '@angular/common';
import { FilterTemplateComponent } from '@public/shared/components/filters/components/abstract-filter/filter-template/filter-template.component';
import { BubbleModule } from '@public/shared/components/bubble/bubble.module';
import { NgbDropdown, NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { ButtonModule } from '@shared/button/button.module';
import { BubbleComponent } from '@public/shared/components/bubble/bubble.component';

describe('FilterTemplateComponent', () => {
  const bubbleSelector = By.css('.Bubble');

  let component: FilterTemplateComponent;
  let fixture: ComponentFixture<FilterTemplateComponent>;
  let debugElement: DebugElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, CommonModule, BubbleModule, NgbDropdownModule, ButtonModule],
      declarations: [FilterTemplateComponent],
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

    describe('when clicked on the bubble', () => {
      it('should emit click', () => {
        spyOn(component.click, 'emit');
        debugElement.query(bubbleSelector).nativeElement.click();

        expect(component.click.emit).toHaveBeenCalledTimes(1);
      });
    });

    describe('and has no value', () => {
      it('should set active variant to the bubble', () => {
        expectRender(By.css('.Bubble.active'), true);
      });
    });

    describe('and has value', () => {
      beforeEach(async () => {
        await setInputs({
          hasValue: true,
        });
      });

      it('should set selected variant to the bubble', () => {
        expectRender(By.css('.Bubble.selected'), true);
      });
    });

    describe('and is dropdown', () => {
      let dropdown: NgbDropdown;
      beforeEach(async () => {
        await setInputs({
          isDropdown: true,
        });
        dropdown = component.dropdown;
      });

      describe('and dropdown state change', () => {
        it('should emit openStateChange', () => {
          spyOn(component.openStateChange, 'emit');
          component.dropdown.openChange.emit(true);

          expect(component.openStateChange.emit).toHaveBeenCalledTimes(1);
          expect(component.openStateChange.emit).toHaveBeenCalledWith(true);
        });
      });

      describe('when clicked on bubble', () => {
        it('should toggle dropdown', () => {
          spyOn(dropdown, 'toggle');
          debugElement.query(bubbleSelector).nativeElement.click();

          expect(dropdown.toggle).toHaveBeenCalledTimes(1);
        });
      });

      describe('and dropdown is open', () => {
        beforeEach(async () => {
          dropdown.open();
          fixture.detectChanges();
          await fixture.whenStable();
        });

        it('should render developer warning content', () => {
          expectRender(By.css('.FilterTemplate__dev_warn'), true);
        });

        describe('on cancel click', () => {
          it('should close dropdown', () => {
            spyOn(dropdown, 'close');
            debugElement.query(By.css('tsl-button .dark')).nativeElement.click();

            expect(dropdown.close).toHaveBeenCalledTimes(1);
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
              spyOn(dropdown.openChange, 'emit');
              debugElement.query(applySelector).nativeElement.click();

              expect(dropdown.openChange.emit).toHaveBeenCalledTimes(1);
              expect(dropdown.openChange.emit).toHaveBeenCalledWith(false);
            });

            it('should emit apply', () => {
              spyOn(component.openStateChange, 'emit');
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
          const dropdownInstance: NgbDropdown = component.dropdown;
          spyOn(dropdownInstance, 'close');

          bubbleInstance.clear.emit(new MouseEvent(''));

          expect(dropdownInstance.close).toHaveBeenCalledTimes(1);
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
      expectRender(By.css('.FilterTemplate__dev_warn'), true);
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
