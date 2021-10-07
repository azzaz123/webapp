import { TranslateButtonComponent } from '@core/components/translate-button/translate-button.component';
import { moduleMetadata } from '@storybook/angular';
import { HttpModule } from '@core/http/http.module';
import { Story } from '@storybook/angular/types-6-0';
import { CoreModule } from '@core/core.module';
import { SvgIconComponent } from '@shared/svg-icon/svg-icon.component';

export default {
  title: 'Webapp/Core/Components/TranslateButton',
  component: TranslateButtonComponent,
  decorators: [
    moduleMetadata({
      declarations: [TranslateButtonComponent, SvgIconComponent],
      imports: [HttpModule, CoreModule],
    }),
  ],
};

const Template: Story<TranslateButtonComponent> = (args) => ({
  props: args,
});

export const ShowTranslation = Template.bind({});
ShowTranslation.args = {
  copies: {
    showTranslation: 'Show me the translation!',
    showOriginal: 'Show me the original!',
  },
};

export const ShowOriginal = Template.bind({});
ShowOriginal.args = {
  isTranslated: true,
  copies: {
    showTranslation: 'Show me the translation!',
    showOriginal: 'Show me the original!',
  },
};
