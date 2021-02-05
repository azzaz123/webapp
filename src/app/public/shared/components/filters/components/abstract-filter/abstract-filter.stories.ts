import { Story } from '@storybook/angular/types-6-0';
import { moduleMetadata } from '@storybook/angular';
import { BubbleModule } from '@public/shared/components/bubble/bubble.module';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AbstractFilter } from '@public/shared/components/filters/components/abstract-filter/abstract-filter';
import { FILTER_VARIANT } from '@public/shared/components/filters/components/abstract-filter/abstract-filter.enum';
import { FilterTemplateComponent } from '@public/shared/components/filters/components/abstract-filter/filter-template/filter-template.component';
import { HttpClientModule } from '@angular/common/http';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'stories-abstract-filter',
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
      <span class="px-3 py-0" *ngIf="storyContent">{{ storyContent }}</span>
      <!--   End extended content   -->
    </tsl-filter-template>
  `,
})
class StoryAbstractFilterComponent extends AbstractFilter {
  @Input() storyLabel?: string;
  @Input() storyIcon?: string;
  @Input() storyHasCustomValue?: boolean;
  @Input() storyHasCustomCounter?: boolean;
  @Input() storyFilterCounter?: boolean;
  @Input() storyHasNoArrow?: boolean;
  @Input() storyContent?: string;
  @Output() storyBubbleClick: EventEmitter<void> = new EventEmitter();

  isDropdown(): boolean {
    return this.storyHasNoArrow ? false : super.isDropdown();
  }

  public hasValue(): boolean {
    return this.storyHasCustomValue ? true : super.hasValue();
  }

  public filterCounter(): number {
    return this.storyHasCustomCounter ? 9 : super.filterCounter();
  }

  public get label(): string {
    return this.storyLabel || 'I am an extended label!';
  }

  public get icon(): string | undefined {
    return this.storyIcon;
  }

  // BEFOREMERGE: Seems to do it twice?
  public handleBubbleClick(): void {
    this.storyBubbleClick.emit();
  }
}

export default {
  title: 'Webapp/Public/Shared/Components/Filters/AbstractFilter',
  component: StoryAbstractFilterComponent,
  argTypes: {
    storyBubbleClick: { action: 'We can now handle bubble click!' },
  },
  decorators: [
    moduleMetadata({
      providers: [],
      imports: [BubbleModule, HttpClientModule, NgbDropdownModule],
      declarations: [StoryAbstractFilterComponent, FilterTemplateComponent],
    }),
  ],
};

const Template: Story<StoryAbstractFilterComponent> = (args) => ({
  props: args,
  component: StoryAbstractFilterComponent,
});

const VariantTemplate: Story<StoryAbstractFilterComponent> = (args) => ({
  props: args,
  component: StoryAbstractFilterComponent,
  template: `
    <div>
      <h1>Bubble variant</h1>
      <stories-abstract-filter [variant]="${FILTER_VARIANT.BUBBLE}" [value]="value" [config]="config" [storyContent]="storyContent">
      </stories-abstract-filter>
      <h1>Content variant</h1>
      <stories-abstract-filter [variant]="${FILTER_VARIANT.CONTENT}" [value]="value" [config]="config" [storyContent]="storyContent">
      </stories-abstract-filter>
    </div>
  `,
});

export const Default = VariantTemplate.bind({});
Default.args = {
  value: [],
  config: {},
};

export const ExtendedContent = VariantTemplate.bind({});
ExtendedContent.args = {
  ...Default.args,
  storyContent: 'I am extended content!',
};

export const DefaultBubbleWithIcon = Template.bind({});
DefaultBubbleWithIcon.args = {
  variant: FILTER_VARIANT.BUBBLE,
  value: [],
  config: {},
  storyLabel: 'I have an icon!',
  storyIcon: '/assets/icons/category_All.svg',
};

export const DefaultBubbleWithValue = Template.bind({});
DefaultBubbleWithValue.args = {
  variant: FILTER_VARIANT.BUBBLE,
  value: [{ key: 'value' }],
  config: {},
  storyLabel: 'I have value!',
};

export const DefaultBubbleWithCounter = Template.bind({});
DefaultBubbleWithCounter.args = {
  value: [{ key1: 'value' }, { key2: 'value' }],
};

export const CustomBubbleWithValue = Template.bind({});
CustomBubbleWithValue.args = {
  variant: FILTER_VARIANT.BUBBLE,
  value: [],
  config: {},
  storyHasCustomValue: true,
  storyLabel: 'I have no value but bubble behaviour is extended',
};

export const CustomBubbleWithCounter = Template.bind({});
CustomBubbleWithCounter.args = {
  value: [],
  storyHasCustomCounter: true,
  storyLabel: 'I have no counter but bubble behaviour is extended',
};

export const CustomBubbleWithoutArrow = Template.bind({});
CustomBubbleWithoutArrow.args = {
  storyLabel: 'I have no dropdown arrow! Now I am a toggle',
  storyHasNoArrow: true,
};
