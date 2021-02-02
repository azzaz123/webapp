import { HereMapsComponent } from '@shared/geolocation/here-maps/here-maps.component';
import { Story } from '@storybook/angular/types-6-0';
import { moduleMetadata } from '@storybook/angular';

export default {
  title: 'Webapp/Shared/Geolocation/HereMaps',
  decorators: [
    moduleMetadata({
      declarations: [HereMapsComponent],
    }),
  ],
};

const Template: Story<HereMapsComponent> = (args) => ({
  props: args,
  component: HereMapsComponent,
});

export const Default = Template.bind({});

export const Italy = Template.bind({});
Italy.args = {
  coordinates: {
    latitude: 41.902782,
    longitude: 12.496366,
  },
};

export const ZoomedMadridExactLocation = Template.bind({});
ZoomedMadridExactLocation.args = {
  zoom: 15,
};

export const ZoomedMadridApproximateLocation = Template.bind({});
ZoomedMadridApproximateLocation.args = {
  zoom: 15,
  isApproximateLocation: true,
};
