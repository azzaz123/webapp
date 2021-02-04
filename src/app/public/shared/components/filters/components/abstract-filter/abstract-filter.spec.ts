import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AbstractFilter } from '@public/shared/components/filters/components/abstract-filter/abstract-filter';
import { Component, DebugElement, Input, Predicate } from '@angular/core';
import { FILTER_VARIANT } from '@public/shared/components/filters/components/abstract-filter/abstract-filter.enum';
import { By } from '@angular/platform-browser';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CommonModule } from '@angular/common';
import { FilterTemplateComponent } from '@public/shared/components/filters/components/abstract-filter/filter-template/filter-template.component';
import { BubbleModule } from '@public/shared/components/bubble/bubble.module';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'abstract-filter',
  template: `
    <tsl-filter-template
      [isBubble]="isBubble()"
      [isDropdown]="isDropdown()"
      [icon]="icon"
      [counter]="filterCounter()"
      [label]="label"
      [hasValue]="hasValue()"
      (bubbleClick)="handleBubbleClick()"
    >
      <!--   Extended content   -->
      <p *ngIf="testContent" class="TestExtendedContent">{{ testContent }}</p>
      <!--   End extended content   -->
    </tsl-filter-template>
  `,
})
class TestAbstractFilterComponent extends AbstractFilter {
  @Input() testContent?: string;
  @Input() testLabel?: string;
  @Input() testIcon?: string;
  @Input() testIsDropdown?: boolean;
  @Input() testHasValue?: boolean;
  @Input() testFilterCounter?: number;

  public get label(): string | undefined {
    return this.testLabel;
  }

  public get icon(): string | undefined {
    return this.testIcon;
  }

  public isDropdown(): boolean {
    return this.testIsDropdown !== undefined ? this.testIsDropdown : super.isDropdown();
  }

  public hasValue(): boolean {
    return this.testHasValue !== undefined ? this.testHasValue : super.hasValue();
  }

  public filterCounter(): number {
    return this.testFilterCounter !== undefined ? this.testFilterCounter : super.filterCounter();
  }

  public handleBubbleClick(): void {}
}

describe('AbstractFilter', () => {
  let component: TestAbstractFilterComponent;
  let fixture: ComponentFixture<TestAbstractFilterComponent>;
  let debugElement: DebugElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, CommonModule, BubbleModule],
      declarations: [TestAbstractFilterComponent, FilterTemplateComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TestAbstractFilterComponent);
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
        variant: FILTER_VARIANT.BUBBLE,
      });
    });

    it('should render bubble component', () => {
      expectRender(By.css('.Bubble'), true);
      expectRender(By.css('.TestExtendedContent'), false);
    });

    describe('and has default behaviour', () => {
      it('should have dropdown icon', () => {
        expectRender(By.css('.Bubble__dropdown_arrow'), true);
      });

      describe('and has no value', () => {
        it('should set active variant to the bubble', () => {
          expectRender(By.css('.Bubble.active'), true);
        });
      });

      describe('and has at least one value', () => {
        beforeEach(async () => {
          await setInputs({
            value: [
              {
                key: 'key1',
                value: 'value1',
              },
              {
                key: 'key2',
                value: 'value2',
              },
            ],
          });
        });

        it('should set selected variant to the bubble', () => {
          expectRender(By.css('.Bubble.selected'), true);
        });
      });

      describe('and has more than one value', () => {
        beforeEach(async () => {
          await setInputs({
            value: [
              {
                key: 'key1',
                value: 'value1',
              },
              {
                key: 'key2',
                value: 'value2',
              },
            ],
          });
        });

        it('should set the counter to the number of values', () => {
          expectRender(By.css('.Bubble.selected'), true);
          expectTextContent(By.css('.Bubble__counter'), '2');
        });
      });
    });

    describe('and has extended behaviour', () => {
      it('should set variant to the bubble by extension', async () => {
        await setInputs({
          value: [{ key: 'key', value: 'value' }],
          testHasValue: false,
        });

        expectRender(By.css('.Bubble.active'), true);
        expectRender(By.css('.Bubble.selected'), false);

        await setInputs({
          value: [],
          testHasValue: true,
        });

        expectRender(By.css('.Bubble.active'), false);
        expectRender(By.css('.Bubble.selected'), true);
      });

      it('should render dropdown arrow by extension', async () => {
        await setInputs({
          testIsDropdown: false,
        });

        expectRender(By.css('.Bubble__dropdown_arrow'), false);
      });

      it('should render icon by extension', async () => {
        await setInputs({
          testIcon: 'icon.svg',
        });

        expectRender(By.css('.Bubble__icon'), true);
      });

      it('should render label by extension', async () => {
        await setInputs({
          testLabel: 'Test label',
        });

        expectTextContent(By.css('.Bubble__content'), 'Test label');
      });

      it('should render counter by extension', async () => {
        await setInputs({
          testFilterCounter: 8,
        });

        expectTextContent(By.css('.Bubble__counter'), '8');
      });
    });
  });

  describe('When is content variant', () => {
    beforeEach(async () => {
      await setInputs({
        variant: FILTER_VARIANT.CONTENT,
      });
    });
    it('should not render bubble', () => {
      expectRender(By.css('.Bubble'), false);
    });
    describe('with no extension', () => {
      it('should render developer warning content', () => {
        expectRender(By.css('.Bubble__dev-warn'), true);
      });
    });

    describe('with extension', () => {
      beforeEach(async () => {
        await setInputs({
          testContent: 'I am test content',
        });
      });

      it('should render child content', () => {
        expectRender(By.css('.TestExtendedContent'), true);
        expectRender(By.css('.Bubble__dev-warn'), false);
      });
    });
  });

  function setInputs(props: Partial<TestAbstractFilterComponent>): Promise<void> {
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

  function expectTextContent(selector: Predicate<DebugElement>, text: string): void {
    expectRender(selector, true);

    const element = debugElement.query(selector);

    expect(element.nativeElement.textContent.trim()).toEqual(text);
  }
});
