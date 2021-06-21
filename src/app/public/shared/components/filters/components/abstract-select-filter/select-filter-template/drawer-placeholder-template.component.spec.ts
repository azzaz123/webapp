import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DrawerPlaceholderTemplateComponent } from './drawer-placeholder-template.component';
import { Component, DebugElement, Input } from '@angular/core';
import { By } from '@angular/platform-browser';
import { SelectOptionComponent } from '@shared/form/components/select/select-option/select-option.component';
import { SelectParentOptionComponent } from '../select-parent-option/select-parent-option.component';
import { SvgIconComponent } from '@shared/svg-icon/svg-icon.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'test-select-filter-template',
  template: `
    <tsl-drawer-placeholder-template
      [hasContentPlaceholder]="hasContentPlaceholder"
      placeholderLabel="drawerPlaceholder"
      contentTitle="contentTitle"
    >
      <div class="content"></div>
    </tsl-drawer-placeholder-template>
  `,
})
class TestSelectFilterTemplateComponent {
  @Input() hasContentPlaceholder;
}

describe('DrawerPlaceholderTemplateComponent', () => {
  const contentPredicate = By.css('.content');
  const placeholderPredicate = By.css('.SelectParentOption');
  const openPlaceholderPredicate = By.css('.SelectFilterTemplate');

  let component: DrawerPlaceholderTemplateComponent;
  let testComponent: TestSelectFilterTemplateComponent;
  let debugElement: DebugElement;
  let fixture: ComponentFixture<TestSelectFilterTemplateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [
        DrawerPlaceholderTemplateComponent,
        TestSelectFilterTemplateComponent,
        SelectParentOptionComponent,
        SelectOptionComponent,
        SvgIconComponent,
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TestSelectFilterTemplateComponent);
    testComponent = fixture.componentInstance;
    debugElement = fixture.debugElement.query(By.directive(DrawerPlaceholderTemplateComponent));
    component = debugElement.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('when it has no content placeholder', () => {
    beforeEach(() => {
      testComponent.hasContentPlaceholder = false;
      fixture.detectChanges();
    });
    it('should show content on parent', () => {
      const content = debugElement.query(contentPredicate);

      expect(content).toBeTruthy();
    });

    describe('and has the apply button', () => {
      describe('when clicking the apply button', () => {
        beforeEach(() => {
          component.isPlaceholderOpen = true;
          component.hasContentPlaceholder = true;
          component.hasApplyButtonInDrawer = true;
          fixture.detectChanges();
        });

        it('should close the placeholder', () => {
          spyOn(component.placeholderOpenStateChange, 'emit');
          const applyButton = debugElement.query(By.css('tsl-button')).nativeElement;

          applyButton.click();

          expect(component.placeholderOpenStateChange.emit).toHaveBeenCalledWith(false);
        });
        it('should apply the filter value', () => {
          spyOn(component.apply, 'emit');
          const applyButton = debugElement.query(By.css('tsl-button')).nativeElement;

          applyButton.click();

          expect(component.apply.emit).toHaveBeenCalled();
        });
      });
    });
  });

  describe('when it has content placeholder', () => {
    beforeEach(() => {
      testComponent.hasContentPlaceholder = true;
      fixture.detectChanges();
    });
    it('should show up placeholder', () => {
      const placeholder = debugElement.query(placeholderPredicate);

      expect(placeholder).toBeTruthy();
    });

    describe('and placeholder is clicked', () => {
      beforeEach(() => {
        component.isPlaceholderOpen = false;
        fixture.detectChanges();
      });

      it('should open placeholder', () => {
        const placeholder = debugElement.query(placeholderPredicate).nativeElement as HTMLElement;

        placeholder.click();
        fixture.detectChanges();

        expect(component.isPlaceholderOpen).toBeTruthy();
      });
    });

    describe('and the placeholder is cleared', () => {
      it('should emit clear', () => {
        const placeholder: SelectParentOptionComponent = debugElement.query(By.directive(SelectParentOptionComponent)).componentInstance;
        spyOn(component.clear, 'emit');

        placeholder.clear.emit();

        expect(component.clear.emit).toHaveBeenCalledTimes(1);
      });
    });

    describe('and the placeholder is open', () => {
      beforeEach(() => {
        component.isPlaceholderOpen = true;
        fixture.detectChanges();
      });

      it('should show up content on parent', () => {
        const openPlaceholder = debugElement.query(openPlaceholderPredicate);
        const content = debugElement.query(contentPredicate);

        expect(openPlaceholder).toBeTruthy();
        expect(content).toBeTruthy();
      });

      describe('and back button is clicked', () => {
        it('should close placeholder', () => {
          const backIcon = debugElement.query(By.css('.SelectFilterTemplate__back_icon')).nativeElement as HTMLElement;

          backIcon.click();
          fixture.detectChanges();

          expect(component.isPlaceholderOpen).toBeFalsy();
        });
      });
    });
  });
});
