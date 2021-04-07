import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { SvgIconModule } from '@core/svg-icon/svg-icon.module';
import { Story, Meta } from '@storybook/angular/types-6-0';
import { EmptyStateComponent } from './empty-state.component';

export default {
  title: 'Webapp/Public/Shared/Components/EmptyState',
  component: EmptyStateComponent,
} as Meta;

const Template: Story<EmptyStateComponent> = (args: EmptyStateComponent) => ({
  component: EmptyStateComponent,
  props: args,
  moduleMetadata: {
    declarations: [EmptyStateComponent],
    imports: [CommonModule, SvgIconModule, HttpClientModule],
  },
  template: '<tsl-empty-state [title]="title" [description]="description" [illustrationSrc]="illustrationSrc"></tsl-empty-state>',
});

export const Default = Template.bind({});
Default.args = {
  title: 'Nadie ha opinado nada',
  description: 'Esta persona no ha recibido valoraciones. ¿Será la tuya la primera?',
  illustrationSrc: '/assets/images/commons/balloon.svg',
};

export const WithoutDrawing = Template.bind({});
WithoutDrawing.args = {
  title: 'Nadie ha opinado nada',
  description: 'Esta persona no ha recibido valoraciones. ¿Será la tuya la primera?',
};
