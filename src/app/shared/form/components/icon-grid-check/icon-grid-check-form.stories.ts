import { moduleMetadata } from '@storybook/angular';
import { Story } from '@storybook/angular/types-6-0';
import { HttpClientModule } from '@angular/common/http';
import { IconGridCheckFormComponent } from './icon-grid-check-form.component';
import { IconGridOption } from './interfaces/icon-grid-option';
import { CommonModule } from '@angular/common';
import { IconCheckModule } from './icon-check/icon-check.module';

export default {
  title: 'Webapp/Shared/Form/Components/IconGridCheck',
  component: IconGridCheckFormComponent,
  decorators: [
    moduleMetadata({
      declarations: [IconGridCheckFormComponent],
      imports: [HttpClientModule, CommonModule, IconCheckModule],
    }),
  ],
};

const Template: Story<IconGridCheckFormComponent> = (args) => ({
  props: args,
  component: IconGridCheckFormComponent,
  template: `
    <div style="width: 400px">
      <div style="background: white; border: 1px dashed black;">
        <tsl-icon-grid-check-form [options]="options" [columns]="columns" [isBig]="isBig"></tsl-icon-grid-check-form>
      </div>
    </div>
  `,
});

export const Default = Template.bind({});
Default.args = {
  options: getOptions(8, '/assets/icons/joke.svg', 'Joke', 'joke'),
  columns: 4,
};

export const Big = Template.bind({});
Big.args = {
  options: getOptions(8, '/assets/icons/joke.svg', 'Joke', 'joke'),
  columns: 4,
  isBig: true,
};

export const Columns3 = Template.bind({});
Columns3.args = {
  options: getOptions(8, '/assets/icons/joke.svg', 'Joke', 'joke'),
  columns: 3,
};

function getOptions(amount: number, icon: string, label: string, value: string): IconGridOption[] {
  const arr = new Array(amount).fill(undefined);
  return arr.map((a, index) => ({
    label: `${label} ${index}`,
    value: `${value}_${index}`,
    icon,
  }));
}
