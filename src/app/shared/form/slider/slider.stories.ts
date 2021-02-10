import { Story } from '@storybook/angular/types-6-0';
import { moduleMetadata } from '@storybook/angular';
import { Component } from '@angular/core';
import { SliderModule } from './slider.module';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HookCallbacks } from 'async_hooks';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'tsl-story-slider',
  template: `
    <h4>NgModel</h4>
    <tsl-slider [(ngModel)]="slider"></tsl-slider>
    <h4 class="mt-4">FormGroup</h4>
    <form [formGroup]="formGroup">
      <tsl-slider formControlName="slider"></tsl-slider>
    </form>
  `,
})
class StorySliderComponent {
  formGroup = new FormGroup({
    slider: new FormControl('formControlValue'),
  });

  slider: string = 'ngModelValue';
}

export default {
  title: 'Webapp/Shared/Form/Slider',
  component: StorySliderComponent,
  argTypes: {},
  decorators: [
    moduleMetadata({
      declarations: [StorySliderComponent],
      imports: [SliderModule, ReactiveFormsModule],
    }),
  ],
};

const Template: Story<StorySliderComponent> = (args) => ({
  props: args,
  template: `
      <tsl-story-slider></tsl-story-slider>
    `,
});

export const Default = Template.bind({});
