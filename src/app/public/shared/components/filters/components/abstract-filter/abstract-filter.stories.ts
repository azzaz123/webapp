import { AbstractFilterComponent } from '@public/shared/components/filters/components/abstract-filter/abstract-filter.component';
import { Story } from '@storybook/angular/types-6-0';
import { moduleMetadata } from '@storybook/angular';
import { BubbleModule } from '@public/shared/components/bubble/bubble.module';
import { FILTER_VARIANT } from '@public/shared/components/filters/components/abstract-filter/abstract-filter.enum';
import { Component, Input } from '@angular/core';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'stories-abstract-filter',
  template: `
    <tsl-abstract-filter>
      <p>I am the new content</p>
    </tsl-abstract-filter>
  `,
})
class StoryAbstractFilterComponent extends AbstractFilterComponent {
  @Input() storyIcon: string;

  public get label(): string {
    return 'I am an extended label!';
  }

  get filterCounter(): number {
    return 9;
  }

  public get icon(): string {
    return;
  }
}

export default {
  title: 'Webapp/Public/Shared/Components/Filters/AbstractFilter',
  component: StoryAbstractFilterComponent,
  decorators: [
    moduleMetadata({
      imports: [BubbleModule],
      declarations: [StoryAbstractFilterComponent, AbstractFilterComponent],
    }),
  ],
};

const Template: Story<AbstractFilterComponent> = (args) => ({
  props: args,
  component: StoryAbstractFilterComponent,
});

const VariantTemplate: Story<AbstractFilterComponent> = (args) => ({
  props: args,
  component: StoryAbstractFilterComponent,
  template: `
    <div>
      <h1>Dropdown variant</h1>
      <stories-abstract-filter [variant]="${FILTER_VARIANT.DROPDOWN}"></stories-abstract-filter>
      <h1>Content variant</h1>
      <stories-abstract-filter [variant]="${FILTER_VARIANT.CONTENT}"></stories-abstract-filter>
    </div>
  `,
});

const ExtendedContentTemplate: Story<AbstractFilterComponent> = (args) => ({
  props: args,
  component: StoryAbstractFilterComponent,
  template: `
    <div>
      <h1>Dropdown variant</h1>
      <stories-abstract-filter [variant]="${FILTER_VARIANT.DROPDOWN}">
        <p>I'm extended content</p>
      </stories-abstract-filter>
      <h1>Content variant</h1>
      <stories-abstract-filter [variant]="${FILTER_VARIANT.CONTENT}">
        <p>I'm extended content</p>
      </stories-abstract-filter>
    </div>
  `,
});

export const Default = VariantTemplate.bind({});

export const DropdownWithValue = Template.bind({});
DropdownWithValue.args = {
  value: [{ key: 'value' }],
};

export const DropdownWithCounter = Template.bind({});
DropdownWithCounter.args = {
  value: [{ key1: 'value' }, { key2: 'value' }],
};

export const ExtendedContent = ExtendedContentTemplate.bind({});
