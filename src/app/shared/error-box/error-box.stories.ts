import { CommonModule } from '@angular/common';
import { moduleMetadata } from '@storybook/angular';
import { Story, Meta } from '@storybook/angular/types-6-0';
import { ErrorBoxComponent } from './error-box.component';
import { ERROR_BOX_EXIT_TYPE } from './interfaces/error-box-exit-type';

export default {
  title: 'Webapp/Shared/ErrorBox',
  component: ErrorBoxComponent,
  decorators: [
    moduleMetadata({
      imports: [CommonModule],
      declarations: [ErrorBoxComponent],
    }),
  ],
  argTypes: { exitClick: { action: 'exitClick' } },
} as Meta;

const Template: Story<ErrorBoxComponent> = (args: ErrorBoxComponent) => ({
  component: ErrorBoxComponent,
  props: args,
});

export const WithButton = Template.bind({});
WithButton.args = {
  img: 'https://es.dock129.wallapop.com/images/errors/error404.png',
  title: 'Nada por aquí',
  subtitle:
    'Uish... Esta página no existe en wallapop, lo que sí que existen son miles de oportunidades esperándote.',
  exit: {
    type: ERROR_BOX_EXIT_TYPE.BUTTON,
    label: 'Ver productos',
    url: 'www.wallapop.com',
  },
};

export const WithLink = Template.bind({});
WithLink.args = {
  img: 'https://es.dock129.wallapop.com/images/errors/error404.png',
  title: 'Nada por aquí',
  subtitle:
    'Uish... Esta página no existe en wallapop, lo que sí que existen son miles de oportunidades esperándote.',
  exit: {
    type: ERROR_BOX_EXIT_TYPE.LINK,
    label: 'Ver productos',
    url: 'www.wallapop.com',
  },
};

export const WithoutExit = Template.bind({});
WithoutExit.args = {
  img: 'https://es.dock129.wallapop.com/images/errors/error404.png',
  title: 'Nada por aquí',
  subtitle:
    'Uish... Esta página no existe en wallapop, lo que sí que existen son miles de oportunidades esperándote.',
};
