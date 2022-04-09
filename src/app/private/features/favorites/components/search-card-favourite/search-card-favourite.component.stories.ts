import { Story } from '@storybook/angular/types-6-0';
import { moduleMetadata } from '@storybook/angular';
import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { SearchCardFavouriteComponent } from './search-card-favourite.component';
import { SvgIconModule } from '@shared/svg-icon/svg-icon.module';
import { FavouriteSearch } from '@api/core/model/favourites/search/favouriteSearch.interface';
import { HttpClientModule } from '@angular/common/http';
import { ButtonModule } from '@shared/button/button.module';

@Component({
  selector: 'tsl-story-search-card-favourite',
  template: `
    <div class="container" *ngFor="let favouriteSearch of favouriteSearches">
      <tsl-search-card-favourite [favouriteSearch]="favouriteSearch"></tsl-search-card-favourite>
    </div>
  `,
})
class StorySearchCardFavouriteComponent {
  @Input() favouriteSearch: FavouriteSearch[];
}
export default {
  title: 'Webapp/Private/Features/Favourites/Components/Search-Card-Favourite',
  component: StorySearchCardFavouriteComponent,
  decorators: [
    moduleMetadata({
      declarations: [StorySearchCardFavouriteComponent, SearchCardFavouriteComponent],
      imports: [CommonModule, HttpClientModule, SvgIconModule, ButtonModule],
      providers: [],
    }),
  ],
};

const Template: Story<StorySearchCardFavouriteComponent> = (args) => ({
  props: args,
  template: `
  <tsl-story-search-card-favourite [favouriteSearch]="favouriteSearch"></tsl-story-search-card-favourite>`,
});

export const Default = Template.bind({});
Default.args = {
  favouriteSearches: [
    {
      query: 'lorem ipsum malvo',
      filters: 'lorem ipsum dolor sit amet consectetur ad elit',
      isActive: true,
      gotNewResults: false,
    },
    {
      query: 'lorem ipsum malvo',
      filters: 'lorem ipsum dolor sit amet consectetur ad elit',
      isActive: true,
      gotNewResults: true,
    },
    {
      query: 'lorem ipsum malvo',
      filters: 'lorem ipsum dolor sit amet consectetur ad elit',
      isActive: false,
      gotNewResults: true,
    },
  ],
};

export const LongTitle = Template.bind({});
LongTitle.args = {
  favouriteSearches: [
    {
      query:
        'lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua ut enim ad minim veniam quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat',
      filters: 'lorem ipsum dolor sit amet consectetur ad elit',
      isActive: true,
      gotNewResults: false,
    },
    {
      query:
        'lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua ut enim ad minim veniam quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat',
      filters: 'lorem ipsum dolor sit amet consectetur ad elit',
      isActive: true,
      gotNewResults: true,
    },
    {
      query:
        'lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua ut enim ad minim veniam quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat',
      filters: 'lorem ipsum dolor sit amet consectetur ad elit',
      isActive: false,
      gotNewResults: true,
    },
  ],
};

export const LongDescription = Template.bind({});
LongDescription.args = {
  favouriteSearches: [
    {
      query: 'lorem ipsum dolor sit',
      filters:
        'lorem ipsum dolor sit amet consectetur ad elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua ut enim ad minim veniam quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat',
      isActive: true,
      gotNewResults: false,
    },
    {
      query: 'lorem ipsum dolor sit',
      filters:
        'lorem ipsum dolor sit amet consectetur ad elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua ut enim ad minim veniam quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat',
      isActive: true,
      gotNewResults: true,
    },
    {
      query: 'lorem ipsum dolor sit',
      filters:
        'lorem ipsum dolor sit amet consectetur ad elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua ut enim ad minim veniam quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat',
      isActive: false,
      gotNewResults: true,
    },
  ],
};

export const LongEverything = Template.bind({});
LongEverything.args = {
  favouriteSearches: [
    {
      query:
        'lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua ut enim ad minim veniam quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat',
      filters:
        'lorem ipsum dolor sit amet consectetur ad elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua ut enim ad minim veniam quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat',
      isActive: true,
      gotNewResults: false,
    },
    {
      query:
        'lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua ut enim ad minim veniam quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat',
      filters:
        'lorem ipsum dolor sit amet consectetur ad elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua ut enim ad minim veniam quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat',
      isActive: true,
      gotNewResults: true,
    },
    {
      query:
        'lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua ut enim ad minim veniam quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat',
      filters:
        'lorem ipsum dolor sit amet consectetur ad elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua ut enim ad minim veniam quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat',
      isActive: false,
      gotNewResults: true,
    },
  ],
};
