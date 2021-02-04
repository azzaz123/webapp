import { Story } from '@storybook/angular/types-6-0';
import { moduleMetadata } from '@storybook/angular';
import { BubbleModule } from '@public/shared/components/bubble/bubble.module';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AbstractFilter } from '@public/shared/components/filters/components/abstract-filter/abstract-filter';
import { FILTER_VARIANT } from '@public/shared/components/filters/components/abstract-filter/abstract-filter.enum';
import { FilterTemplateComponent } from '@public/shared/components/filters/components/abstract-filter/filter-template/filter-template.component';
import { HttpClientModule } from '@angular/common/http';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'stories-abstract-filter',
  template: `
    <tsl-filter-template
      [isDropdown]="isDropdown()"
      [icon]="icon"
      [counter]="filterCounter()"
      [label]="label"
      [hasValue]="hasValue()"
      (bubbleClick)="handleBubbleClick()"
    >
      <!--   Extended content   -->
      <p *ngIf="storyContent">{{ storyContent }}</p>
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
  @Input() storyContent?: string;
  @Output() storyBubbleClick: EventEmitter<void> = new EventEmitter();

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
    console.log('Hey');
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
      imports: [BubbleModule, HttpClientModule],
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
      <h1>Dropdown variant</h1>
      <stories-abstract-filter [variant]="${FILTER_VARIANT.DROPDOWN}" [value]="value" [config]="config" [storyContent]="storyContent">
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

export const DefaultDropdownWithIcon = Template.bind({});
DefaultDropdownWithIcon.args = {
  variant: FILTER_VARIANT.DROPDOWN,
  value: [],
  config: {},
  storyLabel: 'I have an icon!',
  storyIcon: '/assets/icons/category_All.svg',
};

export const DefaultDropdownWithValue = Template.bind({});
DefaultDropdownWithValue.args = {
  variant: FILTER_VARIANT.DROPDOWN,
  value: [{ key: 'value' }],
  config: {},
  storyLabel: 'I have value!',
};

export const DefaultDropdownWithCounter = Template.bind({});
DefaultDropdownWithCounter.args = {
  value: [{ key1: 'value' }, { key2: 'value' }],
};

export const CustomDropdownWithValue = Template.bind({});
CustomDropdownWithValue.args = {
  variant: FILTER_VARIANT.DROPDOWN,
  value: [],
  config: {},
  storyHasCustomValue: true,
  storyLabel: 'I have no value but bubble behaviour is extended',
};

export const CustomDropdownWithCounter = Template.bind({});
CustomDropdownWithCounter.args = {
  value: [],
  storyHasCustomCounter: true,
  storyLabel: 'I have no counter but bubble behaviour is extended',
};
