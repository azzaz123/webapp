import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectorFilterTemplateComponent } from './selector-filter-template.component';
import { Component, DebugElement, Input } from '@angular/core';
import { By } from '@angular/platform-browser';
import { SelectorOptionComponent } from '../selector-option/selector-option.component';
import { SelectorParentOptionComponent } from '../selector-parent-option/selector-parent-option.component';
import { SvgIconComponent } from '@core/svg-icon/svg-icon/svg-icon.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'test-selector-filter-template',
  template: `
    <tsl-selector-filter-template
      [hasContentPlaceholder]="hasContentPlaceholder"
      placeholderLabel="drawerPlaceholder"
      contentTitle="contentTitle"
    >
      <div class="content"></div>
    </tsl-selector-filter-template>
  `,
})
class TestSelectorFilterTemplateComponent {
  @Input() hasContentPlaceholder;
}

describe('SelectorFilterTemplateComponent', () => {
  const contentPredicate = By.css('.content');
  const placeholderPredicate = By.css('.SelectorOption');
  const openPlaceholderPredicate = By.css('.SelectorFilterTemplate--open');

  let component: SelectorFilterTemplateComponent;
  let testComponent: TestSelectorFilterTemplateComponent;
  let debugElement: DebugElement;
  let fixture: ComponentFixture<TestSelectorFilterTemplateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [
        SelectorFilterTemplateComponent,
        TestSelectorFilterTemplateComponent,
        SelectorParentOptionComponent,
        SelectorOptionComponent,
        SvgIconComponent,
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TestSelectorFilterTemplateComponent);
    testComponent = fixture.componentInstance;
    debugElement = fixture.debugElement.query(By.directive(SelectorFilterTemplateComponent));
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
          const placeholder = debugElement.query(placeholderPredicate).nativeElement as HTMLElement;

          placeholder.click();
          fixture.detectChanges();

          expect(component.isPlaceholderOpen).toBeFalsy();
        });
      });
    });
  });
});
