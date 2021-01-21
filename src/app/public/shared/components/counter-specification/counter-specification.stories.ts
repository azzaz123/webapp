import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { SvgIconModule } from '@core/svg-icon/svg-icon.module';
import { CAR_SPECIFICATION_TYPE } from '@public/core/constants/item-specifications/cars-constants';
import { REAL_STATE_TYPE } from '@public/core/constants/item-specifications/realestate-constants';
import { Story, Meta } from '@storybook/angular/types-6-0';
import { CounterSpecificationComponent } from './counter-specification.component';

export default {
  title: 'Webapp/Public/Shared/CounterSpecification',
  component: CounterSpecificationComponent,
  decorators: [
    (storyFunc) => {
      const story = storyFunc();

      return {
        ...story,
        template: `<div style="width:120px">${story.template}</div>`,
      };
    },
  ],
} as Meta;

const Template: Story<CounterSpecificationComponent> = (
  args: CounterSpecificationComponent
) => ({
  component: CounterSpecificationComponent,
  props: args,
  moduleMetadata: {
    declarations: [CounterSpecificationComponent],
    imports: [CommonModule, SvgIconModule, HttpClientModule],
  },
  template:
    '<tsl-counter-specification [type]="type" [counter]="counter" [label]="label"></tsl-counter-specification>',
});

export const RealEstateType = Template.bind({});
RealEstateType.args = {
  type: REAL_STATE_TYPE.GARAGE,
};

export const CarType = Template.bind({});
CarType.args = {
  type: CAR_SPECIFICATION_TYPE.SMALL,
};

export const CounterIcon = Template.bind({});
CounterIcon.args = {
  counter: '/assets/icons/cars/new_car_ribbon.svg',
  label: 'Random',
};

export const CustomCounter = Template.bind({});
CustomCounter.args = {
  type: CAR_SPECIFICATION_TYPE.FOUR_DOORS,
  label: 4,
};

export const CustomLabel = Template.bind({});
CustomLabel.args = {
  type: REAL_STATE_TYPE.ROOMS,
  counter: 3,
};

export const CounterNumber = Template.bind({});
CounterNumber.args = { counter: 5, label: 'Random' };
