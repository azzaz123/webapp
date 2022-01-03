import { Story } from '@storybook/angular/types-6-0';
import { moduleMetadata } from '@storybook/angular';
import { BubbleModule } from '@public/shared/components/bubble/bubble.module';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AbstractFilter } from '@public/shared/components/filters/components/abstract-filter/abstract-filter';
import { FILTER_VARIANT } from '@public/shared/components/filters/components/abstract-filter/abstract-filter.enum';
import { FilterTemplateComponent } from '@public/shared/components/filters/components/abstract-filter/filter-template/filter-template.component';
import { HttpClientModule } from '@angular/common/http';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { ButtonModule } from '@shared/button/button.module';
import { IsBubblePipe } from '@public/shared/components/filters/components/abstract-filter/pipes/is-bubble.pipe';
import { FilterParameter } from '@public/shared/components/filters/interfaces/filter-parameter.interface';

// TODO: Investigate how to implement filter template though a directive

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'stories-abstract-filter',
  template: `
    <tsl-filter-template
      [isBubble]="variant | isBubble"
      [title]="config.title"
      [icon]="storyIcon"
      [hasApply]="config.actions?.apply"
      [isDropdown]="!storyHasNoArrow"
      [isClearable]="config.isClearable"
      [counter]="getFilterCounter()"
      [label]="getLabel()"
      [hasValue]="hasValue$ | async"
      (openStateChange)="handleOpenStateChange($event)"
      (apply)="handleApply()"
      (clear)="handleClear()"
      (click)="handleClick()"
    >
      <!--   Extended content   -->
      <div style="border: 1px dashed black; padding: 5px;" *ngIf="storyContent">
        <span (click)="valueChange.emit([])">{{ storyContent }}</span>
      </div>
      <!--   End extended content   -->
    </tsl-filter-template>
  `,
})
class StoryAbstractFilterComponent extends AbstractFilter<{}> {
  @Input() storyLabel?: string;
  @Input() storyIcon?: string;
  @Input() storyHasCustomValue?: boolean;
  @Input() storyHasCustomCounter?: boolean;
  @Input() storyFilterCounter?: boolean;
  @Input() storyHasNoArrow?: boolean;
  @Input() storyContent?: string;
  @Output() storyBubbleApply: EventEmitter<void> = new EventEmitter();
  @Output() storyClick: EventEmitter<void> = new EventEmitter();

  public getFilterCounter(): number {
    return this.storyHasCustomCounter ? 9 : super.getFilterCounter();
  }

  public getLabel(): string {
    return this.storyLabel || 'I am an extended label!';
  }

  public handleApply(): void {
    this.storyBubbleApply.emit();
  }

  public handleClick(): void {
    this.storyClick.emit();
  }

  public onValueChange(previousValue: FilterParameter[], currentValue: FilterParameter[]): void {}

  protected _hasValue(): boolean {
    return this.storyHasCustomValue ? true : super._hasValue();
  }
}

export default {
  title: 'Webapp/Public/Shared/Components/Filters/AbstractFilter',
  component: StoryAbstractFilterComponent,
  argTypes: {
    openStateChange: { action: 'We can handle open state from the parent' },
    clear: { action: 'I need to be cleared!' },
    change: { action: 'Content clicked, we need to change something!' },
    storyBubbleApply: { action: 'We can now handle bubble apply!' },
    storyClick: { action: 'I have been clicked!' },
  },
  decorators: [
    moduleMetadata({
      providers: [],
      imports: [BubbleModule, HttpClientModule, NgbDropdownModule, ButtonModule],
      declarations: [StoryAbstractFilterComponent, FilterTemplateComponent, IsBubblePipe],
    }),
  ],
};

const Template: Story<StoryAbstractFilterComponent> = (args) => ({
  props: {
    variant: FILTER_VARIANT.BUBBLE,
    ...args,
    config: {
      title: 'I am the title',
      bubblePlaceholder: 'I am the bubble placeholder',
      ...args.config,
    },
  },
});

const VariantTemplate: Story<StoryAbstractFilterComponent> = (args) => ({
  props: {
    variant: FILTER_VARIANT.BUBBLE,
    ...args,
    config: {
      title: 'I am the title',
      bubblePlaceholder: 'I am the bubble placeholder',
      ...args.config,
    },
  },
  template: `
    <div>
      <h1>Bubble variant</h1>
      <stories-abstract-filter [variant]="${FILTER_VARIANT.BUBBLE}" [value]="value" [config]="config" [storyContent]="storyContent">
      </stories-abstract-filter>
      <h1>Content variant</h1>
      <div style="border: 1px dashed black; background-color: white" class="p-3">
        <stories-abstract-filter [variant]="${FILTER_VARIANT.CONTENT}" [value]="value" [config]="config" [storyContent]="storyContent">
        </stories-abstract-filter>
      </div>
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
  value: [{ key: 'value' }],
  config: {},
  storyLabel: 'I have value!',
};

export const DefaultBubbleWithCounter = Template.bind({});
DefaultBubbleWithCounter.args = {
  value: [{ key1: 'value' }, { key2: 'value' }],
  config: {},
};

export const DefaultBubbleWithClear = Template.bind({});
DefaultBubbleWithClear.args = {
  value: [{ key1: 'value' }, { key2: 'value' }],
  config: {
    isClearable: true,
  },
  storyLabel: 'I can be cleared from the bubble!',
};

export const CustomBubbleWithValue = Template.bind({});
CustomBubbleWithValue.args = {
  value: [],
  config: {},
  storyHasCustomValue: true,
  storyLabel: 'I have no value but bubble behaviour is extended',
};

export const CustomBubbleWithCounter = Template.bind({});
CustomBubbleWithCounter.args = {
  config: {},
  value: [],
  storyHasCustomCounter: true,
  storyLabel: 'I have no counter but bubble behaviour is extended',
};

export const CustomBubbleWithoutArrow = Template.bind({});
CustomBubbleWithoutArrow.args = {
  storyLabel: 'I have no dropdown arrow! Now I am a toggle',
  storyHasNoArrow: true,
  config: {},
};

export const AllActionsBubble = Template.bind({});
AllActionsBubble.args = {
  storyLabel: 'I have all actions',
  storyContent:
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quare conare, quaeso. Primum quid tu dicis breve? Primum Theophrasti, Strato, physicum se voluit; Duo Reges: constructio interrete. Venit ad extremum; Quid enim de amicitia statueris utilitatis causa expetenda vides. Fortitudinis quaedam praecepta sunt ac paene leges, quae effeminari virum vetant in dolore. An dolor longissimus quisque miserrimus, voluptatem non optabiliorem diuturnitas facit?',
  config: {
    actions: {
      apply: true,
      cancel: true,
    },
  },
};

export const CancelActionBubble = Template.bind({});
CancelActionBubble.args = {
  storyLabel: 'I have cancel action',
  storyContent:
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quare conare, quaeso. Primum quid tu dicis breve? Primum Theophrasti, Strato, physicum se voluit; Duo Reges: constructio interrete. Venit ad extremum; Quid enim de amicitia statueris utilitatis causa expetenda vides. Fortitudinis quaedam praecepta sunt ac paene leges, quae effeminari virum vetant in dolore. An dolor longissimus quisque miserrimus, voluptatem non optabiliorem diuturnitas facit?',
  config: {
    actions: {
      cancel: true,
    },
  },
};

export const ApplyActionBubble = Template.bind({});
ApplyActionBubble.args = {
  storyLabel: 'I have apply action',
  storyContent:
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quare conare, quaeso. Primum quid tu dicis breve? Primum Theophrasti, Strato, physicum se voluit; Duo Reges: constructio interrete. Venit ad extremum; Quid enim de amicitia statueris utilitatis causa expetenda vides. Fortitudinis quaedam praecepta sunt ac paene leges, quae effeminari virum vetant in dolore. An dolor longissimus quisque miserrimus, voluptatem non optabiliorem diuturnitas facit?',
  config: {
    actions: {
      apply: true,
    },
  },
};
